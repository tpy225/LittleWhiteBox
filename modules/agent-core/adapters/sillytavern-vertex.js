import {
    HOST_CHAT_COMPLETIONS_SOURCE_VERTEXAI,
} from '../../../shared/host-llm/chat-completions/client.js';
import { SillyTavernGoogleAdapter } from './sillytavern-google.js';

// module-level cache：同一個 ST 伺服器（同一個 baseUrl + SA）的 token 共用，
// 避免每次 Agent 請求都向 OAuth 換一次 token（GCP OAuth 端點有 rate limit）。
// 同時避免 adapter 每次 request 新建實例後 _tokenCache 被重置。
const TOKEN_CACHE = new Map(); // key: `${baseUrl}::${saEmail}`, value: { accessToken, expiresAt, region }

function cacheKey(baseUrl, saEmail) {
    return `${baseUrl || ''}::${saEmail || ''}`;
}

export class SillyTavernVertexAdapter extends SillyTavernGoogleAdapter {
    provider = 'sillytavern-vertex';
    source = HOST_CHAT_COMPLETIONS_SOURCE_VERTEXAI;

    constructor(config, hostClient, fetchImpl) {
        super(config, hostClient);
        // fetch 必須包在 arrow 裡，避免 Illegal invocation（裸引用 fetch 在某些 bundle context 會丟 this）
        this.fetch = fetchImpl
            ? (...args) => fetchImpl(...args)
            : (typeof globalThis !== 'undefined' && globalThis.fetch
                ? (...args) => globalThis.fetch(...args)
                : null);
    }

    get _serverPluginUrl() {
        const base = String(this.config?.baseUrl || '').trim();
        const pluginPath = '/api/plugins/littlewhitebox-server';
        if (base) {
            try {
                const u = new URL(base);
                u.pathname = u.pathname.replace(/\/+$/, '') + pluginPath;
                return u.toString();
            } catch {
                // baseUrl 格式錯，fallback 到相對路徑（同源）
            }
        }
        // baseUrl 空 → 相對路徑，TT 同源 fetch（跟 chat-completions/generate 同樣策略）
        return pluginPath;
    }

    get _region() {
        const r = String(this.config?.vertexRegion || 'us-central1').trim().toLowerCase();
        if (!r || r === 'global') return 'us-central1';
        return r;
    }

    get _reverseProxyUrl() {
        return `https://${this._region}-aiplatform.googleapis.com`;
    }

    async _ensureToken() {
        const saJson = String(this.config?.serviceAccountJson || '').trim();
        if (!saJson) {
            throw new Error('Vertex AI 需要 Service Account JSON（請在 Agent API 配置頁貼上完整 SA JSON）');
        }
        let saEmail = '';
        try {
            saEmail = JSON.parse(saJson).client_email || '';
        } catch {
            throw new Error('Service Account JSON 格式不正確');
        }

        const key = cacheKey(this.config?.baseUrl, saEmail);
        const now = Math.floor(Date.now() / 1000);
        const cached = TOKEN_CACHE.get(key);
        if (cached && cached.expiresAt > now && cached.region === this._region) {
            return cached.accessToken;
        }

        const spUrl = this._serverPluginUrl;
        let data;
        try {
            const resp = await this.fetch(`${spUrl}/vertex-exchange-token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ serviceAccountJson: saJson }),
            });
            data = await resp.json().catch(() => ({}));
        } catch (err) {
            throw new Error(`換取 Vertex OAuth token 失敗：無法連接小白X server-plugin（${err.message}）。請確認小白X server-plugin 已安裝並重啟 ST。`);
        }
        if (!data.ok) {
            throw new Error(`換取 Vertex OAuth token 失敗：${data.error || '未知錯誤'}`);
        }
        const expiresAt = data.expiresAt || (now + 3500);
        TOKEN_CACHE.set(key, {
            accessToken: data.accessToken,
            expiresAt,
            region: this._region,
        });
        return data.accessToken;
    }

    async chat(task) {
        const token = await this._ensureToken();
        // 注入 reverse_proxy + proxy_password → ST 走 proxy 路徑（繞過 ST vertexai full auth bug）
        this.config = {
            ...this.config,
            reverse_proxy: this._reverseProxyUrl,
            proxy_password: token,
        };
        return super.chat(task);
    }
}
