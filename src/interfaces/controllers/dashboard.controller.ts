import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { IUseCase } from '@application/interfaces/IUseCase';

/**
 * Controller para as rotas de dashboard e relatórios
 */
export class DashboardController {
  /**
   * Obter indicadores básicos
   */
  async obterIndicadores(req: Request, res: Response): Promise<Response> {
    const { instituicaoId, periodo } = req.query;

    const obterIndicadoresUseCase =
      container.resolve<IUseCase<any, any>>('ObterIndicadoresUseCase');

    const indicadores = await obterIndicadoresUseCase.execute({
      instituicaoId: instituicaoId as string,
      periodo: periodo as string,
      usuarioId: req.user.id,
    });

    return res.json(indicadores);
  }

  /**
   * Obter estatísticas de estudantes
   */
  async obterEstatisticasEstudantes(req: Request, res: Response): Promise<Response> {
    const { instituicaoId, equipeId, periodo, agrupador } = req.query;

    const obterEstatisticasEstudantesUseCase = container.resolve<IUseCase<any, any>>(
      'ObterEstatisticasEstudantesUseCase',
    );

    const estatisticas = await obterEstatisticasEstudantesUseCase.execute({
      instituicaoId: instituicaoId as string,
      equipeId: equipeId as string,
      periodo: periodo as string,
      agrupador: agrupador as string,
      usuarioId: req.user.id,
    });

    return res.json(estatisticas);
  }

  /**
   * Obter estatísticas de dificuldades
   */
  async obterEstatisticasDificuldades(req: Request, res: Response): Promise<Response> {
    const { instituicaoId, equipeId, periodo, agrupador } = req.query;

    const obterEstatisticasDificuldadesUseCase = container.resolve<IUseCase<any, any>>(
      'ObterEstatisticasDificuldadesUseCase',
    );

    const estatisticas = await obterEstatisticasDificuldadesUseCase.execute({
      instituicaoId: instituicaoId as string,
      equipeId: equipeId as string,
      periodo: periodo as string,
      agrupador: agrupador as string,
      usuarioId: req.user.id,
    });

    return res.json(estatisticas);
  }

  /**
   * Obter estatísticas de intervenções
   */
  async obterEstatisticasIntervencoes(req: Request, res: Response): Promise<Response> {
    const { instituicaoId, equipeId, periodo, agrupador } = req.query;

    const obterEstatisticasIntervencoesUseCase = container.resolve<IUseCase<any, any>>(
      'ObterEstatisticasIntervencoesUseCase',
    );

    const estatisticas = await obterEstatisticasIntervencoesUseCase.execute({
      instituicaoId: instituicaoId as string,
      equipeId: equipeId as string,
      periodo: periodo as string,
      agrupador: agrupador as string,
      usuarioId: req.user.id,
    });

    return res.json(estatisticas);
  }

  /**
   * Obter estatísticas de reuniões
   */
  async obterEstatisticasReunioes(req: Request, res: Response): Promise<Response> {
    const { instituicaoId, equipeId, periodo, agrupador } = req.query;

    const obterEstatisticasReunioesUseCase = container.resolve<IUseCase<any, any>>(
      'ObterEstatisticasReunioesUseCase',
    );

    const estatisticas = await obterEstatisticasReunioesUseCase.execute({
      instituicaoId: instituicaoId as string,
      equipeId: equipeId as string,
      periodo: periodo as string,
      agrupador: agrupador as string,
      usuarioId: req.user.id,
    });

    return res.json(estatisticas);
  }

  /**
   * Obter estatísticas de progresso
   */
  async obterEstatisticasProgresso(req: Request, res: Response): Promise<Response> {
    const { instituicaoId, equipeId, periodo, agrupador } = req.query;

    const obterEstatisticasProgressoUseCase = container.resolve<IUseCase<any, any>>(
      'ObterEstatisticasProgressoUseCase',
    );

    const estatisticas = await obterEstatisticasProgressoUseCase.execute({
      instituicaoId: instituicaoId as string,
      equipeId: equipeId as string,
      periodo: periodo as string,
      agrupador: agrupador as string,
      usuarioId: req.user.id,
    });

    return res.json(estatisticas);
  }

