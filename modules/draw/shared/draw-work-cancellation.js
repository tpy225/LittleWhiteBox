import { drawCancellationJournal } from './draw-cancellation-journal.js';
import { requestPendingImageJobCancellation } from './pending-image-jobs.js';

// 把取消意图同步投影到后台任务交付日志。二改的 pending-image-jobs 用
// requestPendingImageJobCancellation(jobId) 记录取消意图；后端 run 由 client
// 负责。这里不依赖原 upstream 的 acknowledgePendingImageJobCancellations。
async function acknowledgePendingImageJobCancellations(entry) {
    const ids = [...new Set([...(entry.jobIds || []), ...(entry.runIds || [])])];
    await Promise.all(ids.map((id) => requestPendingImageJobCancellation(id).catch(() => null)));
}

// 兼容不同 client：优先 cancelWork（批量），否则逐 runId 调 cancelRun。
async function invokeClientCancel(client, entry) {
    if (typeof client?.cancelWork === 'function') {
        return client.cancelWork({ owner: entry.owner, jobIds: entry.jobIds, runIds: entry.runIds });
    }
    const calls = [];
    if (typeof client?.cancelRun === 'function') {
        for (const runId of entry.runIds) calls.push(client.cancelRun(runId).catch(() => null));
    }
    await Promise.all(calls);
}

const barriers = new WeakMap();
const signalJobs = new WeakMap();

export function registerDrawCancellationJob(signal, jobId) {
    if (!signal) return;
    const ids = signalJobs.get(signal) || new Set();
    ids.add(jobId);
    signalJobs.set(signal, ids);
}

export function captureDrawCancellationJobs(signals) {
    return signals.flatMap(signal => [...(signalJobs.get(signal) || [])]);
}

// Register before aborting any controller. Monitors must not turn one floor
// click into independent HTTP cancellations while its target set is captured.
export function holdDrawCancellation(signals, operation) {
    const pending = Promise.resolve().then(operation).catch(error => {
        error.detached = true;
        throw error;
    });
    for (const signal of signals) barriers.set(signal, pending);
    return pending;
}

export async function waitForDrawCancellation(signal) {
    await barriers.get(signal);
}

async function completeCancellation(entry, client, journal) {
    await invokeClientCancel(client, entry);
    // Backend jobs are process-local and may already be absent. Their ACK must
    // survive in the delivery journal before we drop the only local intent.
    await acknowledgePendingImageJobCancellations(entry);
    await journal.forget(entry.id);
}

export async function cancelDrawWork(targets, client, journal = drawCancellationJournal) {
    if (!targets.jobIds.length && !targets.runIds.length) return false;
    const entry = await journal.record(targets);
    await completeCancellation(entry, client, journal);
    return true;
}

export async function resumeDrawCancellations(client, owner, journal = drawCancellationJournal) {
    const blockedJobIds = new Set(), blockedRunIds = new Set(), failures = [];
    const block = entry => {
        for (const id of entry.jobIds) blockedJobIds.add(id);
        for (const id of entry.runIds) blockedRunIds.add(id);
    };
    for (const entry of await journal.list()) {
        // Other profiles share this browser database, not the server namespace.
        // Keep their intent and delivery records untouched until that user returns.
        if (entry.owner !== owner) { block(entry); continue; }
        try {
            await completeCancellation(entry, client, journal);
        } catch (error) {
            block(entry);
            failures.push(error);
        }
    }
    return { blockedJobIds, blockedRunIds, failures };
}
