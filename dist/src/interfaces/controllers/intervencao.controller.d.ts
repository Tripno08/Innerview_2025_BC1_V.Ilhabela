import { Request, Response } from 'express';
export declare class IntervencaoController {
    listar(req: Request, res: Response): Promise<Response>;
    detalhar(req: Request, res: Response): Promise<Response>;
    criar(req: Request, res: Response): Promise<Response>;
    atualizar(req: Request, res: Response): Promise<Response>;
    registrarProgresso(req: Request, res: Response): Promise<Response>;
    avaliarEficacia(req: Request, res: Response): Promise<Response>;
    excluir(req: Request, res: Response): Promise<Response>;
}
