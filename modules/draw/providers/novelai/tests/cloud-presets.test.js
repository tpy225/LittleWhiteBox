import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { exportPreset, parsePresetData } from '../cloud-presets.js';

test('converts the frozen released V1 parameter preset at the import boundary', async () => {
    const fixture = JSON.parse(await readFile(
        new URL('./fixtures/novel-params-preset-v1.json', import.meta.url),
        'utf8',
    ));
    const { preset, warnings } = parsePresetData(fixture, () => 'imported-id');

    assert.equal(preset.id, 'imported-id');
    assert.equal(preset.maxImages, 0);
    assert.equal(preset.maxCharactersPerImage, 0);
    assert.equal(preset.params.v5QualityPresetId, 'none');
    assert.equal(preset.params.v5UcPresetId, 'humanFocus');
    assert.equal(preset.params.transparentBackground, false);
    assert.deepEqual(warnings, []);
});

test('round-trips all current V2 parameter preset fields', () => {
    const originalPrompt = globalThis.prompt;
    globalThis.prompt = () => '';
    try {
        const source = {
            id: 'source-id',
            name: 'V5 自定义',
            positivePrefix: 'depthness',
            negativePrefix: 'bad',
            maxImages: 4,
            maxCharactersPerImage: 12,
            params: {
                model: 'nai-diffusion-5-curated',
                sampler: 'k_euler_ancestral',
                scheduler: 'karras',
                steps: 23,
                scale: 7,
                width: 832,
                height: 1216,
                seed: 123,
                qualityToggle: false,
                autoSmea: false,
                ucPreset: 3,
                cfg_rescale: 0.25,
                v5QualityPresetId: 'light',
                v5UcPresetId: 'furryFocus',
                transparentBackground: true,
                variety_boost: false,
                sm: false,
                sm_dyn: false,
                decrisper: false,
            },
        };

        const exported = exportPreset(source);
        const { preset, warnings, vibeImports } = parsePresetData(exported, () => 'round-trip-id');

        assert.equal(exported.version, 2);
        assert.equal(exported.preset.vibe, undefined);
        assert.deepEqual(preset, {
            ...source,
            id: 'round-trip-id',
            thumbnail: '',
            vibe: { groupId: '', selections: [] },
        });
        assert.deepEqual(vibeImports, []);
        assert.equal(preset.vibe.groupId, '');
        assert.deepEqual(warnings, []);
    } finally {
        globalThis.prompt = originalPrompt;
    }
});

test('round-trips vibe references with inlined library singles', () => {
    const originalPrompt = globalThis.prompt;
    globalThis.prompt = () => '';
    try {
        const source = {
            id: 'source-id',
            name: '带 Vibe 的预设',
            positivePrefix: 'a',
            negativePrefix: 'b',
            maxImages: 0,
            maxCharactersPerImage: 0,
            vibe: {
                groupId: '',
                selections: [
                    { id: 'vibe-a', enabled: false, strength: 0.42 },
                    { id: 'vibe-b', enabled: true, strength: 0.8 },
                    // 库里已删除的引用：导出时跳过
                    { id: 'vibe-gone', enabled: true, strength: 0.6 },
                ],
            },
            params: { model: 'nai-diffusion-4-curated' },
        };
        const vibeLibrary = {
            singles: [
                {
                    id: 'vibe-a',
                    name: '参考一',
                    image: 'data:image/jpeg;base64,AAA',
                    thumbnail: 'data:image/jpeg;base64,THUMB',
                    infoExtracted: 1,
                    encodings: { v4curated: 'ENC-A-4', 'v4-5full': 'ENC-A-45' },
                },
                {
                    id: 'vibe-b',
                    name: '参考二',
                    image: 'data:image/jpeg;base64,BBB',
                    thumbnail: '',
                    infoExtracted: 0,
                    encodings: {},
                },
            ],
            groups: [],
        };

        const exported = exportPreset(source, vibeLibrary);
        assert.equal(exported.preset.vibe.references.length, 2);
        assert.deepEqual(exported.preset.vibe.references[0], {
            id: 'vibe-a',
            enabled: false,
            strength: 0.42,
            item: vibeLibrary.singles[0],
        });

        let vibeSeq = 0;
        const genVibeId = () => `local-vibe-${++vibeSeq}`;
        const { preset, warnings, vibeImports, vibeGroup } = parsePresetData(
            exported,
            () => 'preset-id',
            genVibeId,
        );

        assert.deepEqual(warnings, []);
        assert.equal(vibeGroup, null);
        assert.equal(vibeImports.length, 2);
        assert.equal(vibeImports[0].id, 'local-vibe-1');
        assert.equal(vibeImports[0].image, 'data:image/jpeg;base64,AAA');
        assert.equal(vibeImports[0].encodings['v4-5full'], 'ENC-A-45');
        assert.equal(preset.vibe.groupId, '');
        assert.deepEqual(preset.vibe.selections, [
            { id: 'local-vibe-1', enabled: false, strength: 0.42 },
            { id: 'local-vibe-2', enabled: true, strength: 0.8 },
        ]);
    } finally {
        globalThis.prompt = originalPrompt;
    }
});

