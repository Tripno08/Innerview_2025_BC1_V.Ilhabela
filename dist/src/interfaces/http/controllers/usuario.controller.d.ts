import { Request, Response } from 'express';
export declare class UsuarioController {
    private usuarioRepository;
    constructor();
    findAll(_req: Request, res: Response): Promise<Response>;
    findById(req: Request, res: Response): Promise<Response>;
    create(req: Request, res: Response): Promise<Response>;
    update(req: Request, res: Response): Promise<Response>;
    delete(req: Request, res: Response): Promise<Response>;
    login(req: Request, res: Response): Promise<Response>;
    refreshToken(req: Request, res: Response): Promise<Response>;
}
