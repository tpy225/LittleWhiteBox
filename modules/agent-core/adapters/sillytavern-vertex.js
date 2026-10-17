import {
    HOST_CHAT_COMPLETIONS_SOURCE_OPENAI,
} from '../../../shared/host-llm/chat-completions/client.js';
import { SillyTavernOpenAICompatibleAdapter } from './sillytavern-openai-compatible.js';

// 跟隨酒館主 API：透過 SillyTavern.getContext() 拿主界面的 oai_settings，
// 完全交給 ST 後端處理 auth。用戶在 Agent 配置頁只需填模型名，其他留空。
// getContext() 是 ST 掛到 global 的官方 API，在 srcdoc iframe 內透過
// globalThis / window 都能取到，比直接抓 parent.oai_settings 穩定。

function readHostOaiSettings() {
    try {
        const ctx = globalThis.SillyTavern?.getContext?.();
        const settings = ctx?.oai_settings
            ?? globalThis.oai_settings
            ?? globalThis.parent?.oai_settings;
        return settings && typeof settings === 'object' ? settings : {};
    } catch {
        return {};
    }
}

export class SillyTavernVertexAdapter extends SillyTavernOpenAICompatibleAdapter {
    provider = 'sillytavern-vertex';

    async chat(task) {
        const host = readHostOaiSettings();
        const mergedConfig = {
            ...this.config,
            reverse_proxy: host.reverse_proxy ?? this.config.reverse_proxy,
            proxy_password: host.proxy_password ?? this.config.proxy_password,
            baseUrl: undefined,
            apiKey: undefined,
        };
        this.source = host.reverse_proxy
            ? HOST_CHAT_COMPLETIONS_SOURCE_OPENAI
            : (host.chat_completion_source || HOST_CHAT_COMPLETIONS_SOURCE_OPENAI);
        this.config = mergedConfig;
        return super.chat(task);
    }
}
