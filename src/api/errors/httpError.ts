export class HttpError extends Error {
  public readonly status: number;

  constructor(status: number, message: string) {
    super(message);

    this.status = status;
    this.name = "HttpError";

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
