export declare class AppError extends Error {
    readonly statusCode: number;
    constructor(message: string, statusCode?: number);
}
