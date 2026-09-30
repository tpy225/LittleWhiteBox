import { getContext } from "../../../../../../extensions.js";
import {
    getDisplayPreviewForSlot,
    getPreviewsBySlot,
    getPreviewDisplayUrl,
    subscribeGalleryCacheChanges,
    warmSlotPreviewNeighbors,
} from "./gallery-cache.js";
import {
    ScenePlannerError,
} from "./scene-plan-contract.js";
import { ScenePlacementError } from './scene-placement.js';
import { getRenderedSceneSlotIds, replaceSceneSlotElements } from './scene-slot-dom.js';
import { getPendingImageJobSlots, PendingJobState } from './pending-image-jobs.js';
import { createDrawImageSlotRegex } from './image-marker-syntax.js';
import { classifyScenePlannerErrorForUi } from "./scene-planner-error-ui.js";
import { getSharedDrawSettings, normalizeImageTitleMode } from './draw-settings.js';
import { isCharacterEnabled } from './character-selection.js';
import { joinTags } from './character-prompts.js';
import { createModuleEvents, event_types } from "../../../core/event-manager.js";
import {
    GENERATE_INTERCEPTOR_ORDER,
    registerGenerateInterceptor,
    unregisterGenerateInterceptor,
} from "../../../shared/common/generate-interceptor.js";

