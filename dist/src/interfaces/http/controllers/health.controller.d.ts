import { Request, Response } from 'express';
export declare class HealthController {
    check(_req: Request, res: Response): Promise<Response>;
    details(_req: Request, res: Response): Promise<Response>;
}
