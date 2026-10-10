// 發送鎖看門狗：記錄未閉合的 fetch / Generate，生成忙碌異常持久（預設 20 秒）時
// 自動彈出診斷卡，用於定位「發送後不能再發送／swipe」是哪個請求或調用沒返回。
// 手機端無 Console 也能直接截圖。冪等，重複加載安全。

const BUSY_LIMIT_MS = 30000;
const GUARD = '__xbSendLockWatch';

export function initSendLockWatch() {
    if (window[GUARD]) return;
    window[GUARD] = 1;

    const state = { fetch: [], gen: [] };

    const pushRec = (list, rec, cap) => {
        list.push(rec);
        if (list.length > cap) list.shift();
    };

    // ---- 包裝 fetch ----
    const origFetch = window.fetch?.bind(window);
    if (typeof origFetch === 'function') {
        window.fetch = function (input, init) {
            const url = String(typeof input === 'string' || input instanceof URL ? input : input?.url ?? input);
            if (!/generate|chat-completions|backfill|sdapi|novelai|\/api\//i.test(url)) {
                return origFetch(input, init);
            }
            const rec = { url: url.slice(0, 140), at: Date.now(), st: 'pending' };
            pushRec(state.fetch, rec, 60);
            return origFetch(input, init).then(
                r => { rec.st = 'ok'; rec.ms = Date.now() - rec.at; return r; },
                e => { rec.st = 'ERR:' + (e?.name || e); rec.ms = Date.now() - rec.at; throw e; },
            );
        };
    }

    // ---- 包裝 Generate / generateRaw（延遲等 context 可用）----
    const wrapOnce = (obj, name, label) => {
        if (!obj || typeof obj[name] !== 'function' || obj[name][GUARD]) return;
        const orig = obj[name];
        const wrapped = function (...args) {
            const rec = {
                kind: `${label}(${String(args[0] ?? '').slice(0, 24)})`,
                at: Date.now(),
                st: 'pending',
                stack: (new Error().stack || '').split('\n').slice(2, 8).join('\n'),
            };
            pushRec(state.gen, rec, 30);
            try {
                const r = orig.apply(this, args);
                if (r?.then) {
                    return r.then(
                        v => { rec.st = 'ok'; rec.ms = Date.now() - rec.at; return v; },
                        e => { rec.st = 'ERR:' + (e?.name || e); rec.ms = Date.now() - rec.at; throw e; },
                    );
                }
                rec.st = 'sync';
                return r;
            } catch (e) {
                rec.st = 'throw:' + (e?.name || e);
                throw e;
            }
        };
        wrapped[GUARD] = 1;
        try { obj[name] = wrapped; } catch { /* 唯讀屬性時放棄包裝 */ }
    };

    const tryWrap = () => {
        const ctx = window.SillyTavern?.getContext?.();
        if (ctx) {
            wrapOnce(ctx, 'Generate', 'Generate');
            wrapOnce(ctx.TavernHelper, 'generateRaw', 'generateRaw');
            return true;
        }
        return false;
    };
    if (!tryWrap()) {
        const timer = setInterval(() => { if (tryWrap()) clearInterval(timer); }, 1000);
    }

    // ---- 診斷卡 ----
    const buildText = () => {
        const now = Date.now();
        const age = r => `${(Math.round((now - r.at) / 100) / 10).toFixed(1)}s`;
        const pendF = state.fetch.filter(r => r.st === 'pending');
        const pendG = state.gen.filter(r => r.st === 'pending');
        const ctx = window.SillyTavern?.getContext?.();
        const last = ctx?.chat?.at?.(-1);
        return [
            `忙碌已持續 ${age({ at: busySince || now })}（截圖給開發者）`,
            '',
            `■ 未結束 fetch（${pendF.length}）`,
            ...(pendF.length ? pendF.map(r => `[${age(r)}] ${r.url}`) : ['無']),
            '',
            `■ 未結束 Generate（${pendG.length}）`,
            ...(pendG.length ? pendG.flatMap(r => [`[${age(r)}] ${r.kind}`, r.stack]) : ['無']),
            '',
            '■ 最近 Generate 記錄',
            ...(state.gen.slice(-5).map(r => `${r.kind} = ${r.st}${r.ms ? ` (${r.ms}ms)` : ''}`)),
            '',
            `body.generating=${document.body.dataset.generating ?? '無'}`,
            `is_send_press=${ctx?.is_send_press}`,
            `send_but.disabled=${document.getElementById('send_but')?.disabled}`,
            last ? `末樓: is_user=${last.is_user} "${String(last.mes || '').slice(0, 50).replace(/\n/g, ' ')}"` : '',
        ].filter(Boolean).join('\n');
    };

    // buildFullText 在後段定義（閉包提升取用）
    const render = () => {
        const body = document.getElementById('xb-sendlive-body');
        if (body) body.textContent = buildFullText();
    };

    let overlay = null;
    const showOverlay = () => {
        if (document.getElementById('xb-sendlive-ov')) { render(); return; }
        overlay = document.createElement('div');
        overlay.id = 'xb-sendlive-ov';
        overlay.style.cssText = 'position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:14px;';
        overlay.innerHTML = `
            <div style="width:100%;max-width:560px;max-height:82vh;display:flex;flex-direction:column;background:#1e1e1e;color:#eee;border-radius:12px;overflow:hidden">
                <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-bottom:1px solid #444;font:bold 14px sans-serif">
                    <span>小白X 發送鎖診斷</span>
                    <div>
                        <button id="xb-sendlive-copy" style="margin-right:8px">複製</button>
                        <button id="xb-sendlive-close">關閉</button>
                    </div>
                </div>
                <pre id="xb-sendlive-body" style="margin:0;padding:12px 14px;overflow:auto;font:11px/1.55 ui-monospace,monospace;white-space:pre-wrap;word-break:break-all;flex:1"></pre>
            </div>`;
        document.body.appendChild(overlay);
        overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
        overlay.querySelector('#xb-sendlive-close').onclick = () => overlay.remove();
        overlay.querySelector('#xb-sendlive-copy').onclick = () => {
            const text = buildFullText();
            navigator.clipboard?.writeText(text).then(
                () => toastr?.success?.('診斷已複製'),
                () => toastr?.warning?.('複製失敗，請長按文字選擇'),
            );
        };
        render();
    };

    // ---- 生成事件時間線 ----
    const genEvents = []; // { name, at }
    const bindEvents = () => {
        const ctx = window.SillyTavern?.getContext?.();
        const es = ctx?.eventSource;
        const t = es?.event_types;
        if (!es || !t) return false;
        [t.GENERATION_STARTED, t.GENERATION_ENDED, t.GENERATION_STOPPED, t.MESSAGE_SENT, t.MESSAGE_RECEIVED]
            .filter(Boolean)
            .forEach(name => {
                try { es.makeLast?.(name, () => pushRec(genEvents, { name: String(name).split('_').pop().toUpperCase(), at: Date.now() }, 40)); }
                catch { try { es.on?.(name, () => pushRec(genEvents, { name: String(name).split('_').pop().toUpperCase(), at: Date.now() }, 40)); } catch {} }
            });
        return true;
    };
    if (!bindEvents()) {
        const evTimer = setInterval(() => { if (bindEvents()) clearInterval(evTimer); }, 1000);
    }

    // ---- 「發送被吞」偵測：任何疑似發送操作後沒啟動生成 ----
    let lastAttempt = null;   // { at, value, chatLen, stack, via }
    const attemptList = [];
    let attemptAlerted = false;

    const recordAttempt = via => {
        const ta = document.getElementById('send_textarea');
        const ctx = window.SillyTavern?.getContext?.();
        const value = String(ta?.value ?? '');
        if (!value.trim() || value.trim().startsWith('/')) return;
        lastAttempt = {
            at: Date.now(),
            via,
            value: value.slice(0, 80),
            placeholder: String(ta?.placeholder ?? ''),
            chatLen: ctx?.chat?.length ?? -1,
            stack: (new Error().stack || '').split('\n').slice(2, 14).join('\n'),
        };
        pushRec(attemptList, lastAttempt, 10);
        attemptAlerted = false;
    };

    // 全文檔捕捉：TT 手機殼可能用非標發送鈕，只要點擊目標像發送鈕就記
    document.addEventListener('pointerdown', e => {
        const el = e.target?.closest?.('#send_but, .send_but, [id*="send_but"], .mes_send_button, [aria-label*="发送"], [aria-label*="Send"]');
        if (el) recordAttempt('pointer:' + (el.id || el.className || el.tagName));
    }, true);
    document.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey && !e.isComposing && e.target?.id === 'send_textarea') {
            recordAttempt('Enter');
        }
    }, true);

    // ---- 常駐小瓢蟲：卡死時手動打開診斷 ----
    const mountBug = () => {
        if (document.getElementById('xb-sendlive-bug')) return;
        const bug = document.createElement('div');
        bug.id = 'xb-sendlive-bug';
        bug.textContent = '🐞';
        bug.title = '小白X 發送診斷';
        bug.style.cssText = 'position:fixed;left:8px;bottom:80px;z-index:2147483646;width:34px;height:34px;border-radius:50%;background:rgba(40,40,40,.55);color:#fff;font-size:17px;display:flex;align-items:center;justify-content:center;touch-action:none';
        bug.addEventListener('pointerdown', e => e.stopPropagation());
        bug.addEventListener('click', e => { e.stopPropagation(); window.xbSendLockDump?.(); });
        document.body.appendChild(bug);
    };
    mountBug();
    setInterval(mountBug, 3000);

    setTimeout(() => { try { toastr?.success?.('發送診斷 v2 已就緒（左下角🐞）', '小白X'); } catch {} }, 2500);

    const timelineBlock = () => [
        '',
        '■ 發送嘗試記錄（最近）',
        ...(attemptList.length ? attemptList.slice(-5).map(a => `${new Date(a.at).toLocaleTimeString()} 經${a.via} 樓=${a.chatLen} "${a.value.slice(0, 30)}"`) : ['無']),
        '',
        '■ 生成事件時間線（最近）',
        ...(genEvents.length ? genEvents.slice(-12).map(x => `${new Date(x.at).toLocaleTimeString()} ${x.name}`) : ['無（事件總線未掛上）']),
    ].join('\n');

    const buildExtra = () => {
        if (!lastAttempt) return timelineBlock();
        const age = ((Date.now() - lastAttempt.at) / 1000).toFixed(1);
        const ctx = window.SillyTavern?.getContext?.();
        const ta = document.getElementById('send_textarea');
        const globals = Object.keys(window).filter(k => /acu|qrf|shujuku|zero|mvu/i.test(k)).join(', ') || '無';
        return [
            '',
            `■ 最近發送嘗試（${age}s 前，經${lastAttempt.via}）`,
            `輸入框 placeholder：${lastAttempt.placeholder || '（空）'}`,
            `當前 placeholder：${String(ta?.placeholder ?? '') || '（空）'}`,
            `當前輸入值：${String(ta?.value ?? '').slice(0, 80) || '（空）'}`,
            `聊天樓數：${lastAttempt.chatLen} → ${ctx?.chat?.length ?? '?'}`,
            `相關全局：${globals}`,
            '',
            '發送時堆疊：',
            lastAttempt.stack,
            timelineBlock(),
        ].join('\n');
    };

    const buildFullText = () => buildText() + buildExtra();

    window.xbSendLockDump = () => { showOverlay(); return buildFullText(); };

    // ---- 看門狗：忙碌逾時 OR 發送被吞 ----
    let busySince = null;
    let alerted = false;
    setInterval(() => {
        const ctx = window.SillyTavern?.getContext?.();
        const busy = document.body.dataset.generating != null
            || ctx?.is_send_press === true
            || document.getElementById('send_but')?.disabled === true;
        if (busy) {
            if (!busySince) busySince = Date.now();
            if (!alerted && Date.now() - busySince > BUSY_LIMIT_MS) {
                alerted = true;
                try { toastr?.error?.('生成忙碌已逾 30 秒未結束，彈出發送鎖診斷（可截圖）', '小白X'); } catch {}
                showOverlay();
            }
        } else {
            busySince = null;
            alerted = false;
        }

        // 發送嘗試後 10 秒：沒有任何生成事件，視為被輸入管線吞掉
        if (lastAttempt && !attemptAlerted && Date.now() - lastAttempt.at > 10000 && !busy) {
            const startedAfter = genEvents.some(x => x.name === 'STARTED' && x.at >= lastAttempt.at - 500);
            const sentAfter = genEvents.some(x => x.name === 'SENT' && x.at >= lastAttempt.at - 500);
            if (!startedAfter && !sentAfter) {
                attemptAlerted = true;
                try { toastr?.error?.('發送疑似被插件吞掉，彈出診斷（可截圖）', '小白X'); } catch {}
                showOverlay();
            }
        }

        if (document.getElementById('xb-sendlive-ov')) render();
    }, 1000);
}