const DRAW_IMAGE_HTML_REGEX = /<div\b[^>]*class=(["'])[^"']*\bxb-nd-img\b[^"']*\1[^>]*>[\s\S]*?<\/div>/gi;
const DRAW_SAVED_EXTRA_KEY = 'xiaobaixDrawSaved';
const LEGACY_NOVEL_SAVED_EXTRA_KEY = 'novelDrawSaved';
const INITIAL_RENDER_MESSAGE_LIMIT = 1;

let drawPreviewRuntimeEvents = null;
let drawPreviewRuntimeRefs = 0;
let drawPreviewMessageObserver = null;
let drawPreviewRuntimeGeneration = 0;
let drawPreviewCacheSyncCleanup = null;
const drawPreviewPendingTimers = new Set();
const drawPreviewRenderQueues = new WeakMap();

export const ImageState = {
    PREVIEW: 'preview',
    SAVING: 'saving',
    SAVED: 'saved',
    REFRESHING: 'refreshing',
    FAILED: 'failed',
};

/** Tabler reload glyph; 1em/currentColor so it inherits each button's size and color. */
export const RELOAD_ICON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="display:block;flex:none;"><path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747"></path><path d="M20 4v5h-5"></path></svg>';

export const ErrorType = {
    INPUT: { code: 'input', label: '正文输入', desc: '正文没有可用的配图内容' },
    NETWORK: { code: 'network', label: '网络', desc: '连接超时或网络不稳定' },
    AUTH: { code: 'auth', label: '认证', desc: '认证信息无效或过期' },
    QUOTA: { code: 'quota', label: '额度', desc: '额度不足' },
    BUSY: { code: 'busy', label: '繁忙', desc: '当前并发繁忙，请稍后重试' },
    PARSE: { code: 'parse', label: '解析失败', desc: 'LLM 输出未解析为图片任务' },
    LLM: { code: 'llm', label: 'LLM失败', desc: '场景分析失败' },
    LLM_EMPTY: { code: 'llm_empty', label: '空回', desc: 'LLM 未返回内容' },
    TIMEOUT: { code: 'timeout', label: '超时', desc: '请求超时' },
    AGENT_CONFIG: { code: 'agent_config', label: 'Agent 配置', desc: '共享 Agent 主预设不可用' },
    PROMPT_EXPANSION: { code: 'prompt_expansion', label: 'Prompt 展开', desc: 'Prompt 宏展开失败，请检查提示词中的变量宏' },
    TOOL_PROTOCOL: { code: 'tool_protocol', label: 'Tool 协议', desc: '模型没有按要求调用场景规划 Tool' },
    SCENE_SCHEMA: { code: 'scene_schema', label: '计划校验', desc: '模型提交的场景计划不符合契约' },
    PROVIDER: { code: 'provider', label: 'Provider', desc: '模型 Provider 请求失败' },
    SCENE_PLACEMENT: { code: 'scene_placement', label: '插图位置', desc: '正文位置已变化，未写入图片' },
    ABORTED: { code: 'aborted', label: '已取消', desc: '场景规划已取消' },
    UNKNOWN: { code: 'unknown', label: '错误', desc: '未知错误' },
    CACHE_LOST: { code: 'cache_lost', label: '缓存丢失', desc: '图片缓存已过期' },
    JOB_EXPIRED: { code: 'job_expired', label: '后台任务已失效', desc: '后台任务已过期或被清理，可重新生成' },
    JOB_NOT_SUBMITTED: { code: 'job_not_submitted', label: '任务未提交', desc: '后台任务未提交成功，可重新生成' },
};

export const DEFAULT_MESSAGE_FILTER_RULES = [
    { start: '<think>',    end: '</think>' },
    { start: '<thinking>', end: '</thinking>' },
    { start: '<system>',   end: '</system>' },
    { start: '<meta>',     end: '</meta>' },
    { start: '<options>',  end: '</options>' },
    { start: '<WorldState>', end: '</WorldState>' },
    { start: '<state>',    end: '</state>' },
    { start: '<UpdateVariable>', end: '</UpdateVariable>' },
    { start: '<—',         end: '—>' },
    { start: '',           end: '</think>' },
];

export function toScenePlannerProgress(diagnostic = {}) {
    const phase = diagnostic?.progress?.phase;
    return { phase: phase === 'correction' ? 'correction' : 'analysis' };
}

export function formatScenePlannerProgress(progress = {}) {
    return toScenePlannerProgress({ progress }).phase === 'correction' ? '纠错' : '分析';
}

export function createPlaceholder(slotId) {
    return `[image:${slotId}]`;
}

function stripDrawImageHtml(text) {
    const value = String(text || '');
    if (!value.includes('xb-nd-img')) return value;
    if (typeof document === 'undefined') return value.replace(DRAW_IMAGE_HTML_REGEX, '');

    const template = document.createElement('template');
    // Local chat markup generated by the draw modules.
    // eslint-disable-next-line no-unsanitized/property
    template.innerHTML = value;
    template.content.querySelectorAll('.xb-nd-img').forEach(node => node.remove());
    return template.innerHTML || '';
}

export function stripDrawArtifactsFromMessage(text) {
    return stripDrawImageHtml(text).replace(createDrawImageSlotRegex(), '');
}

export function stripDrawArtifactsFromChat(chat) {
    if (!Array.isArray(chat)) return;
    for (const msg of chat) {
        if (!msg) continue;
        if (typeof msg.mes === 'string') {
            msg.mes = stripDrawArtifactsFromMessage(msg.mes);
        }
        if (typeof msg.content === 'string') {
            msg.content = stripDrawArtifactsFromMessage(msg.content);
        } else if (Array.isArray(msg.content)) {
            for (const part of msg.content) {
                if (part && typeof part.text === 'string') {
                    part.text = stripDrawArtifactsFromMessage(part.text);
                }
            }
        }
    }
}

export function setupDrawGenerateInterceptor(options = {}) {
    const shouldStrip = typeof options.shouldStrip === 'function' ? options.shouldStrip : () => true;
    registerGenerateInterceptor('draw', (chat) => {
        if (!shouldStrip()) return;
        stripDrawArtifactsFromChat(chat);
    }, GENERATE_INTERCEPTOR_ORDER.DRAW);
}

export function cleanupDrawGenerateInterceptor() {
    unregisterGenerateInterceptor('draw');
}

export { joinTags };

export function escapeHtml(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function escapeRegexChars(str) {
    return String(str || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeNamedTagList(list = []) {
    return (Array.isArray(list) ? list : [])
        .map(item => ({
            name: String(item?.name || '').trim(),
            tags: String(item?.tags || '').trim(),
        }))
        .filter(item => item.name || item.tags);
}

export function detectPresentCharacters(messageText, characterTags) {
    if (!messageText || !characterTags?.length) return [];
    const text = messageText.toLowerCase();
    const present = [];

    for (const char of characterTags) {
        if (!isCharacterEnabled(char) || !char.name) continue;
        const names = [char.name, ...(char.aliases || [])].filter(Boolean);
        const isPresent = names.some(name => {
            const lowerName = String(name).toLowerCase();
            return text.includes(lowerName) || new RegExp(`\\b${escapeRegexChars(lowerName)}\\b`, 'i').test(text);
        });

        if (isPresent) {
            present.push({
                name: char.name,
                aliases: char.aliases || [],
                type: char.type || 'girl',
                appearance: char.appearance || '',
                danbooruTag: char.danbooruTag || '',
                negativeTags: char.negativeTags || '',
                outfits: normalizeNamedTagList(char.outfits),
                dynamicStates: normalizeNamedTagList(char.dynamicStates),
            });
        }
    }
    return present;
}

export function findLastAIMessageId() {
    const ctx = getContext();
    const chat = ctx.chat || [];
    let id = chat.length - 1;
    while (id >= 0 && chat[id]?.is_user) id--;
    return id;
}

export function classifyError(error) {
    if (error instanceof ScenePlannerError) {
        return classifyScenePlannerErrorForUi(error, ErrorType);
    }
    if (error instanceof ScenePlacementError) {
        return { ...ErrorType.SCENE_PLACEMENT, desc: error.message || ErrorType.SCENE_PLACEMENT.desc };
    }
    if (error?.errorType) return error.errorType;
    // 带 HTTP status 的后端错误优先按 status 分类：上游正文常常不写数字，靠 message 匹配会退化成未知错误。
    const status = Number(error?.status) || 0;
    if (status === 401 || status === 403) return ErrorType.AUTH;
    if (status === 402) return ErrorType.QUOTA;
    if (status === 429) return ErrorType.BUSY;
    if (status === 408 || status === 504) return ErrorType.TIMEOUT;
    const msg = String(error?.message || error || '').toLowerCase();
    if (msg.includes('network') || msg.includes('fetch') || msg.includes('failed to fetch')) return ErrorType.NETWORK;
    if (msg.includes('401') || msg.includes('key') || msg.includes('auth')) return ErrorType.AUTH;
    if (msg.includes('429') || msg.includes('too many requests') || msg.includes('rate limit') || msg.includes('请求频繁') || msg.includes('busy')) return ErrorType.BUSY;
    if (msg.includes('402') || msg.includes('anlas') || msg.includes('quota')) return ErrorType.QUOTA;
    if (msg.includes('timeout') || msg.includes('abort')) return ErrorType.TIMEOUT;
    if (msg.includes('输出为空') || msg.includes('empty_output') || msg.includes('未返回内容')) return ErrorType.LLM_EMPTY;
    if (msg.includes('parse') || msg.includes('json')) return ErrorType.PARSE;
    if (msg.includes('无法解析') || msg.includes('未解析到图片任务')) return ErrorType.PARSE;
    if (msg.includes('llm') || msg.includes('xbgenraw')) return ErrorType.LLM;
    return { ...ErrorType.UNKNOWN, desc: error?.message || '未知错误' };
}

export function ensureDrawImageStyles() {
    if (document.getElementById('xiaobaix-draw-image-styles')) return;
    const style = document.createElement('style');
    style.id = 'xiaobaix-draw-image-styles';
    style.textContent = `
.xb-nd-img{margin:0.8em 0;text-align:center;position:relative;display:block;width:100%;border-radius:14px;padding:4px}
.xb-nd-img.busy img{opacity:0.5}
.xb-nd-img-wrap{position:relative;overflow:hidden;border-radius:10px;touch-action:pan-y pinch-zoom}
.xb-nd-img img{width:auto;height:auto;max-width:100%;margin:0 auto;border-radius:10px;cursor:pointer;box-shadow:0 3px 15px rgba(0,0,0,0.25);display:block;user-select:none;-webkit-user-drag:none;transition:transform 0.25s ease,opacity 0.2s ease}
.xb-nd-img img.sliding-left{animation:ndSlideOutLeft 0.25s ease forwards;will-change:transform,opacity}
.xb-nd-img img.sliding-right{animation:ndSlideOutRight 0.25s ease forwards;will-change:transform,opacity}
.xb-nd-img img.sliding-in-left{animation:ndSlideInLeft 0.25s ease forwards;will-change:transform,opacity}
.xb-nd-img img.sliding-in-right{animation:ndSlideInRight 0.25s ease forwards;will-change:transform,opacity}
@keyframes ndSlideOutLeft{from{transform:translateX(0);opacity:1}to{transform:translateX(-30%);opacity:0}}
@keyframes ndSlideOutRight{from{transform:translateX(0);opacity:1}to{transform:translateX(30%);opacity:0}}
@keyframes ndSlideInLeft{from{transform:translateX(30%);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes ndSlideInRight{from{transform:translateX(-30%);opacity:0}to{transform:translateX(0);opacity:1}}
.xb-nd-nav-pill{position:absolute;bottom:10px;left:10px;display:inline-flex;align-items:center;gap:2px;background:rgba(0,0,0,0.75);border-radius:20px;padding:4px 6px;font-size:12px;color:rgba(255,255,255,0.8);font-weight:500;user-select:none;z-index:5;opacity:0.72;transition:opacity 0.2s}
.xb-nd-nav-pill:hover{opacity:0.92}
.xb-nd-nav-arrow{width:24px;height:24px;border:none;background:transparent;color:rgba(255,255,255,0.8);cursor:pointer;display:flex;align-items:center;justify-content:center;border-radius:50%;font-size:14px;transition:background 0.15s,color 0.15s;padding:0}
.xb-nd-nav-arrow:hover{background:rgba(255,255,255,0.15);color:#fff}
.xb-nd-nav-arrow:disabled{opacity:0.3;cursor:not-allowed}
.xb-nd-nav-text{min-width:36px;text-align:center;font-variant-numeric:tabular-nums;padding:0 2px}
@media(hover:none),(pointer:coarse){.xb-nd-nav-pill{opacity:0.78;padding:5px 8px}}
.xb-nd-title-bar{position:absolute;top:0;left:0;right:0;z-index:6;pointer-events:none;display:flex;align-items:center;min-height:22px;padding:3px 44px 3px 10px;background:rgba(0,0,0,0.55);font-size:13px;line-height:1.4;letter-spacing:0.02em;color:rgba(255,255,255,0.95);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-shadow:0 1px 2px rgba(0,0,0,0.6);opacity:0;transition:opacity 0.2s ease}
.xb-nd-img-wrap:hover .xb-nd-title-bar,.xb-nd-img-wrap.title-show .xb-nd-title-bar{opacity:1}
/* details 收縮到內容寬並置中；摺疊標題列寬度吃 JS 量得的圖片實寬（--xb-img-w），
   變量未就緒時 auto 回退為貼文字的初始膠囊。 */
.xb-nd-details{width:fit-content;max-width:100%;margin:0 auto;border-radius:10px;overflow:hidden}
.xb-nd-summary{list-style:none;cursor:pointer;width:var(--xb-img-w,auto);max-width:100%;box-sizing:border-box;padding:4px 8px;background:#12151c;border:1px solid #fff;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:13px;line-height:1.3;color:#fff;text-shadow:none;user-select:none}
.xb-nd-summary::-webkit-details-marker{display:none}
.xb-nd-summary span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-shadow:none}
/* 摺疊時懸浮的編輯彈窗必須隨之隱藏（JS 會把內聯 display 重置為 none，這條兜底防閃現） */
.xb-nd-details:not([open]) ~ .xb-nd-edit{display:none!important}
.xb-nd-menu-wrap{position:absolute;top:8px;right:8px;z-index:10}
.xb-nd-menu-wrap.busy{pointer-events:none;opacity:0.3}
.xb-nd-menu-trigger{width:32px;height:32px;border-radius:50%;border:none;background:rgba(0,0,0,0.75);color:rgba(255,255,255,0.85);cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;transition:all 0.15s;opacity:0.85}
.xb-nd-menu-wrap.open .xb-nd-dropdown{display:flex;opacity:1;visibility:visible;transform:translateY(0) scale(1);pointer-events:auto}
.xb-nd-dropdown{position:absolute;top:calc(100% + 4px);right:0;background:rgba(20,20,24,0.98);border:1px solid rgba(255,255,255,0.12);border-radius:16px;padding:4px;display:none;flex-direction:column;gap:2px;opacity:0;visibility:hidden;transform:translateY(-4px) scale(0.96);transform-origin:top right;transition:all 0.15s ease;box-shadow:0 8px 24px rgba(0,0,0,0.4);pointer-events:none}
.xb-nd-dropdown button{width:32px;height:32px;border:none;background:transparent;color:rgba(255,255,255,0.85);cursor:pointer;font-size:14px;border-radius:50%;display:flex;align-items:center;justify-content:center;transition:background 0.15s;padding:0;margin:0}
.xb-nd-indicator{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.85);padding:8px 16px;border-radius:8px;color:#fff;font-size:12px;z-index:10}
.xb-nd-edit{animation:nd-slide-up 0.2s ease-out}
.xb-nd-edit-scroll{max-height:250px;overflow-y:auto;margin-bottom:8px}
.xb-nd-edit-scroll::-webkit-scrollbar{width:4px}
.xb-nd-edit-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.2);border-radius:2px}
.xb-nd-edit-group{margin-bottom:8px}
.xb-nd-edit-group:last-child{margin-bottom:0}
.xb-nd-edit-group-label{font-size:10px;color:rgba(255,255,255,0.58);margin-bottom:4px}
.xb-nd-edit-input{width:100%;min-height:60px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:6px;color:#722F37;font-size:12px;padding:8px;resize:vertical;font-family:monospace}
.xb-nd-failed-icon{color:rgba(248,113,113,0.9);font-size:24px;margin-bottom:8px}
.xb-nd-failed-title{color:rgba(255,255,255,0.7);font-size:13px;margin-bottom:4px}
.xb-nd-failed-desc{color:rgba(255,255,255,0.4);font-size:11px;margin-bottom:12px}
.xb-nd-failed-btns{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}
.xb-nd-failed-btns button{padding:8px 16px;border-radius:8px;font-size:12px;cursor:pointer;transition:all 0.15s}
.xb-nd-retry-btn{border:1px solid rgba(212,165,116,0.5);background:rgba(212,165,116,0.2);color:#fff}
.xb-nd-edit-btn{border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.1);color:#fff}
.xb-nd-remove-btn{border:1px solid rgba(248,113,113,0.3);background:transparent;color:rgba(248,113,113,0.8)}
@keyframes nd-slide-up{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeInOut{0%{opacity:0;transform:translateX(-50%) translateY(-10px)}15%{opacity:1;transform:translateX(-50%) translateY(0)}85%{opacity:1;transform:translateX(-50%) translateY(0)}100%{opacity:0;transform:translateX(-50%) translateY(-10px)}}
`;
    document.head.appendChild(style);
}

export function buildImageHtml({ slotId, imgId, url, tags, positive, messageId, state = ImageState.PREVIEW, historyCount = 1, currentIndex = 0, title = '' }) {
    const escapedTags = escapeHtml(tags);
    const escapedPositive = escapeHtml(positive);
    const isPreview = state === ImageState.PREVIEW;
    const isBusy = state === ImageState.SAVING || state === ImageState.REFRESHING;
    let indicator = '';
    if (state === ImageState.SAVING) indicator = '<div class="xb-nd-indicator">💾 保存中...</div>';
    else if (state === ImageState.REFRESHING) indicator = '<div class="xb-nd-indicator"><i class="fa-solid fa-rotate" aria-hidden="true"></i> 生成中...</div>';

    const lazyAttr = String(url || '').startsWith('data:') ? '' : 'loading="lazy"';
    const displayVersion = historyCount - currentIndex;
    // 标题只取 AI 生成的 title；缺省（旧数据/模型漏填）时宁可不显示，也不拿 TAG 充数。
    const rawTitle = String(title || '').trim();
    const titleMode = normalizeImageTitleMode(getSharedDrawSettings().imageTitleMode);
    const navPill = `<div class="xb-nd-nav-pill" data-total="${historyCount}" data-current="${currentIndex}">
        <button class="xb-nd-nav-arrow" data-action="nav-prev" title="上一版本" ${currentIndex >= historyCount - 1 ? 'disabled' : ''}>‹</button>
        <span class="xb-nd-nav-text">${displayVersion} / ${historyCount}</span>
        <button class="xb-nd-nav-arrow" data-action="nav-next" title="${currentIndex === 0 ? '重新生成' : '下一版本'}">›</button>
    </div>`;
    const menuBusy = isBusy ? ' busy' : '';
    const menuHtml = `<div class="xb-nd-menu-wrap${menuBusy}">
        <button class="xb-nd-menu-trigger" data-action="toggle-menu" title="操作">⋮</button>
        <div class="xb-nd-dropdown">
            <button data-action="save-image" title="保存">💾</button>
            <button data-action="refresh-image" title="重新生成">${RELOAD_ICON_SVG}</button>
            <button data-action="edit-tags" title="编辑 TAG">✎</button>
            <button data-action="delete-image" title="删除">🗑️</button>
        </div>
    </div>`;

    const imageWrap = `<div class="xb-nd-img-wrap">
    <img src="${escapeHtml(url)}" alt="Generated image" ${lazyAttr} data-action="open-gallery" data-slot-id="${slotId}" data-img-id="${imgId}" data-mesid="${messageId}"/>
    ${titleMode === 'overlay' && rawTitle ? `<div class="xb-nd-title-bar" title="${escapeHtml(rawTitle)}">${escapeHtml(rawTitle)}</div>` : ''}
    ${indicator}
    ${navPill}
    ${menuHtml}
</div>`;
    const imageFrame = (() => {
        if (titleMode === 'collapse' && rawTitle) {
            const collapseTitle = rawTitle.slice(0, 20);
            // 標題列寬度由 JS 量得的圖片實寬寫入 --xb-img-w（見 syncCollapseTitleWidths），
            // 摺疊後主圖被 details 隱藏也能保持與圖片同寬；變量未就緒時回退初始的文字膠囊。
            return `<details class="xb-nd-details" open>
    <summary class="xb-nd-summary"><span>．·°∴ ☆．．·° ${escapeHtml(collapseTitle)} °·．．☆ ∴°·．</span></summary>
${imageWrap}
</details>`;
        }
        return imageWrap;
    })();

    return `<div class="xb-nd-img" data-slot-id="${slotId}" data-img-id="${imgId}" data-tags="${escapedTags}" data-positive="${escapedPositive}" data-mesid="${messageId}" data-state="${state}" data-current-index="${currentIndex}" data-history-count="${historyCount}" style="margin:0.8em 0;text-align:center;position:relative;display:block;width:100%;border-radius:14px;padding:2px;">
${imageFrame}
<div class="xb-nd-edit" style="display:none;position:absolute;bottom:8px;left:8px;right:8px;background:rgba(0,0,0,0.9);border-radius:10px;padding:10px;text-align:left;z-index:15;">
    <div style="font-size:11px;color:rgba(255,255,255,0.6);margin-bottom:6px;">编辑 TAG（场景描述）</div>
    <textarea class="xb-nd-edit-input" style="width:100%;min-height:60px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:6px;color:#fff;font-size:12px;padding:8px;resize:vertical;font-family:monospace;">${escapedTags}</textarea>
    <div style="display:flex;gap:6px;margin-top:8px;">
        <button data-action="save-tags" style="flex:1;padding:6px 12px;background:rgba(212,165,116,0.3);border:1px solid rgba(212,165,116,0.5);border-radius:6px;color:#fff;font-size:12px;cursor:pointer;">保存 TAG</button>
        <button data-action="cancel-edit" style="padding:6px 12px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:6px;color:#fff;font-size:12px;cursor:pointer;">取消</button>
    </div>
</div>
</div>`;
}

// 版本切换时只换 img 不重建卡片，标题条/折叠摘要里的文字需要就地同步成新版本的 title。
export function syncImageTitleElements(container, title = '') {
    if (!container?.querySelector) return;
    const rawTitle = String(title || '').trim();
    const bar = container.querySelector('.xb-nd-title-bar');
    if (bar) {
        bar.textContent = rawTitle;
        bar.setAttribute('title', rawTitle);
    }
    const summary = container.querySelector('.xb-nd-summary span');
    if (summary) {
        summary.textContent = rawTitle
            ? `．·°∴ ☆．．·° ${rawTitle.slice(0, 20)} °·．．☆ ∴°·．`
            : '';
    }
    // 版本切換換了主圖 src，摺疊標題列寬度需按新圖重測。
    syncCollapseTitleWidths(container);
}

// 把摺疊標題列寬度釘成圖片實寬（寫入 details 上的 --xb-img-w）。
// 摺疊時主圖被 details 隱藏、clientWidth=0：已量過就沿用展開時的實測值（摺疊瞬間若用
// 父行寬估算會把窄圖的標題列撐成整行寬）；只有從未量過時才用固有寬度兜底估算一次。
export function syncCollapseTitleWidths(scope = document) {
    if (!scope?.querySelectorAll) return;
    const detailsList = typeof scope.matches === 'function' && scope.matches('.xb-nd-details')
        ? [scope]
        : Array.from(scope.querySelectorAll('.xb-nd-details'));
    for (const details of detailsList) {
        const img = details.querySelector('.xb-nd-img-wrap img');
        if (!img) continue;
        const visibleWidth = img.clientWidth || 0;
        const measured = parseFloat(details.style.getPropertyValue('--xb-img-w')) || 0;
        if (visibleWidth > 0) {
            details.style.setProperty('--xb-img-w', `${Math.round(visibleWidth)}px`);
        } else if (!measured && img.naturalWidth) {
            const outer = details.parentElement;
            const available = outer?.clientWidth
                ? outer.clientWidth - 8 // summary 左右 padding
                : img.naturalWidth;
            details.style.setProperty('--xb-img-w', `${Math.max(0, Math.round(Math.min(img.naturalWidth, available)))}px`);
        }
    }
}

// 未完成槽位的统一占位卡。label 由调用方按真实状态给出（等待生成 / 接回后台任务 /
// 等待重新连接…），绝不伪造进度：chat 正文里只持久化 [image:slotId] 这个排版事实，
// 状态文案永远是当前运行时和后端状态动态渲染出来的。
export function buildPendingImageHtml({ slotId, messageId, index = 0, total = 0, label = '等待生成' }) {
    const progress = total > 0 ? `${Math.max(1, Number(index) || 1)} / ${total}` : '';
    return `<div class="xb-nd-img" data-slot-id="${escapeHtml(slotId)}" data-mesid="${escapeHtml(messageId)}" data-state="pending" style="margin:0.8em 0;text-align:center;position:relative;display:block;width:100%;color:inherit;">
<div class="xb-nd-indicator" style="position:static;transform:none;display:inline-block;">🎨 ${escapeHtml(label)}${progress ? ` · ${progress}` : ''}</div>
</div>`;
}

function getMesTextElement(messageId) {
    const id = Number(messageId);
    if (!Number.isInteger(id) || id < 0) return null;
    return document.querySelector(`#chat .mes[mesid="${id}"] .mes_text`);
}

export function isMessageBeingEdited(messageId) {
    const id = Number(messageId);
    if (!Number.isInteger(id) || id < 0) return false;
    const mesElement = document.querySelector(`.mes[mesid="${id}"]`);
    if (!mesElement) return false;
    return mesElement.querySelector('textarea.edit_textarea') !== null || mesElement.classList.contains('editing');
}

export function isAnyMessageBeingEdited() {
    return document.querySelector('#chat .mes.editing, #chat .mes textarea.edit_textarea') !== null;
}

export function buildDrawSlotSelector(slotId) {
    const escaped = Array.from(String(slotId ?? '')).map((char) => {
        const code = char.codePointAt(0);
        if (char === '\0') return '\\fffd ';
        if ((code >= 1 && code <= 31) || code === 127) return `\\${code.toString(16)} `;
        if (char === '"' || char === '\\') return `\\${char}`;
        return char;
    }).join('');
    return `.xb-nd-img[data-slot-id="${escaped}"]`;
}

export function extractSlotIds(mes) {
    const ids = new Set();
    if (!mes) return ids;
    let match;
    const regex = createDrawImageSlotRegex();
    while ((match = regex.exec(mes)) !== null) ids.add(match[1]);
    return ids;
}

async function persistChatSilently() {
    const ctx = getContext();
    if (!ctx?.saveChat) return;
    await Promise.resolve(ctx.saveChat());
}

function getSavedMap(message, key) {
    const savedMap = message?.extra?.[key];
    return savedMap && typeof savedMap === 'object' ? savedMap : null;
}

function ensureMessageExtra(message) {
    if (!message) return null;
    if (!message.extra || typeof message.extra !== 'object') {
        message.extra = {};
    }
    return message.extra;
}

function ensureSavedMap(message, key) {
    const extra = ensureMessageExtra(message);
    if (!extra) return null;
    if (!extra[key] || typeof extra[key] !== 'object') {
        extra[key] = {};
    }
    return extra[key];
}

function normalizeDrawSavedEntry(slotId, data = {}) {
    if (!slotId || !data?.savedUrl) return null;
    return {
        slotId,
        imgId: data.imgId || '',
        savedUrl: data.savedUrl,
        tags: data.tags || '',
        positive: data.positive || '',
        updatedAt: Number.isFinite(data.updatedAt) ? data.updatedAt : Date.now(),
    };
}

export function getDrawSavedEntry(message, slotId) {
    if (!slotId) return null;
    const current = normalizeDrawSavedEntry(slotId, getSavedMap(message, DRAW_SAVED_EXTRA_KEY)?.[slotId]);
    if (current) return current;
    return normalizeDrawSavedEntry(slotId, getSavedMap(message, LEGACY_NOVEL_SAVED_EXTRA_KEY)?.[slotId]);
}

export async function setDrawSavedEntry(messageId, slotId, data) {
    const ctx = getContext();
    const message = ctx.chat?.[messageId];
    const entry = normalizeDrawSavedEntry(slotId, data);
    if (!message || !entry) return false;

    const savedMap = ensureSavedMap(message, DRAW_SAVED_EXTRA_KEY);
    if (!savedMap) return false;

    const previous = savedMap[slotId];
    const unchanged = previous &&
        previous.imgId === entry.imgId &&
        previous.savedUrl === entry.savedUrl &&
        previous.tags === entry.tags &&
        previous.positive === entry.positive;
    const legacyMap = getSavedMap(message, LEGACY_NOVEL_SAVED_EXTRA_KEY);
    const hasLegacyEntry = !!legacyMap?.[slotId];
    if (unchanged && !hasLegacyEntry) return true;

    savedMap[slotId] = entry;
    if (hasLegacyEntry) {
        delete legacyMap[slotId];
        if (Object.keys(legacyMap).length === 0) {
            delete message.extra[LEGACY_NOVEL_SAVED_EXTRA_KEY];
        }
    }
    await persistChatSilently();
    return true;
}

export async function clearDrawSavedEntry(messageId, slotId) {
    const ctx = getContext();
    const message = ctx.chat?.[messageId];
    if (!message?.extra || !slotId) return false;

    let changed = false;
    for (const key of [DRAW_SAVED_EXTRA_KEY, LEGACY_NOVEL_SAVED_EXTRA_KEY]) {
        const savedMap = getSavedMap(message, key);
        if (!savedMap?.[slotId]) continue;
        delete savedMap[slotId];
        changed = true;
        if (Object.keys(savedMap).length === 0) delete message.extra[key];
    }

    if (!changed) return false;
    await persistChatSilently();
    return true;
}

export async function syncDrawSavedFromPreview(messageId, preview, overrides = {}) {
    const slotId = overrides.slotId || preview?.slotId;
    if (!slotId) return false;

    return setDrawSavedEntry(messageId, slotId, {
        imgId: overrides.imgId || preview?.imgId,
        savedUrl: overrides.savedUrl || preview?.savedUrl,
        tags: overrides.tags ?? preview?.tags ?? '',
        positive: overrides.positive ?? preview?.positive ?? '',
    });
}

export async function syncDrawSavedAfterDeletion(messageId, slotId, deletedImgId, remainingPreviews = []) {
    const message = getContext().chat?.[messageId];
    const currentSaved = getDrawSavedEntry(message, slotId);
    if (!currentSaved) return false;
    if (deletedImgId && currentSaved.imgId && currentSaved.imgId !== deletedImgId) return false;

    const replacement = remainingPreviews.find(item => item?.savedUrl);
    if (replacement) return syncDrawSavedFromPreview(messageId, replacement, { slotId });
    return clearDrawSavedEntry(messageId, slotId);
}

export function insertPreviewIntoRenderedMessage({ messageId, slotId, html }) {
    const mesTextEl = getMesTextElement(messageId);
    if (!mesTextEl || !slotId || !html) return false;
    const insertedSlotIds = replaceSceneSlotElements(mesTextEl, [{ slotId, html }]);
    if (insertedSlotIds.has(slotId)) {
        syncCollapseTitleWidths(mesTextEl);
        return true;
    }
    return mesTextEl.querySelector(buildDrawSlotSelector(slotId)) !== null;
}

async function resolveRenderPreviewForSlot(message, messageId, slotId) {
    const savedEntry = getDrawSavedEntry(message, slotId);
    if (savedEntry?.savedUrl) {
        const previews = await getPreviewsBySlot(slotId).catch(() => []);
        const successPreviews = previews.filter(p => p.status !== 'failed' && (p.base64 || p.savedUrl));
        const selectedIndex = successPreviews.findIndex(p => p.imgId === savedEntry.imgId);
        const matchedPreview = selectedIndex >= 0 ? successPreviews[selectedIndex] : null;

        return {
            preview: {
                ...matchedPreview,
                slotId,
                imgId: savedEntry.imgId || matchedPreview?.imgId || `saved-${slotId}`,
                savedUrl: savedEntry.savedUrl,
                tags: savedEntry.tags ?? matchedPreview?.tags ?? '',
                positive: savedEntry.positive ?? matchedPreview?.positive ?? '',
                messageId,
            },
            historyCount: selectedIndex >= 0 ? successPreviews.length : 1,
            currentIndex: selectedIndex >= 0 ? selectedIndex : 0,
            hasData: true,
            isFailed: false,
        };
    }

    return getDisplayPreviewForSlot(slotId);
}

function buildFailedPlaceholderHtml({ slotId, messageId, tags, positive, errorType, errorMessage }) {
    const escapedTags = escapeHtml(tags);
    const escapedPositive = escapeHtml(positive);
    return `<div class="xb-nd-img" data-slot-id="${slotId}" data-tags="${escapedTags}" data-positive="${escapedPositive}" data-mesid="${messageId}" data-state="failed" style="margin:0.8em 0;text-align:center;position:relative;display:block;width:100%;background:#C0392B;border:1px solid rgba(255,255,255,0.85);border-radius:10px;padding:4px 8px;color:#fff;font-size:13px;">
<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
<div style="display:flex;align-items:center;gap:8px;min-width:0;">
<span style="font-size:14px;flex:none;">⚠️</span>
<span class="xb-nd-failed-title" style="font-size:13px;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(errorType || '生成失败')}</span>
</div>
<div class="xb-nd-failed-btns" style="display:flex;gap:4px;flex:none;">
    <button class="xb-nd-retry-btn" data-action="retry-image" style="padding:2px 6px;background:transparent;border:none;color:#fff;font-size:16px;line-height:1;cursor:pointer;opacity:0.9;display:flex;align-items:center;" title="重新生成">${RELOAD_ICON_SVG}</button>
    <button class="xb-nd-edit-btn" data-action="edit-tags" style="padding:2px 6px;background:transparent;border:none;color:#fff;font-size:14px;line-height:1;cursor:pointer;opacity:0.9;" title="编辑 TAG">✎</button>
    <button class="xb-nd-remove-btn" data-action="remove-placeholder" style="padding:2px 6px;background:transparent;border:none;color:#fff;font-size:14px;line-height:1;cursor:pointer;opacity:0.9;" title="移除">✕</button>
</div>
</div>
<div class="xb-nd-edit" style="display:none;margin-top:8px;text-align:left;background:#141418;padding:8px;border-radius:8px;">
    <div style="font-size:11px;color:rgba(255,255,255,0.6);margin-bottom:6px;">编辑 TAG（场景描述）</div>
    <textarea class="xb-nd-edit-input" style="color:#fff;background:#1d1d22;border:1px solid rgba(255,255,255,0.2);padding:6px 8px;border-radius:6px;font-size:12px;width:100%;min-height:60px;resize:vertical;outline:none;">${escapedTags}</textarea>
    <div style="display:flex;gap:6px;margin-top:8px;">
        <button data-action="save-tags-retry" style="flex:1;padding:6px 12px;background:rgba(212,165,116,0.3);border:1px solid rgba(212,165,116,0.5);border-radius:6px;color:#fff;font-size:12px;cursor:pointer;">保存并重试</button>
        <button data-action="cancel-edit" style="padding:6px 12px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:6px;color:#fff;font-size:12px;cursor:pointer;">取消</button>
    </div>
</div>
</div>`;
}

async function rebuildRenderedMessageFromState(messageId, {
    chatId,
    expectedMessage,
} = {}) {
    const ctx = getContext();
    const message = ctx.chat?.[messageId];
    if (!message || (chatId !== undefined && String(ctx.chatId || '') !== String(chatId || ''))
        || (expectedMessage && message !== expectedMessage) || isMessageBeingEdited(messageId)) return false;
    const { messageFormatting } = await import('../../../../../../../script.js');
    const live = getContext();
    if (String(live.chatId || '') !== String(ctx.chatId || '')
        || live.chat?.[messageId] !== message || isMessageBeingEdited(messageId)) return false;
    const mesTextEl = getMesTextElement(messageId);
    if (!mesTextEl) return false;
    const formatted = messageFormatting(
        message.mes,
        message.name,
        message.is_system,
        message.is_user,
        messageId,
    );
    // Host-generated message markup.
    // eslint-disable-next-line no-unsanitized/property
    mesTextEl.innerHTML = formatted;
    return true;
}

async function renderPreviewsForMessageNow(messageId, {
    refreshSlotIds = [],
    force = false,
    expectedChatId,
    expectedMessage,
} = {}) {
    const ctx = getContext();
    const message = ctx.chat?.[messageId];
    if (!message?.mes
        || String(ctx.chatId || '') !== String(expectedChatId || '')
        || message !== expectedMessage) return;

    const sourceText = message.mes;
    const slotIds = extractSlotIds(sourceText);
    let mesTextEl = getMesTextElement(messageId);
    if (!mesTextEl) return;
    // 纯外观强制刷新（如切换图片标题模式）只碰眼前已有的卡片，绝不整楼重建：
    // 重建会丢掉前台生成中、尚未入缓存的临时卡片，随后被误判成「缓存丢失」。
    // 锚点探测与实际替换共用 DOM 解析；不能因合法空格或换行误判缺失，
    // 再用尚未提交新槽位的正文重建 DOM，把本批等待卡清掉。
    const renderedSlots = getRenderedSceneSlotIds(mesTextEl);
    if (!force && [...slotIds].some(slotId => !renderedSlots.has(slotId))) {
        // message.mes 是持久化排版事实。adoption 当下若恰逢聊天切换或宿主 DOM
        // 尚未挂载，一次局部 patch 可能没有锚点；先按前台生成相同的宿主格式
        // 重建楼层，再在下面统一投影 pending 卡或图片。
        const rebuilt = await rebuildRenderedMessageFromState(messageId, {
            chatId: ctx.chatId,
            expectedMessage: message,
        });
        if (!rebuilt) return;
        mesTextEl = getMesTextElement(messageId);
        if (!mesTextEl) return;
    }
    const refreshSlots = new Set((Array.isArray(refreshSlotIds) ? refreshSlotIds : [])
        .map(slotId => String(slotId || '').trim())
        .filter(Boolean));
    for (const slotId of refreshSlots) {
        if (!slotIds.has(slotId)) mesTextEl.querySelector(buildDrawSlotSelector(slotId))?.remove();
    }
    if (slotIds.size === 0) return;

    const replacements = [];
    // 待接回的后台任务槽位：只在真的需要判定时读一次，避免每条消息都白跑一次 IndexedDB。
    let pendingSlotsPromise = null;
    const resolvePendingSlot = async (slotId) => {
        pendingSlotsPromise ??= getPendingImageJobSlots().catch(() => new Map());
        return (await pendingSlotsPromise).get(slotId) || null;
    };
    for (const slotId of slotIds) {
        const existingCard = mesTextEl.querySelector(buildDrawSlotSelector(slotId));
        if (!force && !refreshSlots.has(slotId) && existingCard) continue;
        let replacementHtml;
        try {
            const displayData = await resolveRenderPreviewForSlot(message, messageId, slotId);
            const hasImage = displayData.hasData && !displayData.isFailed && displayData.preview;
            // 纯外观强制刷新只做「有图换样式」：眼前已经是图/生成中/失败卡，而缓存此刻
            // 给不出新图时（前台生成中、暂存尚未写入），原卡原样保留，绝不贴「缓存丢失」。
            if (force && existingCard) {
                const existingState = existingCard.dataset.state || '';
                if (existingState === 'failed' || !hasImage) continue;
            }
            // 后台任务仍在等待接回时，占位卡必须压过陈旧的失败卡和「缓存丢失」；
            // 只有真的已经有图，才不必再问恢复记录。
            const pendingSlot = hasImage ? null : await resolvePendingSlot(slotId);
            if (pendingSlot) {
                replacementHtml = buildPendingImageHtml({
                    slotId,
                    messageId,
                    index: pendingSlot.index + 1,
                    total: pendingSlot.total,
                    label: pendingSlot.state === PendingJobState.CANCELLING ? '正在取消' : '生成中',
                });
            } else if (displayData.isFailed) {
                replacementHtml = buildFailedPlaceholderHtml({
                    slotId,
                    messageId,
                    tags: displayData.failedInfo?.tags || '',
                    positive: displayData.failedInfo?.positive || '',
                    errorType: displayData.failedInfo?.errorType || ErrorType.CACHE_LOST.label,
                    errorMessage: displayData.failedInfo?.errorMessage || ErrorType.CACHE_LOST.desc,
                });
            } else if (displayData.hasData && displayData.preview) {
                const url = getPreviewDisplayUrl(displayData.preview);
replacementHtml = buildImageHtml({
    slotId,
    imgId: displayData.preview.imgId,
    url,
    tags: displayData.preview.tags || '',
    positive: displayData.preview.positive || '',
    title: displayData.preview.title || '',
    messageId,
    state: displayData.preview.savedUrl ? ImageState.SAVED : ImageState.PREVIEW,
    historyCount: displayData.historyCount,
    currentIndex: displayData.currentIndex ?? 0,
});
                void warmSlotPreviewNeighbors(slotId, displayData.currentIndex ?? 0).catch(() => {});
            } else {
                replacementHtml = buildFailedPlaceholderHtml({
                    slotId,
                    messageId,
                    tags: '',
                    positive: '',
                    errorType: ErrorType.CACHE_LOST.label,
                    errorMessage: ErrorType.CACHE_LOST.desc,
                });
            }
        } catch (error) {
            console.error(`[DrawCommon] 渲染 ${slotId} 失败:`, error);
            replacementHtml = buildFailedPlaceholderHtml({
                slotId,
                messageId,
                tags: '',
                positive: '',
                errorType: ErrorType.UNKNOWN.label,
                errorMessage: error?.message || '未知错误',
            });
        }
        replacements.push({ slotId, html: replacementHtml });
    }

    if (replacements.length === 0) return;
    const live = getContext();
    if (String(live.chatId || '') !== String(ctx.chatId || '')
        || live.chat?.[messageId] !== message
        || message.mes !== sourceText
        || getMesTextElement(messageId) !== mesTextEl
        || isMessageBeingEdited(messageId)) return;
    replaceSceneSlotElements(mesTextEl, replacements);
    syncCollapseTitleWidths(mesTextEl);
}

// 同一楼层只允许一个异步投影在运行。图片落库、恢复状态变化和消息事件可能在同一时刻
// 发起刷新；串行执行保证较早读取的旧事实一定先完成，最后留在 DOM 的总是较新的投影。
// 队列只绑定当前 message 对象，聊天切换或宿主替换消息对象后，旧任务会被上面的身份守卫丢弃。
export function renderPreviewsForMessage(messageId, { refreshSlotIds = [], force = false } = {}) {
    const ctx = getContext();
    const message = ctx.chat?.[messageId];
    if (!message?.mes) return Promise.resolve();
    const expectedChatId = ctx.chatId;

    let queue = drawPreviewRenderQueues.get(message);
    if (!queue) {
        queue = { tail: Promise.resolve() };
        drawPreviewRenderQueues.set(message, queue);
    }
    const requestedSlots = Array.isArray(refreshSlotIds) ? [...refreshSlotIds] : [];
    const render = queue.tail.then(() => renderPreviewsForMessageNow(messageId, {
        refreshSlotIds: requestedSlots,
        force,
        expectedChatId,
        expectedMessage: message,
    }));
    const tail = render.catch(() => {});
    queue.tail = tail;
    void tail.then(() => {
        if (queue.tail === tail) drawPreviewRenderQueues.delete(message);
    });
    return render;
}

// Draw Run adoption 会在酒馆完成楼层渲染之后才把 slots 写进 message.mes。
// 仅替换已有 DOM 锚点不够，必须先按宿主规则重建活动楼层，再把 slots 渲染成 pending/图片卡。
export async function syncRenderedMessageFromState(messageId, { chatId, expectedMessage } = {}) {
    const rebuilt = await rebuildRenderedMessageFromState(messageId, { chatId, expectedMessage });
    if (!rebuilt) return false;
    await renderPreviewsForMessage(messageId);
    return true;
}

function initDrawPreviewMessageObserver() {
    if (drawPreviewMessageObserver) return;
    drawPreviewMessageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const mesEl = entry.target;
            drawPreviewMessageObserver.unobserve(mesEl);
            delete mesEl.dataset.ndLazyObserved;
            const messageId = parseInt(mesEl.getAttribute('mesid'), 10);
            if (!Number.isNaN(messageId)) {
                renderPreviewsForMessage(messageId);
            }
        });
    }, { rootMargin: '600px 0px', threshold: 0.01 });
}

