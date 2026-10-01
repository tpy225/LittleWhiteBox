import { SUBMIT_SCENE_PLAN_TOOL_NAME } from './scene-plan-contract.js';
import { normalizeScenePlannerProfile } from './scene-planner-profile.js';

// Model-facing instructions are prepared in the browser, not bundled into the executor.
function normalizeLimit(value) {
    const number = Number(value);
    return Number.isInteger(number) && number > 0 ? number : 0;
}

function stringSchema(description, { minLength = 0 } = {}) {
    return {
        type: 'string',
        ...(minLength > 0 ? { minLength } : {}),
        description,
    };
}

const CHARACTER_TYPES = Object.freeze(['girl', 'boy', 'woman', 'man', 'other', 'no_humans']);

const INTERACT_DESCRIPTIONS = Object.freeze({
    directional: '与其他角色的接触动作，带方向前缀：`source#动作` 发起方、`target#动作` 接受方、`mutual#动作` 互相。同一个互动分别写进每位参与角色自己的 interact；一个角色参与多个互动时逗号并列。没有互动时省略。',
    plain: '与其他角色的接触动作 tag，如 `hugging`、`holding hands`。没有互动时省略。',
});

const UC_DESCRIPTIONS = Object.freeze({
    character: '只针对该角色排除的 tag：与当前状态互斥的特征（无胸罩→`bra`、脱帽→`hat`）、因视角或遮挡不可见的部位、与另一角色相反的情绪。作为该角色专属的负向生效。通用画质负面由用户预设负责，不写在这里。没有时省略。',
    global: 'Tags to exclude from the entire image. All characters\' uc values are merged into one global negative prompt, so include a tag only when it is unwanted for every subject and the background. A feature or emotion needed by another character stays out of uc. General quality negatives come from the user\'s preset. Omit when there is nothing to exclude.',
});

const CENTER_SCHEMAS = Object.freeze({
    grid: () => ({
        type: 'string',
        pattern: '^[A-E][1-5]$',
        description: '角色在画面中的位置，5×5 网格：列 A–E 从左到右，行 1–5 从上到下。居中（C3）时省略。多个角色可以重叠（拥抱、亲吻）。',
    }),
    normalized: () => ({
        type: 'object',
        additionalProperties: false,
        required: ['x', 'y'],
        properties: {
            x: { type: 'number', minimum: 0, maximum: 1 },
            y: { type: 'number', minimum: 0, maximum: 1 },
        },
        description: '角色在画面中的位置，左上角 (0, 0)，右下角 (1, 1)。居中 (0.5, 0.5) 时省略。多个角色可以重叠（拥抱、亲吻）。',
    }),
});

/**
 * Field semantics live here and nowhere else: the prose prompts only decide *what* to draw.
 * Provider differences (center support, interact syntax, uc scope) come from the profile.
 */
export function getScenePlanCharacterProperties(profile) {
    const effective = normalizeScenePlannerProfile(profile);
    return {
        name: stringSchema(
            '角色名。已录入角色用【已录入角色】列出的规范名，原文用别名也归一到规范名。未知角色用原文名字，无名时用简短称呼。',
            { minLength: 1 },
        ),
        danbooru: stringSchema(
            '该角色的 Danbooru 身份 tag，下划线格式：同人角色 `character_name_(series)`，原创角色 `中文名_(original)`。仅在确定时提交；已录入角色省略。',
        ),
        type: stringSchema(
            `Character category: ${CHARACTER_TYPES.join(' / ')}. Use \`no_humans\` for non-humanoid subjects such as animals or monsters. Fill this for every unregistered character; omit for registered characters, whose category comes from the character library.`,
        ),
        appear: stringSchema(
            'Stable appearance visible in this composition, such as hair, eyes or build. Every unregistered character needs a non-empty appearance description. Omit for registered characters, whose appearance comes from the character library. 若 <content> 的【上镜锚点】给了该角色「上镜外貌」，必须逐字复用，仅在正文明确写出永久外貌变化时改写。',
        ),
        costume: stringSchema(
            '本图实际穿着与状态：版型/款式、主色、关键部件、穿着状态（敞开、破损、湿透、滑落），不要只写 school uniform、dress 这类孤立泛词。若【上镜锚点】给了「当前着装」，默认逐字复用；只有正文出现穿脱、换装、衣物损坏或明确的时间/场景切换时才改写。已录入角色另有服装参考时可在锚点之外据参考补充，但不把多套拼在一起。没有服装事实时省略。',
        ),
        action: stringSchema(
            '本图该角色的姿态、动作、视线、面向、表情。',
            { minLength: 1 },
        ),
        interact: stringSchema(INTERACT_DESCRIPTIONS[effective.interactSyntax]),
        uc: stringSchema(UC_DESCRIPTIONS[effective.ucScope]),
        ...(effective.centerMode === 'none' ? {} : { center: CENTER_SCHEMAS[effective.centerMode]() }),
    };
}

