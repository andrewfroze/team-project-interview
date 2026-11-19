import { HttpError } from "./errors/httpError";
import { TimeoutError } from "./errors/timeoutError";

export async function request<T>(url: string, timeout: number): Promise<T> {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new HttpError(
        response.status,
        `Http error: ${response.statusText}`,
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new TimeoutError(timeout);
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
