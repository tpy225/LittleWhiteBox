import {
    HOST_CHAT_COMPLETIONS_SOURCE_VERTEXAI,
} from '../../../shared/host-llm/chat-completions/client.js';
import { SillyTavernGoogleAdapter } from './sillytavern-google.js';

export class SillyTavernVertexAdapter extends SillyTavernGoogleAdapter {
    provider = 'sillytavern-vertex';
    source = HOST_CHAT_COMPLETIONS_SOURCE_VERTEXAI;

    constructor(config, hostClient, fetchImpl = typeof fetch !== 'undefined' ? fetch : undefined) {
        super(config, hostClient);
        this.fetch = fetchImpl;
        this._tokenCache = null; // { accessToken, expiresAt, region }
    }

    get _serverPluginUrl() {
        const base = String(this.config?.baseUrl || '').trim();
        if (!base) return null;
        try {
            const u = new URL(base);
            u.pathname = u.pathname.replace(/\/+$/, '') + '/api/plugins/littlewhitebox-server';
            return u.toString();
        } catch {
            return null;
        }
    }

    get _region() {
        const r = String(this.config?.vertexRegion || 'us-central1').trim().toLowerCase();
        if (!r || r === 'global') return 'us-central1'; // 有效 Vertex region fallback
        return r;
    }

    get _reverseProxyUrl() {
        return `https://${this._region}-aiplatform.googleapis.com`;
    }

    async _ensureToken() {
        const now = Math.floor(Date.now() / 1000);
        if (this._tokenCache && this._tokenCache.expiresAt > now) {
            // region 變了就重換
            if (this._tokenCache.region === this._region) return this._tokenCache.accessToken;
        }
        const saJson = String(this.config?.serviceAccountJson || '').trim();
        if (!saJson) {
            // 沒有 SA JSON → 讓 ST 走 vertexai 預設路徑（可能踩 full auth bug）
            return null;
        }
        const spUrl = this._serverPluginUrl;
        if (!spUrl) {
            console.warn('[SillyTavernVertex] baseUrl missing; cannot exchange SA token via server-plugin');
            return null;
        }
        try {
            const resp = await this.fetch(`${spUrl}/vertex-exchange-token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ serviceAccountJson: saJson }),
            });
            const data = await resp.json().catch(() => ({}));
            if (!resp.ok || !data.ok) {
                console.warn('[SillyTavernVertex] token exchange failed:', data.error || resp.status);
                return null;
            }
            this._tokenCache = {
                accessToken: data.accessToken,
                expiresAt: data.expiresAt || (now + 3500),
                region: this._region,
            };
            return data.accessToken;
        } catch (err) {
            console.warn('[SillyTavernVertex] token exchange error:', err.message);
            return null;
        }
    }

    async chat(task) {
        const token = await this._ensureToken();
        if (token) {
            // 暫時注入到 config，讓 buildHostChatCompletionsFields 讀到 reverse_proxy + proxy_password
            this.config = {
                ...this.config,
                reverse_proxy: this._reverseProxyUrl,
                proxy_password: token,
            };
        } else {
            // 移除舊的 token 注入，讓 ST 走預設路徑
            const { reverse_proxy, proxy_password, ...rest } = this.config || {};
            this.config = rest;
        }
        return super.chat(task);
    }
}
