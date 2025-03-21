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
export declare class EstudanteController {
    cadastrar(req: RequestWithUser, res: Response): Promise<Response>;
    associarDificuldade(req: RequestWithUser, res: Response): Promise<Response>;
    registrarAvaliacao(req: RequestWithUser, res: Response): Promise<Response>;
    recomendarIntervencoes(req: RequestWithUser, res: Response): Promise<Response>;
    acompanharProgresso(req: RequestWithUser, res: Response): Promise<Response>;
    listarEstudantesProfessor(req: RequestWithUser, res: Response): Promise<Response>;
    listarPorUsuario(req: RequestWithUser, res: Response): Promise<Response>;
}
export {};
