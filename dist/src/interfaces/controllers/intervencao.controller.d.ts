import { Request, Response } from 'express';
import { CargoUsuario } from '../../shared/enums';
interface RequestWithUser extends Request {
    user: {
        id: string;
        nome?: string;
        email: string;
        cargo: CargoUsuario;
    };
}
export declare class IntervencaoController {
    listar(req: RequestWithUser, res: Response): Promise<Response>;
    detalhar(req: RequestWithUser, res: Response): Promise<Response>;
    criar(req: RequestWithUser, res: Response): Promise<Response>;
    atualizar(req: RequestWithUser, res: Response): Promise<Response>;
    registrarProgresso(req: RequestWithUser, res: Response): Promise<Response>;
    avaliarEficacia(req: RequestWithUser, res: Response): Promise<Response>;
    excluir(req: RequestWithUser, res: Response): Promise<Response>;
}
export {};
