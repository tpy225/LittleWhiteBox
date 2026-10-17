import {
    HOST_CHAT_COMPLETIONS_SOURCE_OPENAI,
} from '../../../shared/host-llm/chat-completions/client.js';
import { SillyTavernOpenAICompatibleAdapter } from './sillytavern-openai-compatible.js';

// 跟隨酒館主 API：直接呼叫 ST 頁內 generateRaw()，把整個生成流程交回 ST 後端。
// 主界面怎麼連（Vertex SA JSON / Vertex API key / OpenAI / 其他），Agent 就跟著怎麼連。
//
// 呼叫方式與柏寶繪 requestViaMainApi 相同（已驗證可用）：
//   ctx.generateRaw({ prompt: messages, responseLength: 65535 })
// generateRaw 第一參數是物件 { prompt: 訊息陣列 }，不是字串。
//
// 為什麼不走 HTTP /api/backends/chat-completions/generate：
// ST 的 HTTP 端點對 vertexai 只支援 Express 模式（API key），SA JSON full-auth
// 只在主界面內部 Generate() 路徑讀 secrets——所以正文能用 Vertex，HTTP 端點卻 400。
// 頁內 generateRaw() 就是主界面那一條路徑，完全一致。

const MAIN_API_RESPONSE_LENGTH = 65535;

function getStContext() {
    try {
        const st = (typeof globalThis !== 'undefined' && globalThis.SillyTavern)
            || (typeof window !== 'undefined' ? window.SillyTavern : null);
        return st?.getContext?.() || null;
    } catch {
        return null;
    }
}

function flattenContent(content) {
    if (typeof content === 'string') return content;
    if (Array.isArray(content)) {
        return content
            .map((part) => {
                if (!part || typeof part !== 'object') return '';
                if (typeof part.text === 'string') return part.text;
                if (part.type === 'image_url' || part.type === 'image') return '[image]';
                return '';
            })
            .filter(Boolean)
            .join('\n');
    }
    if (content && typeof content === 'object') {
        if (typeof content.text === 'string') return content.text;
        if (typeof content.content !== 'undefined') return flattenContent(content.content);
    }
    return '';
}

/** 展平成柏寶繪 ChatMsg 形態（content 為純字串）的訊息陣列。 */
function normalizeMessages(task) {
    const out = [];
    const system = typeof task.systemPrompt === 'string' ? task.systemPrompt.trim() : '';
    if (system) out.push({ role: 'system', content: system });
    (Array.isArray(task.messages) ? task.messages : []).forEach((message) => {
        if (!message || typeof message !== 'object') return;
        const role = message.role === 'user' || message.role === 'assistant'
            ? message.role
            : 'user';
        const content = flattenContent(message.content).trim();
        if (!content) return;
        out.push({ role, content });
    });
    return out;
}

export class SillyTavernVertexAdapter extends SillyTavernOpenAICompatibleAdapter {
    provider = 'sillytavern-vertex';
    source = HOST_CHAT_COMPLETIONS_SOURCE_OPENAI;

    async chat(task) {
        const ctx = getStContext();
        if (typeof ctx?.generateRaw !== 'function') {
            console.warn('[SillyTavernVertex] 頁內 generateRaw 不可用，退回 HTTP chat-completions 路徑');
            return super.chat(task);
        }

        const messages = normalizeMessages(task);
        const promptText = messages.map((m) => `${m.role}: ${m.content}`).join('\n\n');
        console.debug('[SillyTavernVertex] 跟隨主 API 生成，prompt 前 200 字：', promptText.slice(0, 200));
        try {
            const text = String((await ctx.generateRaw({
                prompt: messages,
                responseLength: MAIN_API_RESPONSE_LENGTH,
            }))?.trim?.() ?? '');
            if (typeof task.onStreamProgress === 'function') {
                task.onStreamProgress({ text });
            }
            return {
                text,
                toolCalls: [],
                thoughts: [],
                finishReason: 'stop',
                model: this.config.model,
                provider: this.provider,
                requestInspection: {
                    provider: this.provider,
                    model: this.config.model,
                    transport: 'sillytavern-generate-raw',
                    request: { body: { prompt: messages, responseLength: MAIN_API_RESPONSE_LENGTH } },
                },
            };
        } catch (error) {
            console.warn('[SillyTavernVertex] 跟隨主 API 生成失敗：', error?.message || error);
            throw error;
        }
    }
}
