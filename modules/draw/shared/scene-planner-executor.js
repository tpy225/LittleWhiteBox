import {
    beginDrawScenePlannerDiagnostic,
    callDrawScenePlannerAgentRuntime,
} from './draw-agent-runtime.js';
import {
    ScenePlannerError,
    assertSubmitScenePlanTool,
    parseSubmittedScenePlan,
} from './scene-plan-contract.js';
import {
    computePlannerRetryDelay,
    isRetryablePlannerError,
    normalizePlannerRetry,
    sleepWithAbort,
} from './planner-retry.js';

function assertPreparedScenePlanner(prepared) {
    const prompt = prepared?.planner?.prompt;
    const validationContext = prepared?.planner?.validationContext;
    if (!prepared
        || prepared.version !== 1
        || !prompt
        || typeof prompt.systemPrompt !== 'string'
        || !Array.isArray(prompt.messages)
        || !validationContext?.sceneSource) {
        throw new ScenePlannerError('Scene Planner 预处理结果无效。', 'PREPARED_INPUT_INVALID');
    }
    assertSubmitScenePlanTool(prepared.planner.tool);
    return prepared;
}

/**
 * The browser supplies the model-facing tool. Execution validates images against
 * its own contract and frozen limits, independently of the supplied JSON schema.
 */
export function createPreparedScenePlannerTask(prepared) {
    const input = assertPreparedScenePlanner(prepared);
    return {
        systemPrompt: input.planner.prompt.systemPrompt,
        messages: input.planner.prompt.messages,
        tools: [input.planner.tool],
        toolChoice: 'required',
    };
}

export async function executePreparedScenePlanner(prepared, options = {}) {
    const input = assertPreparedScenePlanner(prepared);
    const diagnostic = options.diagnostic
        || beginDrawScenePlannerDiagnostic({}, options.onDiagnosticUpdate);
    const task = createPreparedScenePlannerTask(input);
    const validationContext = input.planner.validationContext;
    const preparedProviderConfig = input.agent?.providerConfig || null;
    const logger = options.logger;
    const agentCaller = options.agentCaller || callDrawScenePlannerAgentRuntime;
    const parseResult = (result, providerConfig = {}) => {
        try {
            return parseSubmittedScenePlan(result, {
                sceneSource: validationContext.sceneSource,
                presentCharacters: input.planner.presentCharacters,
                maxImages: validationContext.effectiveMaxImages,
                maxPlanImages: validationContext.maxPlanImages,
                maxCharactersPerImage: validationContext.effectiveMaxCharactersPerImage,
                centerMode: validationContext.centerMode,
                presetName: providerConfig.currentPresetName,
                provider: providerConfig.provider,
                model: providerConfig.model,
            });
        } catch (error) {
            throw error instanceof ScenePlannerError
                ? error
                : new ScenePlannerError(
                    `场景计划校验失败：${error?.message || '未知错误'}`,
                    'TOOL_ARGUMENTS_SCHEMA_INVALID',
                    null,
                    { cause: error },
                );
        }
    };
    // 重试设置来自 prepared.planner.retry；缺省时 maxRetries=0，完全不重试，行为与旧版一致。
    const retry = input.planner.retry
        ? normalizePlannerRetry(input.planner.retry)
        : { maxRetries: 0, baseDelayMs: 0 };
    const sleep = options.sleep || sleepWithAbort;
    let retryNumber = 0;
    let response;
    for (;;) {
        try {
            response = await agentCaller({
                task,
                timeout: options.timeout,
                signal: options.signal,
                diagnostic,
                ...(options.agentOptions || {}),
                ...(options.agentCore ? { agentCore: options.agentCore } : {}),
                ...(Object.hasOwn(options, 'hostClient') ? { hostClient: options.hostClient } : {}),
                ...(preparedProviderConfig ? { providerConfig: preparedProviderConfig } : {}),
                validateResult: (result, context = {}) => parseResult(
                    result,
                    context.providerConfig || preparedProviderConfig || {},
                ),
            });
            break;
        } catch (error) {
            const canRetry = retryNumber < retry.maxRetries
                && !options.signal?.aborted
                && isRetryablePlannerError(error);
            if (canRetry) {
                retryNumber += 1;
                const delayMs = computePlannerRetryDelay(retryNumber, retry, options.random);
                (logger?.warn || logger?.info)?.call(logger, 'novelDrawLlm',
                    `Scene Planner 请求失败，${delayMs}ms 后进行第 ${retryNumber}/${retry.maxRetries} 次重试: ${error?.message || error}`,
                    { code: error?.code });
                try {
                    await sleep(delayMs, options.signal);
                    continue;
                } catch {
                    const aborted = new ScenePlannerError('场景规划已取消。', 'REQUEST_ABORTED', null, { cause: error });
                    diagnostic.fail(aborted, { stage: 'request' });
                    throw aborted;
                }
            }
            logger?.error?.('novelDrawLlm', `Scene Planner 请求失败: ${error?.message || error}`, {
                code: error?.code,
                ...(retryNumber ? { retries: retryNumber } : {}),
            });
            if (error instanceof ScenePlannerError) throw error;
            const wrapped = new ScenePlannerError(
                `Scene Planner 请求失败：${error?.message || '未知错误'}`,
                'PROVIDER_REQUEST_FAILED',
                null,
                { cause: error },
            );
            diagnostic.fail(wrapped, { stage: 'request' });
            throw wrapped;
        }
    }

    let parsed;
    try {
        parsed = response.parsed || parseResult(
            response.result,
            response.providerConfig || preparedProviderConfig || {},
        );
    } catch (error) {
        diagnostic.fail(error, { stage: 'parse' });
        throw error;
    }

    diagnostic.succeed({ stage: 'parse', imageTaskCount: parsed.tasks.length });
    logger?.info?.('novelDrawLlm', `submit_scene_plan 已接收 ${parsed.tasks.length} 个图片任务`, {
        provider: response.providerConfig?.provider,
        model: response.providerConfig?.model,
    });
    return parsed.tasks;
}
