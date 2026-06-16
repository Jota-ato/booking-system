export class AppError extends Error {
    constructor(
        message: string,
        public readonly code?: string
    ) {
        super(message);
        this.name = "AppError";
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AppError);
        }
    }
}