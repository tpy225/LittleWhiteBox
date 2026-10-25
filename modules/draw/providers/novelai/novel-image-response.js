const MAX_RESPONSE_BYTES = 128 * 1024 * 1024;
const MAX_DECOMPRESSED_BYTES = 128 * 1024 * 1024;

export class NovelImageResponseError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NovelImageResponseError';
    }
}

function createAbortError() {
    const error = new Error('已取消');
    error.name = 'AbortError';
    return error;
}

function detectImageMime(bytes) {
    const isPng = bytes.length >= 8
        && [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A].every((value, index) => bytes[index] === value);
    const isJpeg = bytes.length >= 3 && bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF;
    const isWebp = bytes.length >= 12
        && String.fromCharCode(...bytes.subarray(0, 4)) === 'RIFF'
        && String.fromCharCode(...bytes.subarray(8, 12)) === 'WEBP';
    if (isPng) return 'image/png';
    if (isJpeg) return 'image/jpeg';
    if (isWebp) return 'image/webp';
    return null;
}

function bytesToBase64(bytes) {
    const parts = [];
    const chunkSize = 0x8000;
    for (let offset = 0; offset < bytes.length; offset += chunkSize) {
        parts.push(String.fromCharCode(...bytes.subarray(offset, offset + chunkSize)));
    }
    return btoa(parts.join(''));
}

export function formatImageBase64(base64, mime) {
    return mime === 'image/png' ? base64 : `data:${mime};base64,${base64}`;
}

export async function readImageResponse(response, signal) {
    const declaredLength = Number(response.headers.get('content-length'));
    if (Number.isFinite(declaredLength) && declaredLength > MAX_RESPONSE_BYTES) {
        await response.body?.cancel().catch(() => {});
        throw new NovelImageResponseError('图片响应超过 128 MiB 限制');
    }

    if (!response.body?.getReader) {
        const buffer = await response.arrayBuffer();
        if (buffer.byteLength > MAX_RESPONSE_BYTES) {
            throw new NovelImageResponseError('图片响应超过 128 MiB 限制');
        }
        return new Uint8Array(buffer);
    }

    const reader = response.body.getReader();
    let aborted = false;
    const abort = () => {
        aborted = true;
        reader.cancel(createAbortError()).catch(() => {});
    };
    if (signal?.aborted) {
        abort();
        throw createAbortError();
    }
    signal?.addEventListener('abort', abort, { once: true });

    const chunks = [];
    let total = 0;
    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            total += value.byteLength;
            if (total > MAX_RESPONSE_BYTES) {
                await reader.cancel();
                throw new NovelImageResponseError('图片响应超过 128 MiB 限制');
            }
            chunks.push(value);
        }
        if (aborted) throw createAbortError();
    } finally {
        signal?.removeEventListener('abort', abort);
        reader.releaseLock();
    }

    const bytes = new Uint8Array(total);
    let offset = 0;
    chunks.forEach(chunk => {
        bytes.set(chunk, offset);
        offset += chunk.byteLength;
    });
    return bytes;
}

function readZipImageEntry(file, signal) {
    return new Promise((resolve, reject) => {
        const stream = file.internalStream('uint8array');
        const chunks = [];
        let total = 0;
        let settled = false;

        const cleanup = () => signal?.removeEventListener('abort', abort);
        const fail = (error) => {
            if (settled) return;
            settled = true;
            stream.pause();
            cleanup();
            reject(error);
        };
        const abort = () => fail(createAbortError());

        stream.on('data', chunk => {
            if (settled) return;
            total += chunk.byteLength;
            if (total > MAX_DECOMPRESSED_BYTES) {
                fail(new NovelImageResponseError('图片解压结果超过 128 MiB 限制'));
                return;
            }
            chunks.push(chunk);
        });
        stream.on('error', error => {
            if (error?.name === 'AbortError') fail(error);
            else fail(new NovelImageResponseError('ZIP 图片解压失败'));
        });
        stream.on('end', () => {
            if (settled) return;
            settled = true;
            cleanup();
            const bytes = new Uint8Array(total);
            let offset = 0;
            chunks.forEach(chunk => {
                bytes.set(chunk, offset);
                offset += chunk.byteLength;
            });
            resolve(bytes);
        });

        if (signal?.aborted) abort();
        else {
            signal?.addEventListener('abort', abort, { once: true });
            stream.resume();
        }
    });
}

// Third-party NAI-compatible relays frequently reply with JSON wrappers or bare
// base64 text instead of the official raw-image/ZIP body. These helpers stay
// deliberately forgiving about key names but strict about image magic bytes.
const BASE64_PATTERN = /^(data:image\/[a-z+.-]+;base64,)?[A-Za-z0-9+/]+={0,2}$/;