test('round-trips vibe group with inlined members and rewires preset to the new group', () => {
    const originalPrompt = globalThis.prompt;
    globalThis.prompt = () => '';
    try {
        const vibeLibrary = {
            singles: [
                {
                    id: 'vibe-a',
                    name: '组内一',
                    image: 'data:image/jpeg;base64,AAA',
                    thumbnail: 'thumb-a',
                    infoExtracted: 1,
                    encodings: { v4full: 'ENC-A' },
                },
                {
                    id: 'vibe-b',
                    name: '组内二',
                    image: 'data:image/jpeg;base64,BBB',
                    thumbnail: '',
                    infoExtracted: 0,
                    encodings: { v4curated: 'ENC-B' },
                },
            ],
            groups: [
                {
                    id: 'grp-origin',
                    name: '我的组合',
                    members: [
                        { id: 'vibe-a', enabled: true, strength: 0.7 },
                        { id: 'vibe-b', enabled: false, strength: 0.3 },
                    ],
                },
            ],
        };
        const source = {
            id: 'source-id',
            name: '引用组的预设',
            positivePrefix: 'a',
            negativePrefix: 'b',
            maxImages: 0,
            maxCharactersPerImage: 0,
            vibe: { groupId: 'grp-origin', selections: [] },
            params: { model: 'nai-diffusion-4-full' },
        };

        const exported = exportPreset(source, vibeLibrary);
        assert.equal(exported.preset.vibe.references, undefined);
        assert.equal(exported.preset.vibe.group.name, '我的组合');
        assert.deepEqual(exported.preset.vibe.group.members.map(m => [m.id, m.enabled, m.strength]), [
            ['vibe-a', true, 0.7],
            ['vibe-b', false, 0.3],
        ]);

        let vibeSeq = 0;
        const genVibeId = () => `vibe-local-${++vibeSeq}`;
        const { preset, vibeImports, vibeGroup } = parsePresetData(
            exported,
            () => 'preset-id',
            genVibeId,
        );

        assert.equal(vibeImports.length, 2);
        assert.ok(vibeGroup, '应返回待入库的重建组');
        assert.match(vibeGroup.id, /^vibegroup-/);
        assert.equal(vibeGroup.name, '我的组合');
        assert.deepEqual(vibeGroup.members, [
            { id: 'vibe-local-1', enabled: true, strength: 0.7 },
            { id: 'vibe-local-2', enabled: false, strength: 0.3 },
        ]);
        assert.equal(preset.vibe.groupId, vibeGroup.id);
        assert.deepEqual(preset.vibe.selections, []);
    } finally {
        globalThis.prompt = originalPrompt;
    }
});

test('rejects missing and unknown parameter preset versions', () => {
    const base = { type: 'novel-draw-preset', preset: { params: {} } };
    assert.throws(() => parsePresetData(base, () => 'id'), /版本.*缺失/);
    assert.throws(() => parsePresetData({ ...base, version: 3 }, () => 'id'), /版本.*3/);
});