function observeMessageForDrawPreviewLazyRender(messageId) {
    const mesEl = document.querySelector(`.mes[mesid="${messageId}"]`);
    if (!mesEl || mesEl.dataset.ndLazyObserved === '1') return;
    initDrawPreviewMessageObserver();
    mesEl.dataset.ndLazyObserved = '1';
    drawPreviewMessageObserver.observe(mesEl);
}

function isMessageNearViewport(mesEl) {
    if (!mesEl) return false;
    const root = document.getElementById('chat');
    const rootRect = root?.getBoundingClientRect?.() || { top: 0, bottom: window.innerHeight || 0 };
    const rect = mesEl.getBoundingClientRect();
    return rect.bottom >= rootRect.top - 600 && rect.top <= rootRect.bottom + 600;
}

function cleanupDrawPreviewMessageObserver() {
    if (drawPreviewMessageObserver) {
        drawPreviewMessageObserver.disconnect();
        drawPreviewMessageObserver = null;
    }
    document.querySelectorAll('[data-nd-lazy-observed="1"]').forEach(el => {
        delete el.dataset.ndLazyObserved;
    });
}

export async function renderAllDrawPreviews({ force = false } = {}) {
    const ctx = getContext();
    const chat = ctx.chat || [];
    let rendered = 0;

    for (let i = chat.length - 1; i >= 0; i--) {
        if (extractSlotIds(chat[i]?.mes).size === 0) continue;
        const mesEl = document.querySelector(`.mes[mesid="${i}"]`);
        if (rendered < INITIAL_RENDER_MESSAGE_LIMIT || isMessageNearViewport(mesEl)) {
            await renderPreviewsForMessage(i, { force });
            rendered++;
        } else {
            observeMessageForDrawPreviewLazyRender(i);
        }
    }
}

