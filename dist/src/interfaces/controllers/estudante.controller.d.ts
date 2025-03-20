import { Request, Response } from 'express';
export declare class EstudanteController {
    cadastrar(req: Request, res: Response): Promise<Response>;
    associarDificuldade(req: Request, res: Response): Promise<Response>;
    registrarAvaliacao(req: Request, res: Response): Promise<Response>;
    recomendarIntervencoes(req: Request, res: Response): Promise<Response>;
    acompanharProgresso(req: Request, res: Response): Promise<Response>;
    listarEstudantesProfessor(req: Request, res: Response): Promise<Response>;
    listarPorUsuario(req: Request, res: Response): Promise<Response>;
}
