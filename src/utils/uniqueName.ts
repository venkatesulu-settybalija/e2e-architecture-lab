export function uniqueName(prefix: string): string {
  const w = process.env.PLAYWRIGHT_WORKER_INDEX ?? "0";
  return `${prefix}-${w}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
