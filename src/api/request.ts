import { ApiError } from "./errors/apiError";
import { HttpError } from "./errors/httpError";
import { NetworkError } from "./errors/networkError";
import { TimeoutError } from "./errors/timeoutError";

export async function request<T>(
  url: string,
  timeout: number,
  validate: (data: unknown) => data is T,
  signal?: AbortSignal,
): Promise<T> {
  const timeoutController = new AbortController();

  const timeoutId = setTimeout(() => {
    timeoutController.abort();
  }, timeout);

  const requestSignal = signal
    ? AbortSignal.any([signal, timeoutController.signal])
    : timeoutController.signal;

  try {
    let response: Response;

    try {
      response = await fetch(url, {
        signal: requestSignal,
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        if (!signal || timeoutController.signal.aborted) {
          throw new TimeoutError(url, timeout);
        }

        throw error;
      }

      if (error instanceof TypeError) {
        throw new NetworkError(url, error);
      }

      throw new ApiError(
        `Request to ${url} failed: ${String(error)}`,
        url,
        error,
      );
    }

    if (!response.ok) {
      throw new HttpError(
        response.status,
        `Http error: ${response.status}`,
        url,
      );
    }

    let data: unknown;

    try {
      data = await response.json();
    } catch (error) {
      throw new ApiError(`Invalid JSON response from ${url}`, url, error);
    }

    if (!validate(data)) {
      throw new ApiError(`Invalid response structure from ${url}`, url);
    }

    return data;
  } finally {
    clearTimeout(timeoutId);
  }
}
