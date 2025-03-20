import { Request, Response } from 'express';
export declare class DashboardController {
    obterIndicadores(req: Request, res: Response): Promise<Response>;
    obterEstatisticasEstudantes(req: Request, res: Response): Promise<Response>;
    obterEstatisticasDificuldades(req: Request, res: Response): Promise<Response>;
    obterEstatisticasIntervencoes(req: Request, res: Response): Promise<Response>;
    obterEstatisticasReunioes(req: Request, res: Response): Promise<Response>;
    obterEstatisticasProgresso(req: Request, res: Response): Promise<Response>;
    obterEstatisticasDesempenho(req: Request, res: Response): Promise<Response>;
    obterTendenciasAprendizagem(req: Request, res: Response): Promise<Response>;
    gerarRelatorioEstudante(req: Request, res: Response): Promise<Response>;
    gerarRelatorioIntervencoes(req: Request, res: Response): Promise<Response>;
    gerarRelatorioEquipe(req: Request, res: Response): Promise<Response>;
}
