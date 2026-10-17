import {
    HOST_CHAT_COMPLETIONS_SOURCE_OPENAI,
} from '../../../shared/host-llm/chat-completions/client.js';
import { SillyTavernOpenAICompatibleAdapter } from './sillytavern-openai-compatible.js';

// 跟隨酒館主 API：從 ST 主界面的 oai_settings 讀 source / reverse_proxy /
// proxy_password，完全交給 ST 後端處理 auth，不自換 token、不指定端点。
// 用戶在 Agent 配置頁只需填模型名，其他全留空。

function readHostOaiSettings() {
    // 從父頁（ST 主界面）讀 oai_settings。agent-core bundle 跑在 ST srcdoc iframe 內，
    // parent 就是 ST 主頁 window。若取不到（獨立跑在 node/單元測試裡）就回傳空物件。
    try {
        const w = typeof parent !== 'undefined' && parent ? parent : (typeof window !== 'undefined' ? window : null);
        if (!w) return {};
        const settings = w.oai_settings;
        return settings && typeof settings === 'object' ? settings : {};
    } catch {
        return {};
    }
}

export class SillyTavernVertexAdapter extends SillyTavernOpenAICompatibleAdapter {
    provider = 'sillytavern-vertex';

    async chat(task) {
        const hostSettings = readHostOaiSettings();
        const mergedConfig = {
            ...this.config,
            // 繼承 ST 主界面當前連線的 auth 設定
            reverse_proxy: hostSettings.reverse_proxy ?? this.config.reverse_proxy,
            proxy_password: hostSettings.proxy_password ?? this.config.proxy_password,
            baseUrl: undefined, // 不讓 buildHostChatCompletionsFields 重疊計算
            apiKey: undefined,
        };
        // 如果 ST 主界面設了 reverse_proxy → 走 openai source（ST 代理轉發）
        // 否則走主界面原本的 chat_completion_source（可能是 vertexai / makersuite / claude …）
        this.source = hostSettings.reverse_proxy
            ? HOST_CHAT_COMPLETIONS_SOURCE_OPENAI
            : (hostSettings.chat_completion_source || HOST_CHAT_COMPLETIONS_SOURCE_OPENAI);

        // 暫時掛到 this.config 讓 buildPayload 能用
        this.config = mergedConfig;
        return super.chat(task);
    }
}
