import { Request, Response, NextFunction } from 'express';
export declare function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction): Response<any, Record<string, any>>;
