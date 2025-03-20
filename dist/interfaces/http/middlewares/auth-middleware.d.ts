import { Request, Response, NextFunction } from 'express';
export declare function authMiddleware(req: Request, _res: Response, next: NextFunction): void;
declare global {
    namespace Express {
        interface Request {
            user: any;
        }
    }
}