function clearPendingDrawPreviewTimers() {
    for (const timer of drawPreviewPendingTimers) {
        clearTimeout(timer);
    }
    drawPreviewPendingTimers.clear();
}

function scheduleRenderAllDrawPreviews(delay = 150) {
    const generation = drawPreviewRuntimeGeneration;
    const timer = setTimeout(() => {
        drawPreviewPendingTimers.delete(timer);
        if (!drawPreviewRuntimeEvents || generation !== drawPreviewRuntimeGeneration) return;
        cleanupDrawPreviewMessageObserver();
        void renderAllDrawPreviews();
    }, delay);
    drawPreviewPendingTimers.add(timer);
}

function handleDrawPreviewMessageRendered(data) {
    const messageId = typeof data === 'number' ? data : data?.messageId ?? data?.mesId;
    if (messageId !== undefined) void renderPreviewsForMessage(messageId);
}

function handleDrawPreviewMessageModified(data) {
    const raw = typeof data === 'object' ? (data?.messageId ?? data?.mesId) : data;
    const messageId = parseInt(raw, 10);
    if (Number.isNaN(messageId)) return;
    setTimeout(() => {
        void renderPreviewsForMessage(messageId);
    }, 100);
}

function handleGalleryCacheChanged({ slotIds } = {}) {
    const changedSlots = slotIds === null ? null : new Set(Array.isArray(slotIds) ? slotIds : []);
    if (changedSlots && changedSlots.size === 0) return;
    const chat = getContext().chat || [];
    for (let messageId = 0; messageId < chat.length; messageId++) {
        const messageSlots = extractSlotIds(chat[messageId]?.mes);
        const refreshSlotIds = changedSlots
            ? [...messageSlots].filter(slotId => changedSlots.has(slotId))
            : [...messageSlots];
        if (refreshSlotIds.length > 0) {
            void renderPreviewsForMessage(messageId, { refreshSlotIds });
        }
    }
}

