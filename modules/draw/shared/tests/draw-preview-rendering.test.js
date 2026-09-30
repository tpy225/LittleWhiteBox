import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { indexedDB } from 'fake-indexeddb';
import { parseHTML } from 'linkedom';
import showdown from 'showdown';

// 只替换酒馆宿主边界；版本查询、选择持久化、标记识别和卡片渲染都执行生产实现。
// 使用酒馆的 Markdown 选项，不能用原文代替格式化后跨文本节点的标记。
const markdown = new showdown.Converter({
    emoji: true, literalMidWordUnderscores: true, parseImgDimensions: true,
    tables: true, underline: true, simpleLineBreaks: true, strikethrough: true,
    disableForced4SpacesIndentedSublists: true,
});
const host = { ctx: null, messageFormatting: text => markdown.makeHtml(text) };
globalThis.__drawPreviewTest = host;
globalThis.indexedDB = indexedDB;
globalThis.BroadcastChannel = undefined;
const stubs = {
    'extensions.js': 'export const getContext = () => globalThis.__drawPreviewTest.ctx;',
    'script.js': `
        export const messageFormatting = text => globalThis.__drawPreviewTest.messageFormatting(text);
        export const getRequestHeaders = () => ({});
    `,
    'utils.js': `
        export const saveBase64AsFile = async () => { throw new Error("Unexpected image upload"); };
        export const debounce = fn => fn;
    `,
    'event-manager.js': `
        export const createModuleEvents = () => ({ on() {}, cleanup() {} });
        export const event_types = {};
    `,
    'generate-interceptor.js': `
        export const GENERATE_INTERCEPTOR_ORDER = {};
        export const registerGenerateInterceptor = () => {};
        export const unregisterGenerateInterceptor = () => {};
    `,
};
const bundle = await build({
    stdin: {
        contents: "export * from './draw-common.js'; export * from './gallery-cache.js'; export * from './draw-settings.js';",
        resolveDir: fileURLToPath(new URL('..', import.meta.url)),
    },
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'node',
    plugins: [{
        name: 'preview-host-boundaries',
        setup(builder) {
            builder.onResolve({ filter: /\.js$/ }, ({ path }) => {
                const name = path.split('/').at(-1);
                return Object.hasOwn(stubs, name) ? { path: name, namespace: 'host' } : null;
            });
            builder.onLoad({ filter: /.*/, namespace: 'host' }, ({ path }) => ({ contents: stubs[path] }));
        },
    }],
});
// 只执行本测试现场构建的本地模块，没有外部输入。
// eslint-disable-next-line no-unsanitized/method
const api = await import(`data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`);

function mountMessage(t, sourceText) {
    const { document, window } = parseHTML('<html><body><div id="chat"><div class="mes" mesid="0"><div class="mes_text"></div></div></div></body></html>');
    globalThis.document = document;
    globalThis.window = window;
    const message = { mes: sourceText, name: 'Alice', extra: {} };
    host.ctx = { chatId: 'test-chat', chat: [message] };
    const root = document.querySelector('.mes_text');
    // Test-owned text formatted through the host's Markdown engine.
    // eslint-disable-next-line no-unsanitized/property
    root.innerHTML = host.messageFormatting(sourceText);
    t.after(() => api.clearPreviewObjectUrls());
    t.mock.method(globalThis, 'fetch', async () => { throw new Error('Unexpected network request'); });
    return { message, root };
}

function stagePendingSlots(root) {
    // Providers format the entire planned message before installing the new pending cards,
    // while the persisted message still contains only the old slots.
    const plannedText = `${host.ctx.chat[0].mes}\n[image:new-a]\n[image:new-b]`;
    // eslint-disable-next-line no-unsanitized/property
    root.innerHTML = host.messageFormatting(plannedText);
    const pending = ['new-a', 'new-b'].map((slotId, index) => {
        const inserted = api.insertPreviewIntoRenderedMessage({
            messageId: 0, slotId,
            html: api.buildPendingImageHtml({ slotId, messageId: 0, index: index + 1, total: 2 }),
        });
        assert.equal(inserted, true);
        return root.querySelector(`[data-slot-id="${slotId}"]`);
    });
    return pending;
}

