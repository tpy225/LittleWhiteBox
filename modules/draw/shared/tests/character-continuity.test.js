import assert from 'node:assert/strict';
import test from 'node:test';

import {
    buildContinuityBlock,
    buildContinuityBlockForRequest,
    mergePlanIntoContinuity,
    normalizeContinuity,
    readContinuityContext,
    recordPlanContinuity,
    selectContinuityEntries,
    writeContinuityContext,
    CONTINUITY_META_KEY,
} from '../character-continuity.js';

const taskWith = chars => [{ index: 0, chars }];

test('normalizeContinuity tolerates dirty data and sorts/dedupes by timestamp', () => {
    const state = normalizeContinuity({
        version: 99,
        entries: [
            null,
            'garbage',
            { name: '  ', appear: 'blue hair' },
            { name: 'Alice', appear: '', costume: '' },
            { name: 'Bob', appear: 'black hair', costume: 'suit', at: 50 },
            { name: 'alice', appear: 'silver hair', at: '20' },
            { name: 'Alice', appear: 'blue hair', at: 10 },
            { name: 'Carol', appear: 'red hair', costume: 'red  dress', at: 30 },
        ],
    });

    assert.equal(state.version, 1);
    assert.deepEqual(state.entries.map(entry => entry.name), ['alice', 'Carol', 'Bob']);
    assert.deepEqual(state.entries.map(entry => entry.at), [20, 30, 50]);
    // 同名按大小写不敏感归并，保留时间戳更新的一条。
    assert.equal(state.entries[0].appear, 'silver hair');
    // 空白折叠。
    assert.equal(state.entries[1].costume, 'red dress');
});

test('normalizeContinuity collapses whitespace and truncates oversized tag strings', () => {
    const longTags = `tag ${'x'.repeat(700)}`;
    const state = normalizeContinuity({
        entries: [{ name: 'Alice', appear: longTags, at: 1 }],
    });
    assert.equal(state.entries[0].appear.length, 600);
});

test('normalizeContinuity returns an empty snapshot for null input', () => {
    assert.deepEqual(normalizeContinuity(null), { version: 1, entries: [] });
    assert.deepEqual(normalizeContinuity({}), { version: 1, entries: [] });
});

test('selectContinuityEntries keeps known characters unconditionally and requires body hits for unknowns', () => {
    const entries = normalizeContinuity({
        entries: [
            { name: 'Alice', costume: 'school uniform', at: 1 },
            { name: 'Mira', appear: 'pink hair', costume: 'kimono', at: 2 },
            { name: 'Stranger', appear: 'hood', at: 3 },
            { name: 'Teacher', costume: 'lab coat', at: 4 },
        ],
    }).entries;

    const selected = selectContinuityEntries(entries, {
        knownNames: ['Alice'],
        bodyText: 'Alice walks with Mira, but nobody else is named here.',
    });
    assert.deepEqual(selected.map(entry => entry.name), ['Alice', 'Mira']);

    // 正文未提及的未录入角色不注入；通用称呼即使被提及也不注入。
    const onlyGenericMention = selectContinuityEntries(entries, {
        knownNames: [],
        bodyText: 'a stranger and a teacher pass by',
    });
    assert.deepEqual(onlyGenericMention.map(entry => entry.name), []);
});

test('buildContinuityBlock omits appearance lines for known characters and renders both lines for unknowns', () => {
    const entries = [
        { name: 'Alice', appear: 'blue hair', costume: 'school uniform', at: 1 },
        { name: 'Mira', appear: 'pink hair', costume: 'kimono', at: 2 },
    ];

    const block = buildContinuityBlock(entries, { knownNames: ['Alice'] });
    assert.match(block, /【上镜锚点】/);
    assert.match(block, /- Alice（角色库已录入，身份外貌以【已录入角色】为准）｜当前着装: school uniform/);
    assert.doesNotMatch(block, /Alice[^\n]*上镜外貌/);
    assert.match(block, /- Mira｜上镜外貌: pink hair｜当前着装: kimono/);

    assert.equal(buildContinuityBlock([], { knownNames: [] }), '');
    // 只有空标签的条目不产生行。
    assert.equal(
        buildContinuityBlock([{ name: 'Alice', appear: '', costume: '', at: 1 }], { knownNames: [] }),
        '',
    );
});

test('mergePlanIntoContinuity stores only costume snapshots for known characters', () => {
    const next = mergePlanIntoContinuity([], taskWith([
        { name: 'Alice', appear: 'blue hair, blue eyes', costume: 'white shirt, pleated skirt' },
    ]), { knownNames: ['Alice'], now: 100 });

    assert.equal(next.entries.length, 1);
    assert.deepEqual(next.entries[0], {
        name: 'Alice',
        appear: '',
        costume: 'white shirt, pleated skirt',
        at: 100,
    });

    // 已录入角色本次漏写 costume 时保留旧快照，不清空。
    const retained = mergePlanIntoContinuity(next.entries, taskWith([
        { name: 'alice', appear: 'ignored', costume: '' },
    ]), { knownNames: ['Alice'], now: 200 });
    assert.equal(retained.entries[0].costume, 'white shirt, pleated skirt');
    assert.equal(retained.entries[0].appear, '');
    assert.equal(retained.entries[0].name, 'Alice'); // 首次出现的写法保持不变
    assert.equal(retained.entries[0].at, 100);
});

