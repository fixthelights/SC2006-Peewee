interface AppErrorArgs {
  type?: string;
  statusCode: number;
  description: string;
  error?: Error;
}

export class AppError extends Error {
  public readonly type: string;
  public readonly statusCode: number;
  public readonly error: Error

  constructor(args: AppErrorArgs) {
    super(args.description);

    Object.setPrototypeOf(this, new.target.prototype);

    this.type = args.type || 'Error';
    this.statusCode = args.statusCode;
    this.error = args.error || new Error(args.description);

    Error.captureStackTrace(this);
  }
}