async function seedImage(slotId, suffix, options = {}) {
    const imgId = `${slotId}-${suffix}`;
    await api.storePreview({ slotId, imgId, messageId: 0, characterName: 'Alice', base64: 'YWJj', ...options });
    return imgId;
}

for (const savedReference of [false, true]) {
    test(`appending images preserves the selected history position (${savedReference ? 'saved reference' : 'gallery selection'})`, async t => {
        const slotId = savedReference ? 'saved-history' : 'selected-history';
        const sourceText = `Before[image:${slotId}]After`;
        const { message, root } = mountMessage(t, sourceText);
        for (const suffix of ['a', 'b', 'c']) await seedImage(slotId, suffix);
        await seedImage(slotId, 'failed', { status: 'failed', base64: null });
        const versions = (await api.getPreviewsBySlot(slotId)).filter(preview => preview.status !== 'failed');
        const selected = versions[1];
        await api.setSlotSelection(slotId, selected.imgId);
        if (savedReference) {
            message.extra.xiaobaixDrawSaved = {
                [slotId]: { imgId: selected.imgId, savedUrl: '/saved-history.png' },
            };
        }
        const pending = stagePendingSlots(root);

        await api.renderPreviewsForMessage(0);

        const card = root.querySelector(`[data-slot-id="${slotId}"]`);
        assert.equal(card.dataset.imgId, selected.imgId);
        assert.equal(card.dataset.currentIndex, '1');
        assert.equal(card.dataset.historyCount, '3');
        assert.equal(card.querySelector('.xb-nd-nav-text').textContent, '2 / 3');
        assert.equal(card.querySelector('[data-action="nav-next"]').title, '下一版本');
        assert.equal(card.querySelector('[data-action="nav-prev"]').disabled, false);
        assert.equal(await api.getSlotSelection(slotId), selected.imgId);
        for (const node of pending) assert.equal(root.contains(node), true);
        assert.equal(message.mes, sourceText);
    });
}

test('a stale gallery selection displays the latest available version with a matching position', async t => {
    const slotId = 'stale-selection';
    const { root } = mountMessage(t, `[image:${slotId}]`);
    await seedImage(slotId, 'a');
    await seedImage(slotId, 'b');
    await api.setSlotSelection(slotId, 'deleted-version');
    const latest = (await api.getPreviewsBySlot(slotId))[0];
    await api.renderPreviewsForMessage(0);
    const card = root.querySelector(`[data-slot-id="${slotId}"]`);
    assert.equal(card.dataset.imgId, latest.imgId);
    assert.equal(card.dataset.currentIndex, '0');
    assert.equal(card.querySelector('[data-action="nav-next"]').title, '重新生成');
});

test('all supported marker spellings preserve the two staged cards while rendering three old images', async t => {
    for (const spelling of ['image:', 'image : ', 'image\t:\n', 'image\n\n:\n\n', 'IMAGE:']) {
        const sourceText = [1, 2, 3].map(n => `Paragraph ${n}[${spelling}old-${n}]`).join('\n');
        const { message, root } = mountMessage(t, sourceText);
        for (const n of [1, 2, 3]) await seedImage(`old-${n}`, 'image');
        const pending = stagePendingSlots(root);

        await api.renderPreviewsForMessage(0);

        assert.equal(root.querySelectorAll('.xb-nd-img').length, 5, spelling);
        for (const node of pending) assert.equal(root.contains(node), true, spelling);
        for (const n of [1, 2, 3]) assert.ok(root.querySelector(`[data-slot-id="old-${n}"] img`), spelling);
        assert.equal(message.mes, sourceText);
    }
});

