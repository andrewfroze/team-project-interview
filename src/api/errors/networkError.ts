export class NetworkError extends Error {
  constructor(url: string, originalError: unknown) {
    const reason =
      originalError instanceof Error
        ? originalError.message
        : String(originalError);

    super(`Network request to ${url} failed: ${reason}`);
    this.name = "NetworkError";
  }
}
