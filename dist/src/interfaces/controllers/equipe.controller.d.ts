import { Request, Response } from 'express';
export declare class EquipeController {
    listar(req: Request, res: Response): Promise<Response>;
    detalhar(req: Request, res: Response): Promise<Response>;
    criar(req: Request, res: Response): Promise<Response>;
    atualizar(req: Request, res: Response): Promise<Response>;
    adicionarMembro(req: Request, res: Response): Promise<Response>;
    removerMembro(req: Request, res: Response): Promise<Response>;
    adicionarEstudante(req: Request, res: Response): Promise<Response>;
    removerEstudante(req: Request, res: Response): Promise<Response>;
    listarEstudantes(req: Request, res: Response): Promise<Response>;
    excluir(req: Request, res: Response): Promise<Response>;
}
