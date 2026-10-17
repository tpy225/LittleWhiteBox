import {
    HOST_CHAT_COMPLETIONS_SOURCE_OPENAI,
} from '../../../shared/host-llm/chat-completions/client.js';
import { getHostRequestHeaders } from '../../../shared/host-request-headers.js';
import { SillyTavernOpenAICompatibleAdapter } from './sillytavern-openai-compatible.js';

// 柏寶繪同款：用 openai source + reverse_proxy + proxy_password 走 ST 代理。
// Vertex AI 提供 OpenAI 兼容端點：
//   https://{region}-aiplatform.googleapis.com/v1beta/openai/chat/completions
// 用戶貼 SA JSON（Service Account），server-plugin 簽 JWT 換 OAuth access_token，
// 再注入成 proxy_password（Bearer token）由 ST 當 OpenAI API key 發送。
//
// 為什麼不用 ST 原生 vertexai source？
//   ST 原生 vertexai 路徑有 runtime bug（source is not defined），而且走的是
//   Vertex Native API（非 OpenAI 兼容），跟我們的 payload 結構不匹配。

// module-level cache：同一個 ST + SA 共用，避免 GCP OAuth rate limit。
const TOKEN_CACHE = new Map(); // key: `${region}::${saEmail}`, value: { accessToken, expiresAt }

function cacheKey(region, saEmail) {
    return `${region || ''}::${saEmail || ''}`;
}

export class SillyTavernVertexAdapter extends SillyTavernOpenAICompatibleAdapter {
    provider = 'sillytavern-vertex';
    source = HOST_CHAT_COMPLETIONS_SOURCE_OPENAI; // 走 openai source + reverse_proxy

    constructor(config, hostClient) {
        super(config, hostClient);
    }

    get _region() {
        const r = String(this.config?.vertexRegion || 'us-central1').trim().toLowerCase();
        if (!r || r === 'global') return 'us-central1';
        return r;
    }

    // Vertex OpenAI 兼容端點（ST openai source 會自動加 /chat/completions）
    get _reverseProxyUrl() {
        return `https://${this._region}-aiplatform.googleapis.com/v1beta/openai`;
    }

    async _ensureToken() {
        const saJson = String(this.config?.serviceAccountJson || '').trim();
        if (!saJson) {
            throw new Error('Vertex AI 需要 Service Account JSON（請在 Agent API 配置頁貼 SA JSON）');
        }
        let saEmail = '';
        try {
            saEmail = JSON.parse(saJson).client_email || '';
        } catch {
            throw new Error('Service Account JSON 格式不正確');
        }

        const now = Math.floor(Date.now() / 1000);
        const key = cacheKey(this._region, saEmail);
        const cached = TOKEN_CACHE.get(key);
        if (cached && cached.expiresAt > now) return cached.accessToken;

        // server-plugin 掛在同源，跟 ST 同一個 origin，需要帶 CSRF + session cookie
        const stHeaders = await getHostRequestHeaders().catch(() => ({}));
        const resp = await fetch('/api/plugins/littlewhitebox-server/vertex-exchange-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...stHeaders },
            body: JSON.stringify({ serviceAccountJson: saJson }),
        });
        const rawText = await resp.text().catch(() => '');
        let data = {};
        try { data = rawText ? JSON.parse(rawText) : {}; } catch { data = {}; }

        if (!resp.ok) {
            throw new Error(`換取 Vertex OAuth token 失敗：HTTP ${resp.status} — ${rawText.slice(0, 200)}`);
        }
        if (!data.ok || !data.accessToken) {
            throw new Error(`換取 Vertex OAuth token 失敗：${data.error || rawText.slice(0, 200) || '未知錯誤'}`);
        }
        const expiresAt = data.expiresAt || (now + 3500);
        TOKEN_CACHE.set(key, { accessToken: data.accessToken, expiresAt });
        return data.accessToken;
    }

    async chat(task) {
        const token = await this._ensureToken();
        // 注入 reverse_proxy + proxy_password → ST 當 OpenAI API key 用 Bearer token 發送
        this.config = {
            ...this.config,
            reverse_proxy: this._reverseProxyUrl,
            proxy_password: token,
            baseUrl: undefined,  // 不要讓 buildHostChatCompletionsFields 重疊計算
            apiKey: undefined,   // 避免跟 proxy_password 衝突
        };
        return super.chat(task);
    }
}
