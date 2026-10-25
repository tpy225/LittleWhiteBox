import assert from 'node:assert/strict';
import test from 'node:test';

import {
    NovelImageResponseError,
    extractImageFromResponse,
    readImageResponse,
} from '../novel-image-response.js';

function createZipLoader(chunks) {
    return async () => ({
        async loadAsync() {
            return {
                files: {
                    'image.webp': {
                        name: 'image.webp',
                        internalStream() {
                            const handlers = {};
                            return {
                                on(event, handler) {
                                    handlers[event] = handler;
                                    return this;
                                },
                                pause() {},
                                resume() {
                                    chunks.forEach(chunk => handlers.data?.(chunk));
                                    handlers.end?.();
                                },
                            };
                        },
                    },
                },
            };
        },
    });
}

test('rejects a response declared above 128 MiB before reading it', async () => {
    const response = new Response(new Uint8Array([1]), {
        headers: { 'Content-Length': String(128 * 1024 * 1024 + 1) },
    });

    await assert.rejects(readImageResponse(response), NovelImageResponseError);
});

test('cancels an active browser response stream', async () => {
    const response = new Response(new ReadableStream({ start() {} }));
    const controller = new AbortController();
    const pending = readImageResponse(response, controller.signal);

    controller.abort();

    await assert.rejects(pending, error => error.name === 'AbortError');
});

test('preserves the MIME type of raw images', async () => {
    const jpeg = new Uint8Array([0xFF, 0xD8, 0xFF, 0x00]);
    const result = await extractImageFromResponse(jpeg, () => {
        throw new Error('ZIP loader should not run');
    });

    assert.equal(result, `data:image/jpeg;base64,${btoa(String.fromCharCode(...jpeg))}`);
});

test('classifies malformed upstream bodies as invalid ZIP responses', async () => {
    await assert.rejects(
        extractImageFromResponse(new Uint8Array([1, 2, 3]), async () => ({
            async loadAsync() { throw new Error('malformed'); },
        })),
        NovelImageResponseError,
    );
});

test('streams ZIP output and preserves its MIME type', async () => {
    const webp = new Uint8Array([
        0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50,
    ]);
    const result = await extractImageFromResponse(new Uint8Array([0x50, 0x4B]), createZipLoader([webp]));

    assert.equal(result, `data:image/webp;base64,${btoa(String.fromCharCode(...webp))}`);
});

test('stops ZIP extraction when decompressed output exceeds 128 MiB', async () => {
    const oversizedChunk = { byteLength: 128 * 1024 * 1024 + 1 };

    await assert.rejects(
        extractImageFromResponse(new Uint8Array([0x50, 0x4B]), createZipLoader([oversizedChunk])),
        NovelImageResponseError,
    );
});

const png = new Uint8Array([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, ...new Array(320).fill(0),
]);
const pngBase64 = btoa(String.fromCharCode(...png));

test('extracts base64 images from third-party JSON wrappers', async () => {
    const body = new TextEncoder().encode(JSON.stringify({ code: 0, data: [{ b64_json: pngBase64 }] }));
    const result = await extractImageFromResponse(body, () => { throw new Error('ZIP loader should not run'); });

    // PNG 按二改惯例保持纯 base64（无 data: 前缀），见 formatImageBase64。
    assert.equal(result, pngBase64);
});

test('extracts base64 images from bare base64 text bodies', async () => {
    const body = new TextEncoder().encode(pngBase64);
    const result = await extractImageFromResponse(body, () => { throw new Error('ZIP loader should not run'); });

    assert.equal(result, pngBase64);
});

test('follows image URLs returned by relays', async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => new Response(png, { status: 200 });
    try {
        const body = new TextEncoder().encode(JSON.stringify({ code: 0, data: { images: ['https://relay.example/img.png'] } }));
        const result = await extractImageFromResponse(body, () => { throw new Error('ZIP loader should not run'); });

        assert.equal(result, pngBase64);
    } finally {
        globalThis.fetch = originalFetch;
    }
});

test('surfaces structured provider errors sent with HTTP 200', async () => {
    const body = new TextEncoder().encode(JSON.stringify({ code: 1, msg: '余额不足' }));

    await assert.rejects(
        extractImageFromResponse(body, () => { throw new Error('ZIP loader should not run'); }),
        error => error instanceof NovelImageResponseError && error.message.includes('余额不足'),
    );
});