  /**
   * Obter estatísticas de desempenho
   */
  async obterEstatisticasDesempenho(req: Request, res: Response): Promise<Response> {
    const { instituicaoId, equipeId, periodo, estudanteId } = req.query;

    const obterEstatisticasDesempenhoUseCase = container.resolve<IUseCase<any, any>>(
      'ObterEstatisticasDesempenhoUseCase',
    );

    const estatisticas = await obterEstatisticasDesempenhoUseCase.execute({
      instituicaoId: instituicaoId as string,
      equipeId: equipeId as string,
      periodo: periodo as string,
      estudanteId: estudanteId as string,
      usuarioId: req.user.id,
    });

    return res.json(estatisticas);
  }

  /**
   * Obter tendências de aprendizagem
   */
  async obterTendenciasAprendizagem(req: Request, res: Response): Promise<Response> {
    const { instituicaoId, equipeId, periodo } = req.query;

    const obterTendenciasAprendizagemUseCase = container.resolve<IUseCase<any, any>>(
      'ObterTendenciasAprendizagemUseCase',
    );

    const tendencias = await obterTendenciasAprendizagemUseCase.execute({
      instituicaoId: instituicaoId as string,
      equipeId: equipeId as string,
      periodo: periodo as string,
      usuarioId: req.user.id,
    });

    return res.json(tendencias);
  }

  /**
   * Gerar relatório de estudante
   */
  async gerarRelatorioEstudante(req: Request, res: Response): Promise<Response> {
    const { estudanteId } = req.params;
    const { formato, periodo } = req.query;

    const gerarRelatorioEstudanteUseCase = container.resolve<IUseCase<any, any>>(
      'GerarRelatorioEstudanteUseCase',
    );

    const relatorio = await gerarRelatorioEstudanteUseCase.execute({
      estudanteId,
      formato: formato as string,
      periodo: periodo as string,
      usuarioId: req.user.id,
    });

    // Se o formato for PDF/Excel, retornar o Buffer ou URL
    if (formato === 'pdf' || formato === 'excel') {
      res.setHeader(
        'Content-Type',
        formato === 'pdf' ? 'application/pdf' : 'application/vnd.ms-excel',
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=relatorio-estudante-${estudanteId}.${formato}`,
      );
      return res.send(relatorio);
    }

    // Caso contrário, retornar JSON
    return res.json(relatorio);
  }

  /**
   * Gerar relatório de intervenções
   */
  async gerarRelatorioIntervencoes(req: Request, res: Response): Promise<Response> {
    const { instituicaoId, equipeId, periodo, formato, tipoIntervencao } = req.query;

    const gerarRelatorioIntervencoesUseCase = container.resolve<IUseCase<any, any>>(
      'GerarRelatorioIntervencoesUseCase',
    );

    const relatorio = await gerarRelatorioIntervencoesUseCase.execute({
      instituicaoId: instituicaoId as string,
      equipeId: equipeId as string,
      periodo: periodo as string,
      formato: formato as string,
      tipoIntervencao: tipoIntervencao as string,
      usuarioId: req.user.id,
    });

    // Se o formato for PDF/Excel, retornar o Buffer ou URL
    if (formato === 'pdf' || formato === 'excel') {
      res.setHeader(
        'Content-Type',
        formato === 'pdf' ? 'application/pdf' : 'application/vnd.ms-excel',
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=relatorio-intervencoes-${periodo}.${formato}`,
      );
      return res.send(relatorio);
    }

    // Caso contrário, retornar JSON
    return res.json(relatorio);
  }

  /**
   * Gerar relatório de equipe
   */
  async gerarRelatorioEquipe(req: Request, res: Response): Promise<Response> {
    const { equipeId } = req.params;
    const { formato, periodo } = req.query;

    const gerarRelatorioEquipeUseCase = container.resolve<IUseCase<any, any>>(
      'GerarRelatorioEquipeUseCase',
    );

    const relatorio = await gerarRelatorioEquipeUseCase.execute({
      equipeId,
      formato: formato as string,
      periodo: periodo as string,
      usuarioId: req.user.id,
    });

    // Se o formato for PDF/Excel, retornar o Buffer ou URL
    if (formato === 'pdf' || formato === 'excel') {
      res.setHeader(
        'Content-Type',
        formato === 'pdf' ? 'application/pdf' : 'application/vnd.ms-excel',
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=relatorio-equipe-${equipeId}.${formato}`,
      );
      return res.send(relatorio);
    }

    // Caso contrário, retornar JSON
    return res.json(relatorio);
  }
}
