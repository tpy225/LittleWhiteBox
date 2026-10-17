import {
    HOST_CHAT_COMPLETIONS_SOURCE_VERTEXAI,
} from '../../../shared/host-llm/chat-completions/client.js';
import { SillyTavernGoogleAdapter } from './sillytavern-google.js';

// 跟隨酒館主 API：直接用 ST 原生 vertexai auth（讀 secrets.VERTEXAI_SERVICE_ACCOUNT），
// 不自換 token、不自管 auth、不注入 reverse_proxy / proxy_password。
// SillyTavernGoogleAdapter 的 payload 結構（Google 原生 messages/stream/use_sysprompt）
// 跟 vertexai source 兼容，ST 收到後會走 vertexai 專屬 auth 路徑。

export class SillyTavernVertexAdapter extends SillyTavernGoogleAdapter {
    provider = 'sillytavern-vertex';
    source = HOST_CHAT_COMPLETIONS_SOURCE_VERTEXAI;
}
