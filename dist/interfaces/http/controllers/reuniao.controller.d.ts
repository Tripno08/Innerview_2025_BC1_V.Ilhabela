import { Request, Response } from 'express';
export declare class ReuniaoController {
    listar(request: Request, response: Response): Promise<Response>;
    listarPorEquipe(request: Request, response: Response): Promise<Response>;
    listarPorPeriodo(request: Request, response: Response): Promise<Response>;
    listarPorStatus(request: Request, response: Response): Promise<Response>;
    obterDetalhes(request: Request, response: Response): Promise<Response>;
    criar(request: Request, response: Response): Promise<Response>;
}
