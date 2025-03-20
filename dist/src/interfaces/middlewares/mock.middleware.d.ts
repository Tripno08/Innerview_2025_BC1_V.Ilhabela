import { Request, Response, NextFunction } from 'express';
export declare const mockAuthMiddleware: (req: Request, _res: Response, next: NextFunction) => void;
export declare const mockRbacMiddleware: (_cargosPermitidos: string[]) => (_req: Request, _res: Response, next: NextFunction) => void;
