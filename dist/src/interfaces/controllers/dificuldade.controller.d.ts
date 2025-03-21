import { Request, Response } from 'express';
import { CargoUsuario } from '../../shared/enums';
interface RequestWithUser extends Request {
    user: {
        id: string;
        email: string;
        cargo: CargoUsuario;
        nome?: string;
    };
}
export declare class DificuldadeController {
    listar(req: RequestWithUser, res: Response): Promise<Response>;
    detalhar(req: RequestWithUser, res: Response): Promise<Response>;
    criar(req: RequestWithUser, res: Response): Promise<Response>;
    atualizar(req: RequestWithUser, res: Response): Promise<Response>;
    associarAEstudante(req: RequestWithUser, res: Response): Promise<Response>;
    removerDeEstudante(req: RequestWithUser, res: Response): Promise<Response>;
    listarIntervencoesRecomendadas(req: RequestWithUser, res: Response): Promise<Response>;
    excluir(req: RequestWithUser, res: Response): Promise<Response>;
}
export {};
