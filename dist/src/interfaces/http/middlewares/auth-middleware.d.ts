import { Request, Response, NextFunction } from 'express';
import { CargoUsuario } from '@shared/enums';
export interface AuthenticatedRequest extends Request {
    user: {
        id: string;
        email: string;
        cargo: CargoUsuario;
    };
}
export declare function ensureAuthenticated(req: Request, res: Response, next: NextFunction): void;
