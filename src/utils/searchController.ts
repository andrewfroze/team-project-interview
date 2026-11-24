import type { ProductCards } from "../models/product";

type SearchFunction = (
  query: string,
  skip: number,
  limit: number,
  signal: AbortSignal,
) => Promise<ProductCards>;

interface SearchControllerOptions {
  search: SearchFunction;
  onLoading: () => void;
  onSuccess: (data: ProductCards) => void;
  onError: (error: unknown) => void;
}

export function createSearchController({
  search,
  onLoading,
  onSuccess,
  onError,
}: SearchControllerOptions) {
  let requestId = 0;
  let abortController: AbortController | null = null;

  async function run(
    query: string,
    skip: number,
    limit: number,
  ): Promise<void> {
    const currentRequestId = ++requestId;

    abortController?.abort();

    const controller = new AbortController();
    abortController = controller;

    onLoading();

    try {
      const data = await search(query, skip, limit, controller.signal);

      if (currentRequestId !== requestId) return;

      onSuccess(data);
    } catch (error) {
      if (currentRequestId !== requestId) return;

      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      onError(error);
    } finally {
      if (currentRequestId === requestId) {
        abortController = null;
      }
    }
  }

  function cancel(): void {
    requestId += 1;
    abortController?.abort();
    abortController = null;
  }

  return { run, cancel };
}
