import {
    HOST_CHAT_COMPLETIONS_SOURCE_VERTEXAI,
} from '../../../shared/host-llm/chat-completions/client.js';
import { SillyTavernGoogleAdapter } from './sillytavern-google.js';

export class SillyTavernVertexAdapter extends SillyTavernGoogleAdapter {
    provider = 'sillytavern-vertex';
    source = HOST_CHAT_COMPLETIONS_SOURCE_VERTEXAI;

    buildPayload(task, effectiveReasoning) {
        const payload = super.buildPayload(task, effectiveReasoning);
        const authMode = this.config?.vertexAuthMode || 'full';
        const region = this.config?.vertexRegion || 'us-central1';
        payload.vertexai_auth_mode = authMode;
        if (region) payload.vertexai_region = region;
        // ST 的 vertexai 路徑（full / express）從 secrets 取憑證，不走 payload 的
        // reverse_proxy / proxy_password；因此清空這兩個欄位，避免意外走 proxy 分支。
        delete payload.reverse_proxy;
        delete payload.proxy_password;
        return payload;
    }
}