test('settlement and reopening retain old images alongside newly completed and failed slots', async t => {
    const sourceText = [1, 2, 3].map(n => `Paragraph ${n}[image\n:\nsettled-${n}]`).join('\n');
    const { message, root } = mountMessage(t, sourceText);
    for (const n of [1, 2, 3]) await seedImage(`settled-${n}`, 'image');
    stagePendingSlots(root);
    await api.renderPreviewsForMessage(0);
    const oldCards = [...root.querySelectorAll('.xb-nd-img[data-state="preview"]')];
    assert.equal(oldCards.length, 3);

    await seedImage('new-a', 'complete', { savedUrl: '/saved-new-a.png' });
    await seedImage('new-b', 'failure', { base64: null, status: 'failed', errorMessage: 'generation failed' });
    message.mes = `${sourceText}\n[image:new-a]\n[image:new-b]`;
    await api.renderPreviewsForMessage(0, { refreshSlotIds: ['new-a', 'new-b'] });
    for (const node of oldCards) assert.equal(root.contains(node), true);

    // A subsequent host render must reconstruct the same five slots from saved text/gallery.
    // eslint-disable-next-line no-unsanitized/property
    root.innerHTML = host.messageFormatting(message.mes);
    await api.renderPreviewsForMessage(0);
    assert.equal(root.querySelectorAll('.xb-nd-img').length, 5);
    assert.equal(root.querySelectorAll('.xb-nd-img img').length, 4);
    assert.equal(root.querySelector('[data-slot-id="new-a"]').dataset.state, 'saved');
    assert.equal(root.querySelector('[data-slot-id="new-b"]').dataset.state, 'failed');
    for (const n of [1, 2, 3]) {
        assert.ok(root.querySelector(`[data-slot-id="settled-${n}"] img`));
        assert.equal((await api.getPreviewsBySlot(`settled-${n}`)).length, 1);
    }
});

function renderCardHtml(options = {}) {
    return parseHTML(`<div id="card-root">${api.buildImageHtml({
        slotId: 'title-slot',
        imgId: 'title-img',
        url: 'data:image/png;base64,YWJj',
        messageId: 0,
        title: '雨中相拥',
        ...options,
    })}</div>`).document.querySelector('#card-root');
}

