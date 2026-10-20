export function readFileSlice(file: { url: string; headers: Record<string, string>; size: number }, start: number, end: number,
  signal: AbortSignal, progress: (percent: number) => void, fetcher?: typeof fetch): Promise<Blob>;
