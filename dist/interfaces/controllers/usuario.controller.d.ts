import { Request, Response } from 'express';
export declare class UsuarioController {
    registrar(req: Request, res: Response): Promise<Response>;
    autenticar(req: Request, res: Response): Promise<Response>;
    obterPerfil(req: Request, res: Response): Promise<Response>;
    atualizarPerfil(req: Request, res: Response): Promise<Response>;
    associarAInstituicao(req: Request, res: Response): Promise<Response>;
}