test('buildImageHtml renders the AI title according to imageTitleMode', async t => {
    mountMessage(t, '');
    api.ensureDrawImageStyles();
    const settings = api.getSharedDrawSettings();
    const savedMode = settings.imageTitleMode;
    t.after(() => { settings.imageTitleMode = savedMode; });

    settings.imageTitleMode = 'overlay';
    const overlay = renderCardHtml();
    assert.equal(overlay.querySelectorAll('.xb-nd-details').length, 0);
    const bar = overlay.querySelector('.xb-nd-title-bar');
    assert.ok(bar);
    assert.equal(bar.textContent, '雨中相拥');
    assert.equal(bar.getAttribute('title'), '雨中相拥');
    // 懸浮條與摺疊標題同號（13px）、純色不漸變不虛化，默認隱藏、hover 圖片才顯示。
    const css = drawCommonTitleBarCss();
    assert.match(css, /\.xb-nd-title-bar\{[^}]*font-size:13px/);
    assert.match(css, /\.xb-nd-title-bar\{[^}]*min-height:22px/);
    assert.match(css, /\.xb-nd-title-bar\{[^}]*opacity:0/);
    assert.match(css, /\.xb-nd-img-wrap:hover \.xb-nd-title-bar/);
    const titleRule = css.match(/\.xb-nd-title-bar\{([^}]*)\}/)[1];
    assert.doesNotMatch(titleRule, /linear-gradient|backdrop-filter/);
    // 圖片本身必須在框內恆定置中（窄圖也不能靠左）。
    assert.match(css, /\.xb-nd-img img\{[^}]*margin:0 auto/);

    settings.imageTitleMode = 'collapse';
    const collapse = renderCardHtml();
    assert.equal(collapse.querySelectorAll('.xb-nd-title-bar').length, 0);
    const details = collapse.querySelector('details.xb-nd-details');
    assert.ok(details);
    assert.notEqual(details.getAttribute('open'), null);
    assert.match(details.querySelector('.xb-nd-summary span').textContent, /雨中相拥/);
    // ⋮ 菜單必須在 img-wrap 內：錨定圖片右上角，摺疊時隨圖片一併隱藏。
    assert.ok(collapse.querySelector('.xb-nd-details .xb-nd-img-wrap .xb-nd-menu-wrap'));
    // 標題列寬度跟隨圖片：summary 寬度吃 JS 寫入 details 的 --xb-img-w，
    // 不再放任何鏡像圖（零高度圖會被瀏覽器按比例連寬度一起縮成 0）。
    assert.equal(collapse.querySelectorAll('.xb-nd-summary-sizer,.xb-nd-summary-label').length, 0);
    assert.match(css, /\.xb-nd-details\{[^}]*width:fit-content[^}]*margin:0 auto/);
    assert.match(css, /\.xb-nd-summary\{[^}]*width:var\(--xb-img-w,auto\)/);
    // 不允許再出現把摺疊列撐滿整行的規則（回歸：標題列與圖片不同寬）。
    assert.doesNotMatch(css, /xb-nd-details:not\(\[open\]\)\)[^{]*\{[^}]*width:100%/);
    assert.doesNotMatch(css.match(/\.xb-nd-summary\{([^}]*)\}/)[1], /(?:^|;)\s*width:100%/);
    // 摺疊標題：墨藍黑實色底、反白文字（無陰影）、白色細邊框；窄屏時不超出圖片。
    const summaryRule = css.match(/\.xb-nd-summary\{([^}]*)\}/)[1];
    assert.match(summaryRule, /background:#12151c/);
    assert.match(summaryRule, /color:#fff/);
    assert.match(summaryRule, /border:1px solid #fff/);
    assert.match(summaryRule, /text-shadow:none/);
    assert.match(summaryRule, /max-width:100%/);
    // 摺疊時圖片內的功能彈窗（編輯 TAG）必須隨之關閉，不得懸在頂層遮住標題列。
    assert.match(css, /\.xb-nd-details:not\(\[open\]\) ~ \.xb-nd-edit\{[^}]*display:none/);

    settings.imageTitleMode = 'none';
    const hidden = renderCardHtml();
    assert.equal(hidden.querySelectorAll('.xb-nd-title-bar').length, 0);
    assert.equal(hidden.querySelectorAll('.xb-nd-details').length, 0);

    // 標題只取 AI title：空字符串不允許用 TAG 兜底出任何標題 UI。
    for (const mode of ['overlay', 'collapse']) {
        settings.imageTitleMode = mode;
        const empty = renderCardHtml({ title: '   ' });
        assert.equal(empty.querySelectorAll('.xb-nd-title-bar').length, 0, mode);
        assert.equal(empty.querySelectorAll('.xb-nd-details').length, 0, mode);
    }
});

function drawCommonTitleBarCss() {
    return [...document.querySelectorAll('style')].map(style => style.textContent).join('\n');
}

test('AI titles persist with previews and reappear after re-rendering', async t => {
    const slotId = 'title-persist';
    const { root } = mountMessage(t, `[image:${slotId}]`);
    const settings = api.getSharedDrawSettings();
    const savedMode = settings.imageTitleMode;
    settings.imageTitleMode = 'overlay';
    t.after(() => { settings.imageTitleMode = savedMode; });

    await seedImage(slotId, 'a', { title: '泪光中的告白' });
    const stored = (await api.getPreviewsBySlot(slotId))[0];
    assert.equal(stored.title, '泪光中的告白');

    await api.renderPreviewsForMessage(0);
    const bar = root.querySelector(`[data-slot-id="${slotId}"] .xb-nd-title-bar`);
    assert.ok(bar);
    assert.equal(bar.textContent, '泪光中的告白');
});

test('syncImageTitleElements updates the existing card without rebuilding it', async t => {
    mountMessage(t, '');
    const settings = api.getSharedDrawSettings();
    const savedMode = settings.imageTitleMode;
    t.after(() => { settings.imageTitleMode = savedMode; });

    settings.imageTitleMode = 'overlay';
    const overlayCard = renderCardHtml().firstElementChild;
    api.syncImageTitleElements(overlayCard, '折腰臣服的瞬间');
    const bar = overlayCard.querySelector('.xb-nd-title-bar');
    assert.equal(bar.textContent, '折腰臣服的瞬间');
    assert.equal(bar.getAttribute('title'), '折腰臣服的瞬间');
    api.syncImageTitleElements(overlayCard, '  ');
    assert.equal(bar.textContent, '');

    settings.imageTitleMode = 'collapse';
    const collapseCard = renderCardHtml().firstElementChild;
    const longTitle = '标题'.repeat(13);
    api.syncImageTitleElements(collapseCard, longTitle);
    const summary = collapseCard.querySelector('.xb-nd-summary span');
    const expectedSummary = `．·°∴ ☆．．·° ${'标题'.repeat(10)} °·．．☆ ∴°·．`;
    assert.equal(summary.textContent, expectedSummary);
    assert.equal(summary.textContent.length, expectedSummary.length);
    api.syncImageTitleElements(collapseCard, '');
    assert.equal(summary.textContent, '');

});

test('syncCollapseTitleWidths pins the summary bar to the measured image width', async t => {
    mountMessage(t, '');
    const settings = api.getSharedDrawSettings();
    const savedMode = settings.imageTitleMode;
    settings.imageTitleMode = 'collapse';
    t.after(() => { settings.imageTitleMode = savedMode; });

    // 可見圖片：直接以實測 clientWidth 寫入 --xb-img-w。
    const card = api.buildImageHtml({
        slotId: 'cw-open',
        imgId: 'cw-open-id',
        url: 'https://example.invalid/wide.png',
        messageId: 0,
        title: '雨中相拥',
    });
    const { document: doc1 } = parseHTML(card);
    const detailsEl = doc1.querySelector('.xb-nd-details');
    const imgEl = detailsEl.querySelector('.xb-nd-img-wrap img');
    Object.defineProperty(imgEl, 'clientWidth', { value: 512, configurable: true });
    api.syncCollapseTitleWidths(detailsEl);
    assert.equal(detailsEl.style.getPropertyValue('--xb-img-w'), '512px');

    // 摺疊態量不到 clientWidth：用固有寬度與可用行寬取小值估算。
    const collapsed = api.buildImageHtml({
        slotId: 'cw-closed',
        imgId: 'cw-closed-id',
        url: 'https://example.invalid/narrow.png',
        messageId: 0,
        title: '窄图标题',
    });
    const { document: doc2 } = parseHTML(collapsed);
    const details2 = doc2.querySelector('.xb-nd-details');
    const img2 = details2.querySelector('.xb-nd-img-wrap img');
    Object.defineProperty(img2, 'naturalWidth', { value: 800, configurable: true });
    Object.defineProperty(img2, 'clientWidth', { value: 0, configurable: true });
    Object.defineProperty(details2.parentElement, 'clientWidth', { value: 400, configurable: true });
    api.syncCollapseTitleWidths(details2);
    assert.equal(details2.style.getPropertyValue('--xb-img-w'), '392px'); // 400 - 8 padding

    // 摺疊瞬間 clientWidth 歸零：已量過的實測寬必須保留，即使父行寬遠大於圖寬，
    // 也不能被整行寬覆蓋（否則窄圖的標題列會被撐成左右滿屏）。
    Object.defineProperty(imgEl, 'naturalWidth', { value: 512, configurable: true });
    Object.defineProperty(imgEl, 'clientWidth', { value: 0, configurable: true });
    Object.defineProperty(detailsEl.parentElement, 'clientWidth', { value: 1200, configurable: true });
    api.syncCollapseTitleWidths(detailsEl);
    assert.equal(detailsEl.style.getPropertyValue('--xb-img-w'), '512px');

    // 首次估算後也視為「已量過」：摺疊態再次同步不得改寫成更寬的行寬。
    Object.defineProperty(details2.parentElement, 'clientWidth', { value: 1200, configurable: true });
    api.syncCollapseTitleWidths(details2);
    assert.equal(details2.style.getPropertyValue('--xb-img-w'), '392px');

    // 版本切換後調 syncImageTitleElements 也會順帶重測寬度。
    Object.defineProperty(imgEl, 'clientWidth', { value: 480, configurable: true });
    api.syncImageTitleElements(detailsEl, '新版本标题');
    assert.equal(detailsEl.style.getPropertyValue('--xb-img-w'), '480px');
});

test('forced cosmetic re-render keeps visible cards when the cache is momentarily empty', async t => {
    const imageSlot = 'force-img';
    const pendingSlot = 'force-pending';
    const { root } = mountMessage(t, `[image:${imageSlot}]\n[image:${pendingSlot}]`);
    const settings = api.getSharedDrawSettings();
    const savedMode = settings.imageTitleMode;
    settings.imageTitleMode = 'overlay';
    t.after(() => { settings.imageTitleMode = savedMode; });

    // 模擬中途切換標題模式：樓裡一張前台生成中、已在 DOM 但尚未入緩存的圖，
    // 外加一個生成中佔位卡；兩者在緩存裡都查不到。
    const inflightHtml = api.buildImageHtml({
        slotId: imageSlot,
        imgId: 'inflight-id',
        url: 'data:image/png;base64,YWJj',
        messageId: 0,
        title: '雨中相拥',
    });
    assert.equal(api.insertPreviewIntoRenderedMessage({
        messageId: 0, slotId: imageSlot, html: inflightHtml,
    }), true);
    assert.equal(api.insertPreviewIntoRenderedMessage({
        messageId: 0,
        slotId: pendingSlot,
        html: api.buildPendingImageHtml({ slotId: pendingSlot, messageId: 0, index: 2, total: 2 }),
    }), true);

    await api.renderPreviewsForMessage(0, { force: true });

    // 眼前的圖和生成中卡必須原樣保留，不允許被貼成「緩存丟失」。
    const imageCard = root.querySelector(`[data-slot-id="${imageSlot}"]`);
    assert.equal(imageCard.dataset.state, 'preview');
    assert.equal(imageCard.dataset.imgId, 'inflight-id');
    assert.ok(imageCard.querySelector('img'));
    assert.equal(root.textContent.includes('缓存丢失'), false);
    assert.equal(root.querySelector(`[data-slot-id="${pendingSlot}"][data-state="pending"]`) !== null, true);

    // 緩存到位後同一次 force 刷新要把卡片換成新模式的結構（標題模式切換即時生效）。
    await seedImage(imageSlot, 'cached', { title: '雨中相拥' });
    settings.imageTitleMode = 'collapse';
    await api.renderPreviewsForMessage(0, { force: true });
    const rebuilt = root.querySelector(`[data-slot-id="${imageSlot}"]`);
    assert.equal(rebuilt.dataset.imgId, `${imageSlot}-cached`);
    assert.ok(rebuilt.querySelector('details.xb-nd-details'));
    assert.equal(rebuilt.querySelectorAll('.xb-nd-title-bar').length, 0);
    // 仍然查不到緩存的生成中卡依舊保留。
    assert.equal(root.querySelector(`[data-slot-id="${pendingSlot}"][data-state="pending"]`) !== null, true);
});

test('genuinely missing anchors still rebuild from the current persisted message', async t => {
    const slotId = 'missing-anchor';
    const { message, root } = mountMessage(t, `Before[image : ${slotId}]After`);
    await seedImage(slotId, 'image');
    root.textContent = 'outdated rendering';

    await api.renderPreviewsForMessage(0);

    assert.ok(root.querySelector(`[data-slot-id="${slotId}"] img`));
    assert.ok(root.textContent.startsWith('Before'));
    assert.ok(root.textContent.endsWith('After'));
    assert.equal(message.mes, `Before[image : ${slotId}]After`);
});