export function createSubmitScenePlanTool(options = {}) {
    const maxImages = normalizeLimit(options.maxImages);
    const maxPlanImages = normalizeLimit(options.maxPlanImages);
    const maxCharactersPerImage = normalizeLimit(options.maxCharactersPerImage);
    const insertPointCount = normalizeLimit(options.insertPointCount);
    const profile = normalizeScenePlannerProfile(options.profile);
    const maxPlanItems = maxImages || maxPlanImages;
    const charactersSchema = {
        type: 'array',
        ...(maxCharactersPerImage ? { maxItems: maxCharactersPerImage } : {}),
        description: '画面中出现的角色，按重要度排序。纯风景、物件、建筑主体时为空数组。每项的字段按 danbooru → type → appear → costume → action → interact 的顺序拼成该角色的提示词。',
        items: {
            type: 'object',
            additionalProperties: false,
            required: ['name', 'action'],
            properties: getScenePlanCharacterProperties(profile),
        },
    };
    const imagesSchema = {
        type: 'array',
        minItems: maxImages || 1,
        ...(maxPlanItems ? { maxItems: maxPlanItems } : {}),
        description: '图片任务，按阅读顺序排列。数量约束见消息末尾。',
        items: {
            type: 'object',
            additionalProperties: false,
            required: ['index', 'insert_after', 'scene', 'title', 'characters'],
            properties: {
                index: { type: 'integer', minimum: 1, description: '本图序号，从 1 起。' },
                insert_after: {
                    type: 'integer',
                    minimum: 1,
                    ...(insertPointCount ? { maximum: insertPointCount } : {}),
                    description: 'The number N of an existing `【插图点 N】` marker in <content>. Choose the nearest marker after the moment depicted. Images at the same marker appear in array order.',
                },
                scene: stringSchema(
                    '画面整体：人数与关系、构图与视角、背景、光影、氛围，逗号分隔的英文 tag。角色个体的外貌与动作不写在这里。拼在正向提示词最前。',
                    { minLength: 1 },
                ),
                title: stringSchema(
                    '本次绘画的主题标题，简体中文，6～14 字，只输出标题文字本身，不加任何标点。'
                    + '要求：①像给这一格画面起的小标题，抓最具体的动作、物件或瞬间，有画面感，'
                    + '不要笼统的主题词；②句式必须多样，禁止每条都套用「XX的XX」这一种结构，'
                    + '「的」字句式只在确实最贴切时偶尔使用；③可自由变换开头方式：动作切入'
                    + '（如「那只手终于探了出来」）、台词或声音（如「听到她说晚上好」）、'
                    + '悬念判断（如「距离正在缩到三米」）、场景白描（如「凌晨两点的便利店」）、'
                    + '比喻拟人（如「路灯吞掉了影子」）、判断宣告（如「洗手台上的主权宣告」）；'
                    + '④同一批多张图的标题，开头方式不得重复。',
                    { minLength: 1 },
                ),
                characters: charactersSchema,
            },
        },
    };

    return {
        type: 'function',
        function: {
            name: SUBMIT_SCENE_PLAN_TOOL_NAME,
            description: '提交本次全部图片任务。一个回合只调用一次。',
            parameters: {
                type: 'object',
                additionalProperties: false,
                required: ['images'],
                properties: {
                    images: imagesSchema,
                },
            },
        },
    };
}
