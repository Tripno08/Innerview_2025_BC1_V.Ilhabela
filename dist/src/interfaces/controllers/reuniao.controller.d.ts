import { Request, Response } from 'express';
export declare class ReuniaoController {
    listar(req: Request, res: Response): Promise<Response>;
    detalhar(req: Request, res: Response): Promise<Response>;
    criar(req: Request, res: Response): Promise<Response>;
    atualizar(req: Request, res: Response): Promise<Response>;
    adicionarParticipante(req: Request, res: Response): Promise<Response>;
    removerParticipante(req: Request, res: Response): Promise<Response>;
    registrarPresenca(req: Request, res: Response): Promise<Response>;
    adicionarEncaminhamento(req: Request, res: Response): Promise<Response>;
    atualizarEncaminhamento(req: Request, res: Response): Promise<Response>;
    excluir(req: Request, res: Response): Promise<Response>;
}