test('mergePlanIntoContinuity fills unknown snapshots field by field without clearing omissions', () => {
    const first = mergePlanIntoContinuity([], taskWith([
        { name: 'Mira', appear: 'pink hair', costume: 'kimono' },
    ]), { knownNames: [], now: 100 });
    assert.deepEqual(first.entries[0], {
        name: 'Mira',
        appear: 'pink hair',
        costume: 'kimono',
        at: 100,
    });

    // 只换装：外貌沿用，着装更新，时间戳刷新。
    const changed = mergePlanIntoContinuity(first.entries, taskWith([
        { name: 'Mira', appear: '', costume: 'evening gown' },
    ]), { knownNames: [], now: 200 });
    assert.equal(changed.entries[0].appear, 'pink hair');
    assert.equal(changed.entries[0].costume, 'evening gown');
    assert.equal(changed.entries[0].at, 200);

    // 两个字段都漏写：不产生更新。
    const untouched = mergePlanIntoContinuity(changed.entries, taskWith([
        { name: 'Mira', appear: '  ', costume: '' },
    ]), { knownNames: [], now: 300 });
    assert.equal(untouched.entries[0].costume, 'evening gown');
    assert.equal(untouched.entries[0].at, 200);
});

test('mergePlanIntoContinuity ignores generic/anonymous names and empty tasks', () => {
    const next = mergePlanIntoContinuity([], taskWith([
        { name: '路人', appear: 'hood', costume: 'rags' },
        { name: 'Teacher', appear: 'glasses', costume: 'suit' },
        { name: 'girl A', appear: 'twintails', costume: 'serafuku' },
        { name: '', costume: 'no name' },
    ]), { knownNames: [], now: 100 });
    assert.deepEqual(next.entries, []);

    assert.deepEqual(mergePlanIntoContinuity([], [], { now: 100 }).entries, []);
});

test('mergePlanIntoContinuity evicts the stalest entry beyond MAX_ENTRIES (40)', () => {
    const entries = Array.from({ length: 40 }, (_, index) => ({
        name: `Char${index}`,
        appear: '',
        costume: `outfit ${index}`,
        at: index + 1,
    }));
    const next = mergePlanIntoContinuity(entries, taskWith([
        { name: 'Newcomer', appear: 'silver hair', costume: 'coat' },
    ]), { knownNames: [], now: 1000 });

    assert.equal(next.entries.length, 40);
    assert.equal(next.entries.some(entry => entry.name === 'Char0'), false);
    assert.equal(next.entries[next.entries.length - 1].name, 'Newcomer');
    assert.equal(next.entries[0].name, 'Char1');
});

test('read/writeContinuityContext round-trip through chatMetadata', () => {
    const context = { chatMetadata: {} };
    const state = normalizeContinuity({
        entries: [{ name: 'Alice', costume: 'uniform', at: 1 }],
    });
    assert.equal(writeContinuityContext(context, state), true);
    assert.equal(context.chatMetadata[CONTINUITY_META_KEY].entries.length, 1);

    const reread = readContinuityContext(context);
    assert.deepEqual(reread.entries[0].name, 'Alice');

    // 缺少 chatMetadata 时静默失败。
    assert.equal(writeContinuityContext({}, state), false);
    assert.deepEqual(readContinuityContext(null).entries, []);
});

test('recordPlanContinuity persists snapshots and notifies the host to save metadata', async () => {
    let saveCalls = 0;
    const context = {
        chatMetadata: {},
        saveMetadataDebounced() { saveCalls += 1; },
    };
    const ok = await recordPlanContinuity(taskWith([
        { name: 'Alice', appear: 'blue hair', costume: 'school uniform' },
        { name: 'Mira', appear: 'pink hair', costume: 'kimono' },
    ]), { knownNames: ['Alice'], context, now: 100 });

    assert.equal(ok, true);
    assert.equal(saveCalls, 1);
    const stored = context.chatMetadata[CONTINUITY_META_KEY].entries;
    assert.deepEqual(stored.map(entry => entry.name), ['Alice', 'Mira']);
    assert.equal(stored[0].appear, ''); // 已录入角色只存着装
    assert.equal(stored[1].appear, 'pink hair');

    // 没有 chatMetadata（例如脱离聊天的调用环境）时安全降级。
    const result = await recordPlanContinuity(taskWith([{ name: 'Alice', costume: 'x' }]), {
        knownNames: ['Alice'],
        context: {},
    });
    assert.equal(result, false);
});

test('buildContinuityBlockForRequest renders only the relevant anchors and degrades to empty', async () => {
    const context = {
        chatMetadata: {
            [CONTINUITY_META_KEY]: {
                entries: [
                    { name: 'Alice', costume: 'school uniform', at: 1 },
                    { name: 'Mira', appear: 'pink hair', costume: 'kimono', at: 2 },
                ],
            },
        },
    };

    const block = await buildContinuityBlockForRequest({
        presentCharacters: [{ name: 'Alice' }],
        bodyText: 'Alice meets Mira in the hall.',
        context,
    });
    assert.match(block, /当前着装: school uniform/);
    assert.match(block, /Mira｜上镜外貌: pink hair/);

    // 本楼既无录入角色、正文也未提及 Mira：区块为空。
    const empty = await buildContinuityBlockForRequest({
        presentCharacters: [],
        bodyText: 'Nobody familiar appears.',
        context,
    });
    assert.equal(empty, '');

    // 宿主异常不抛出。
    const degraded = await buildContinuityBlockForRequest({
        presentCharacters: [{ name: 'Alice' }],
        bodyText: 'Alice',
        context: null,
    });
    assert.equal(typeof degraded, 'string');
});
