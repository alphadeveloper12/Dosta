export interface FetchMachineGoodsOptions {
  signal?: AbortSignal;
  onAttempt?: (attempt: number) => void;
  maxBackoffMs?: number;
  perAttemptTimeoutMs?: number;
}

export class MachineGoodsAbortedError extends Error {
  constructor() {
    super("MachineGoodsAborted");
    this.name = "AbortError";
  }
}

function isExternalAbort(externalSignal: AbortSignal | undefined): boolean {
  return !!externalSignal && externalSignal.aborted;
}

function delay(ms: number, externalSignal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (isExternalAbort(externalSignal)) {
      reject(new MachineGoodsAbortedError());
      return;
    }
    const t = setTimeout(() => {
      cleanup();
      resolve();
    }, ms);
    const onAbort = () => {
      cleanup();
      reject(new MachineGoodsAbortedError());
    };
    const cleanup = () => {
      clearTimeout(t);
      externalSignal?.removeEventListener("abort", onAbort);
    };
    externalSignal?.addEventListener("abort", onAbort);
  });
}

export async function fetchMachineGoods(
  baseUrl: string,
  serialNumber: string,
  opts: FetchMachineGoodsOptions = {},
): Promise<any> {
  const {
    signal: externalSignal,
    onAttempt,
    maxBackoffMs = 5000,
    perAttemptTimeoutMs = 35000,
  } = opts;

  const url = `${baseUrl}/api/vending/external/machine-goods/?machineUuid=${encodeURIComponent(serialNumber)}`;
  const backoffSchedule = [1000, 2000, 4000];
  let attempt = 0;

  while (true) {
    if (isExternalAbort(externalSignal)) {
      throw new MachineGoodsAbortedError();
    }

    attempt += 1;
    onAttempt?.(attempt);

    const attemptCtrl = new AbortController();
    const timeoutId = setTimeout(() => attemptCtrl.abort(), perAttemptTimeoutMs);
    const onExternalAbort = () => attemptCtrl.abort();
    externalSignal?.addEventListener("abort", onExternalAbort);

    try {
      const response = await fetch(url, { signal: attemptCtrl.signal });

      if (!response.ok) {
        // 504/5xx/network-shaped errors → retryable. 4xx other than 408/429 → still retry,
        // since the caller wants to keep trying "until it gets data".
        throw new Error(`upstream_status_${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      // External abort wins → bubble up immediately.
      if (isExternalAbort(externalSignal)) {
        throw new MachineGoodsAbortedError();
      }
      // Otherwise: per-attempt timeout, network blip, JSON parse error, or non-2xx
      // — all retryable. Compute backoff and loop.
      const idx = Math.min(attempt - 1, backoffSchedule.length - 1);
      const backoff = Math.min(backoffSchedule[idx] ?? maxBackoffMs, maxBackoffMs);
      console.warn(
        `[machineGoods] attempt ${attempt} failed (${err?.name || "Error"}: ${err?.message || err}); retrying in ${backoff}ms`,
      );
      try {
        await delay(backoff, externalSignal);
      } catch {
        throw new MachineGoodsAbortedError();
      }
    } finally {
      clearTimeout(timeoutId);
      externalSignal?.removeEventListener("abort", onExternalAbort);
    }
  }
}