function decodeBase64ToBytes(base64) {
    const normalized = String(base64).trim().replace(/^data:image\/[a-z+.-]+;base64,/, '').replace(/\s+/g, '');
    if (normalized.length < 256 || normalized.length % 4 === 1 || !BASE64_PATTERN.test(normalized)) return null;
    try {
        const binary = atob(normalized);
        const bytes = new Uint8Array(binary.length);
        for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
        return bytes;
    } catch {
        return null;
    }
}

function findBase64Value(value, depth = 0) {
    if (!value || depth > 6) return null;
    if (typeof value === 'string') return BASE64_PATTERN.test(value.trim().replace(/\s+/g, '')) ? value : null;
    if (Array.isArray(value)) {
        for (const item of value) {
            const found = findBase64Value(item, depth + 1);
            if (found) return found;
        }
        return null;
    }
    if (typeof value === 'object') {
        for (const key of ['b64_json', 'base64', 'image_base64', 'image', 'images', 'payload', 'data']) {
            if (key in value) {
                const found = findBase64Value(value[key], depth + 1);
                if (found) return found;
            }
        }
    }
    return null;
}

function findImageUrl(value, depth = 0) {
    if (!value || depth > 6) return null;
    if (typeof value === 'string') {
        return /^https:\/\/[^\s"']+/i.test(value.trim()) ? value.trim() : null;
    }
    if (Array.isArray(value)) {
        for (const item of value) {
            const found = findImageUrl(item, depth + 1);
            if (found) return found;
        }
        return null;
    }
    if (typeof value === 'object') {
        for (const key of ['url', 'image_url', 'imageUrl', 'image', 'images', 'link', 'data']) {
            if (key in value) {
                const found = findImageUrl(value[key], depth + 1);
                if (found) return found;
            }
        }
    }
    return null;
}

async function extractImageFromJsonBody(responseData, loadJSZip, signal) {
    const text = new TextDecoder().decode(responseData).trim();
    if (!/^[[{]/.test(text)) return null;
    let body;
    try {
        body = JSON.parse(text);
    } catch {
        return null;
    }
    if (signal?.aborted) throw createAbortError();
    const base64 = findBase64Value(body);
    if (base64) {
        const bytes = decodeBase64ToBytes(base64);
        const mime = bytes && detectImageMime(bytes);
        if (mime) return formatImageBase64(bytesToBase64(bytes), mime);
    }
    const url = findImageUrl(body);
    if (url) {
        let response;
        try {
            response = await fetch(url, { signal });
        } catch (error) {
            if (error?.name === 'AbortError') throw error;
            throw new NovelImageResponseError(`图片链接下载失败：${error?.message || '网络错误'}`);
        }
        if (!response.ok) throw new NovelImageResponseError(`图片链接下载失败：HTTP ${response.status}`);
        return extractImageFromResponse(await readImageResponse(response, signal), loadJSZip, signal);
    }
    // Structured upstream error (e.g. {code:1,msg:'余额不足'}) with HTTP 200.
    const message = body?.message || body?.msg || body?.error;
    if (typeof message === 'string' && message) throw new NovelImageResponseError(`供应商返回错误：${message}`);
    return null;
}

export async function extractImageFromResponse(responseData, loadJSZip, signal) {
    if (signal?.aborted) throw createAbortError();
    const rawMime = detectImageMime(responseData);
    if (rawMime) return formatImageBase64(bytesToBase64(responseData), rawMime);

    if (signal?.aborted) throw createAbortError();
    const fromJson = await extractImageFromJsonBody(responseData, loadJSZip, signal);
    if (fromJson) return fromJson;

    if (signal?.aborted) throw createAbortError();
    const bareBase64Bytes = decodeBase64ToBytes(new TextDecoder().decode(responseData));
    const bareBase64Mime = bareBase64Bytes && detectImageMime(bareBase64Bytes);
    if (bareBase64Mime) return formatImageBase64(bytesToBase64(bareBase64Bytes), bareBase64Mime);

    const JSZip = await loadJSZip();
    let zip;
    try {
        zip = await JSZip.loadAsync(responseData);
    } catch {
        throw new NovelImageResponseError('NovelAI 返回的 ZIP 格式无效');
    }
    if (signal?.aborted) throw createAbortError();
    const file = Object.values(zip.files).find(item => /\.(png|jpe?g|webp)$/i.test(item.name));
    if (!file) throw new NovelImageResponseError('ZIP 无图片');
    const image = await readZipImageEntry(file, signal);
    const mime = detectImageMime(image);
    if (!mime) throw new NovelImageResponseError('ZIP 内图片格式无效');
    return formatImageBase64(bytesToBase64(image), mime);
}
