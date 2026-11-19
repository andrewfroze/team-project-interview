export class ApiError extends Error {
  public url: string;
  public originalError: unknown;

  constructor(message: string, url: string, originalError?: unknown) {
    super(message);
    this.name = "ApiError";
    this.url = url;
    this.originalError = originalError;
  }
}
