import { Request, Response, NextFunction } from 'express';

export const mockAuthMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  req.user = {
    id: 'mock-user-id',
    email: 'usuario@teste.com',
    nome: 'Usuário Teste',
    papel: 'PROFESSOR',
  };
  next();
};

export const mockRbacMiddleware = (_cargosPermitidos: string[]) => {
  return (_req: Request, _res: Response, next: NextFunction) => {
    next();
  };
};
