import {
    HOST_CHAT_COMPLETIONS_SOURCE_VERTEXAI,
} from '../../../shared/host-llm/chat-completions/client.js';
import { SillyTavernGoogleAdapter } from './sillytavern-google.js';

// 追隨酒館原生 Vertex AI：ST 自己從 secrets.VERTEXAI_SERVICE_ACCOUNT（SA JSON）讀取憑證、
// 簽 JWT、換 OAuth token，adapter 完全不介入認證鏈路。
// 參考：chat_completion_source = 'vertexai' 時 ST 會走 vertexai 專屬 auth 路徑。

export class SillyTavernVertexAdapter extends SillyTavernGoogleAdapter {
    provider = 'sillytavern-vertex';
    source = HOST_CHAT_COMPLETIONS_SOURCE_VERTEXAI;
}
