import { Request, Response, NextFunction } from 'express';
import { CargoUsuario } from '@prisma/client';
export declare function rbacMiddleware(cargosPermitidos: CargoUsuario[]): (req: Request, res: Response, next: NextFunction) => Promise<void>;
