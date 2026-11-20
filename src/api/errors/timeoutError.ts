import { ApiError } from "./apiError";

export class TimeoutError extends ApiError {
  constructor(url: string, timeout: number) {
    super(`Request to ${url} timed out after ${timeout} ms`, url);
    this.name = "TimeoutError";
  }
}
