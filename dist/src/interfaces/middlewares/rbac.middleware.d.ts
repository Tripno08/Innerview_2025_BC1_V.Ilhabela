import { Request, Response, NextFunction } from 'express';
import { CargoUsuario } from '../../shared/enums';
export declare function rbacMiddleware(cargosPermitidos: CargoUsuario[]): (req: Request, res: Response, next: NextFunction) => Promise<void>;
