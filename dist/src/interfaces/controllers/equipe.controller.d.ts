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
export declare class EquipeController {
    listar(req: RequestWithUser, res: Response): Promise<Response>;
    detalhar(req: RequestWithUser, res: Response): Promise<Response>;
    criar(req: RequestWithUser, res: Response): Promise<Response>;
    atualizar(req: RequestWithUser, res: Response): Promise<Response>;
    adicionarMembro(req: RequestWithUser, res: Response): Promise<Response>;
    removerMembro(req: RequestWithUser, res: Response): Promise<Response>;
    adicionarEstudante(req: RequestWithUser, res: Response): Promise<Response>;
    removerEstudante(req: RequestWithUser, res: Response): Promise<Response>;
    listarEstudantes(req: RequestWithUser, res: Response): Promise<Response>;
    excluir(req: RequestWithUser, res: Response): Promise<Response>;
}
export {};
