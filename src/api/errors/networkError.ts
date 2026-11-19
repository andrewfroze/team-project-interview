import { ApiError } from "./apiError";

export class NetworkError extends ApiError {
  constructor(url: string, originalError: unknown) {
    const reason =
      originalError instanceof Error
        ? originalError.message
        : String(originalError);

    super(`Network request to ${url} failed: ${reason}`, url, originalError);
    this.name = "NetworkError";
  }
}
