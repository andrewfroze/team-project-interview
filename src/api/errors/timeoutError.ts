export class TimeoutError extends Error {
  constructor(url: string, timeout: number) {
    super(`Request to ${url} timed out after ${timeout} ms`);
    this.name = "TimeoutError";
  }
}
