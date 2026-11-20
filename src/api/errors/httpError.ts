import { ApiError } from "./apiError";

export class HttpError extends ApiError {
  public status: number;

  constructor(status: number, message: string, url: string) {
    super(message, url);
    this.name = "HttpError";
    this.status = status;
  }
}
