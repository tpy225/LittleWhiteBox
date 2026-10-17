import {
    HOST_CHAT_COMPLETIONS_SOURCE_OPENAI,
} from '../../../shared/host-llm/chat-completions/client.js';
import { SillyTavernOpenAICompatibleAdapter } from './sillytavern-openai-compatible.js';

// 跟隨酒館主 API：直接呼叫 ST 頁內的 generateRaw()，把整個生成流程交回 ST 後端。
// 主界面怎麼連（Vertex SA JSON / Vertex API key / OpenAI / 其他），Agent 就跟著怎麼連，
// 不自行換 token、不自己指定端點。
//
// 為什麼不走 HTTP /api/backends/chat-completions/generate：
// ST 的 HTTP 端點對 vertexai 只支援 Express 模式（API key），SA JSON full-auth
// 只在主界面內部 Generate() 路徑讀 secrets——所以正文能用 Vertex，HTTP 端點卻 400。
// 頁內 generateRaw() 就是主界面那一條路徑，完全一致。

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

function buildFollowPromptText(task) {
    const parts = [];
    const system = typeof task.systemPrompt === 'string' ? task.systemPrompt : '';
    if (system.trim()) {
        parts.push(`[System Instructions]\n${system.trim()}`);
    }
    (Array.isArray(task.messages) ? task.messages : []).forEach((message) => {
        if (!message || typeof message !== 'object') return;
        const role = message.role === 'assistant' ? 'Assistant' : 'User';
        const content = flattenContent(message.content).trim();
        if (!content) return;
        parts.push(`${role}: ${content}`);
    });
    parts.push('Assistant:');
    return parts.join('\n\n');
}

export class SillyTavernVertexAdapter extends SillyTavernOpenAICompatibleAdapter {
    provider = 'sillytavern-vertex';
    source = HOST_CHAT_COMPLETIONS_SOURCE_OPENAI;

    async chat(task) {
        const ctx = getStContext();
        const generateRaw = ctx?.generateRaw
            || (typeof globalThis !== 'undefined' && typeof globalThis.generateRaw === 'function'
                ? globalThis.generateRaw
                : null);
        if (typeof generateRaw !== 'function') {
            console.warn('[SillyTavernVertex] 頁內 generateRaw 不可用，退回 HTTP chat-completions 路徑');
            return super.chat(task);
        }

        const prompt = buildFollowPromptText(task);
        console.debug('[SillyTavernVertex] 跟隨主 API 生成，prompt 前 200 字：', prompt.slice(0, 200));
        try {
            // 第一個參數與 options.prompt 都帶同一段 prompt：
            // 新版 ST 走 options.prompt（原樣發送），舊版忽略 options 時
            // 也至少把 prompt 當作輸入，仍走主 API 連線。
            const text = await generateRaw(prompt, {
                prompt,
                quiet: true,
                skipWpp: true,
                signal: task.signal,
            });
            const result = String(text || '');
            if (typeof task.onStreamProgress === 'function') {
                task.onStreamProgress({ text: result });
            }
            return {
                text: result,
                toolCalls: [],
                thoughts: [],
                finishReason: 'stop',
                model: this.config.model,
                provider: this.provider,
                requestInspection: {
                    provider: this.provider,
                    model: this.config.model,
                    transport: 'sillytavern-generate-raw',
                    request: { body: { prompt } },
                },
            };
        } catch (error) {
            console.warn('[SillyTavernVertex] 跟隨主 API 生成失敗：', error?.message || error);
            throw error;
        }
    }
}
