import { Request, Response } from 'express';
import '../../shared/types/express';
export declare class DificuldadeController {
    listar(req: Request, res: Response): Promise<Response>;
    detalhar(req: Request, res: Response): Promise<Response>;
    criar(req: Request, res: Response): Promise<Response>;
    atualizar(req: Request, res: Response): Promise<Response>;
    associarAEstudante(req: Request, res: Response): Promise<Response>;
    removerDeEstudante(req: Request, res: Response): Promise<Response>;
    listarIntervencoesRecomendadas(req: Request, res: Response): Promise<Response>;
    excluir(req: Request, res: Response): Promise<Response>;
}
