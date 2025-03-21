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
export declare class DashboardController {
    obterIndicadores(req: RequestWithUser, res: Response): Promise<Response>;
    obterEstatisticasEstudantes(req: RequestWithUser, res: Response): Promise<Response>;
    obterEstatisticasDificuldades(req: RequestWithUser, res: Response): Promise<Response>;
    obterEstatisticasIntervencoes(req: RequestWithUser, res: Response): Promise<Response>;
    obterEstatisticasReunioes(req: RequestWithUser, res: Response): Promise<Response>;
    obterEstatisticasProgresso(req: RequestWithUser, res: Response): Promise<Response>;
    obterEstatisticasDesempenho(req: RequestWithUser, res: Response): Promise<Response>;
    obterTendenciasAprendizagem(req: RequestWithUser, res: Response): Promise<Response>;
    gerarRelatorioEstudante(req: RequestWithUser, res: Response): Promise<Response>;
    gerarRelatorioIntervencoes(req: RequestWithUser, res: Response): Promise<Response>;
    gerarRelatorioEquipe(req: RequestWithUser, res: Response): Promise<Response>;
}
export {};