// 桌面端靠 CSS :hover 揭示悬浮标题条；触屏没有 hover，轻按图片时短显 2 秒。
// 监听器只绑一次，三个 Provider 的卡片共用同一套 class。
let drawTitleRevealBound = false;
export function bindDrawImageTitleReveal() {
    if (drawTitleRevealBound || typeof document === 'undefined') return;
    drawTitleRevealBound = true;
    document.addEventListener('pointerdown', (event) => {
        if (event.pointerType !== 'touch') return;
        const wrap = event.target?.closest?.('.xb-nd-img-wrap');
        if (!wrap || !wrap.querySelector('.xb-nd-title-bar')) return;
        wrap.classList.add('title-show');
        clearTimeout(wrap._xbTitleRevealTimer);
        wrap._xbTitleRevealTimer = setTimeout(() => wrap.classList.remove('title-show'), 2000);
    });
}

// 摺疊標題列寬度跟隨圖片：圖片 load/版本切換後量實寬；視窗縮放時重測；
// 摺疊態量不到就用固有寬度估算，重新展開時校正。全文档只綁一次。
let drawCollapseWidthBound = false;
export function bindDrawCollapseTitleWidth() {
    if (drawCollapseWidthBound || typeof document === 'undefined') return;
    drawCollapseWidthBound = true;
    document.addEventListener('load', (event) => {
        const img = event.target;
        if (img?.closest?.('.xb-nd-details .xb-nd-img-wrap')) syncCollapseTitleWidths(img.closest('.xb-nd-details'));
    }, true);
    document.addEventListener('toggle', (event) => {
        const details = event.target;
        if (!details?.classList?.contains('xb-nd-details')) return;
        if (!details.open) {
            // 摺疊＝一併收起懸浮的編輯 TAG 彈窗與 ⋮ 菜單，否則圖片被 details 隱藏後，
            // 絕對定位的彈窗會脫離卡片懸在頂層（再展開也不該自動回彈）。
            const card = details.closest('.xb-nd-img');
            const editPanel = card?.querySelector('.xb-nd-edit');
            if (editPanel) editPanel.style.display = 'none';
            card?.querySelector('.xb-nd-menu-wrap.open')?.classList.remove('open');
        }
        requestAnimationFrame(() => syncCollapseTitleWidths(details));
    });
    window.addEventListener('resize', () => syncCollapseTitleWidths());
    if (document.readyState !== 'loading') syncCollapseTitleWidths();
    else document.addEventListener('DOMContentLoaded', () => syncCollapseTitleWidths());
}

export function startSharedDrawPreviewRuntime() {
    drawPreviewRuntimeRefs++;
    bindDrawImageTitleReveal();
    bindDrawCollapseTitleWidth();
    if (drawPreviewRuntimeEvents) return;

    drawPreviewRuntimeGeneration++;
    drawPreviewRuntimeEvents = createModuleEvents('drawPreviewRuntime');
    drawPreviewRuntimeEvents.on(event_types.CHARACTER_MESSAGE_RENDERED, handleDrawPreviewMessageRendered);
    drawPreviewRuntimeEvents.on(event_types.USER_MESSAGE_RENDERED, handleDrawPreviewMessageRendered);
    drawPreviewRuntimeEvents.on(event_types.CHAT_CHANGED, () => scheduleRenderAllDrawPreviews(150));
    drawPreviewRuntimeEvents.on(event_types.MORE_MESSAGES_LOADED, () => scheduleRenderAllDrawPreviews(150));
    drawPreviewRuntimeEvents.on(event_types.MESSAGE_EDITED, handleDrawPreviewMessageModified);
    drawPreviewRuntimeEvents.on(event_types.MESSAGE_UPDATED, handleDrawPreviewMessageModified);
    drawPreviewRuntimeEvents.on(event_types.MESSAGE_SWIPED, handleDrawPreviewMessageModified);
    drawPreviewCacheSyncCleanup = subscribeGalleryCacheChanges(handleGalleryCacheChanged);

    setTimeout(() => {
        if (!drawPreviewRuntimeEvents) return;
        void renderAllDrawPreviews();
    }, 300);
}

export function stopSharedDrawPreviewRuntime() {
    drawPreviewRuntimeRefs = Math.max(0, drawPreviewRuntimeRefs - 1);
    if (drawPreviewRuntimeRefs > 0) return;

    drawPreviewRuntimeEvents?.cleanup();
    drawPreviewRuntimeEvents = null;
    drawPreviewCacheSyncCleanup?.();
    drawPreviewCacheSyncCleanup = null;
    drawPreviewRuntimeGeneration++;
    clearPendingDrawPreviewTimers();
    cleanupDrawPreviewMessageObserver();
}
