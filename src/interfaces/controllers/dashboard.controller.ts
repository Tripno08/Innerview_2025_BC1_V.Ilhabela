import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { IUseCase } from '../../application/interfaces/IUseCase';
import { CargoUsuario } from '../../shared/enums';

// Interface personalizada para Request com usuário
interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
    cargo: CargoUsuario;
    nome?: string;
  };
}

// Interfaces para os DTOs
interface IndicadoresDTO {
  instituicaoId?: string;
  periodo?: string;
  usuarioId: string;
}

interface IndicadoresResultado {
  estudantesTotal: number;
  estudantesAtivos: number;
  dificuldadesTotal: number;
  intervencoesTotal: number;
  intervencoesAtivas: number;
  reunioesTotal: number;
  equipes: number;
  progressoMedio: number;
}

interface EstatisticasBaseDTO {
  instituicaoId?: string;
  equipeId?: string;
  periodo?: string;
  agrupador?: string;
  usuarioId: string;
}

interface EstatisticasEstudantesResultado {
  total: number;
  porStatus: Record<string, number>;
  porGenero: Record<string, number>;
  porFaixaEtaria: Record<string, number>;
  porSerie: Record<string, number>;
  porEquipe?: Record<string, number>;
}

interface EstatisticasDificuldadesResultado {
  total: number;
  porCategoria: Record<string, number>;
  porNivel: Record<string, number>;
  porAno: Record<string, number>;
  tendencias: {
    categorias: string[];
    series: Array<{
      name: string;
      data: number[];
    }>;
  };
}

interface EstatisticasIntervencoesResultado {
  total: number;
  porStatus: Record<string, number>;
  porTipo: Record<string, number>;
  eficacia: {
    media: number;
    porTipo: Record<string, number>;
  };
  tendencias: {
    categorias: string[];
    series: Array<{
      name: string;
      data: number[];
    }>;
  };
}

interface EstatisticasReunioesResultado {
  total: number;
  porStatus: Record<string, number>;
  porTipo: Record<string, number>;
  porEquipe?: Record<string, number>;
  tendencias: {
    categorias: string[];
    series: Array<{
      name: string;
      data: number[];
    }>;
  };
}

interface EstatisticasProgressoResultado {
  progressoMedio: number;
  porDificuldade: Record<string, number>;
  porIntervencao: Record<string, number>;
  tendencias: {
    categorias: string[];
    series: Array<{
      name: string;
      data: number[];
    }>;
  };
}

interface EstatisticasDesempenhoDTO extends EstatisticasBaseDTO {
  estudanteId?: string;
}

interface EstatisticasDesempenhoResultado {
  estudante?: {
    id: string;
    nome: string;
    progresso: number;
  };
  avaliacoes: {
    datas: string[];
    notas: number[];
  };
  dificuldades: Array<{
    categoria: string;
    nivel: string;
    progresso: number;
  }>;
  intervencoes: Array<{
    tipo: string;
    status: string;
    progresso: number;
  }>;
}

interface TendenciasAprendizagemDTO {
  instituicaoId?: string;
  equipeId?: string;
  periodo?: string;
  usuarioId: string;
}

interface TendenciasAprendizagemResultado {
  categoriasDificuldade: Record<string, number>;
  tiposIntervencao: Record<string, number>;
  progressoGeral: {
    datas: string[];
    valores: number[];
  };
  previsoes: {
    categorias: string[];
    valores: number[];
  };
}

interface RelatorioEstudanteDTO {
  estudanteId: string;
  formato?: string;
  periodo?: string;
  usuarioId: string;
}

interface RelatorioIntervencoesDTO {
  instituicaoId?: string;
  equipeId?: string;
  periodo?: string;
  formato?: string;
  tipoIntervencao?: string;
  usuarioId: string;
}

interface RelatorioEquipeDTO {
  equipeId: string;
  formato?: string;
  periodo?: string;
  usuarioId: string;
}

// Buffer ou objeto JSON para resultados de relatórios
type RelatorioResultado = Buffer | Record<string, unknown>;

/**
 * Controller para as rotas de dashboard e relatórios
 */
export class DashboardController {
  /**
   * Obter indicadores básicos
   */
  async obterIndicadores(req: RequestWithUser, res: Response): Promise<Response> {
    const { instituicaoId, periodo } = req.query;

    const obterIndicadoresUseCase =
      container.resolve<IUseCase<IndicadoresDTO, IndicadoresResultado>>('ObterIndicadoresUseCase');

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
  async obterEstatisticasEstudantes(req: RequestWithUser, res: Response): Promise<Response> {
    const { instituicaoId, equipeId, periodo, agrupador } = req.query;

    const obterEstatisticasEstudantesUseCase = container.resolve<
      IUseCase<EstatisticasBaseDTO, EstatisticasEstudantesResultado>
    >('ObterEstatisticasEstudantesUseCase');

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
  async obterEstatisticasDificuldades(req: RequestWithUser, res: Response): Promise<Response> {
    const { instituicaoId, equipeId, periodo, agrupador } = req.query;

    const obterEstatisticasDificuldadesUseCase = container.resolve<
      IUseCase<EstatisticasBaseDTO, EstatisticasDificuldadesResultado>
    >('ObterEstatisticasDificuldadesUseCase');

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
  async obterEstatisticasIntervencoes(req: RequestWithUser, res: Response): Promise<Response> {
    const { instituicaoId, equipeId, periodo, agrupador } = req.query;

    const obterEstatisticasIntervencoesUseCase = container.resolve<
      IUseCase<EstatisticasBaseDTO, EstatisticasIntervencoesResultado>
    >('ObterEstatisticasIntervencoesUseCase');

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
  async obterEstatisticasReunioes(req: RequestWithUser, res: Response): Promise<Response> {
    const { instituicaoId, equipeId, periodo, agrupador } = req.query;

    const obterEstatisticasReunioesUseCase = container.resolve<
      IUseCase<EstatisticasBaseDTO, EstatisticasReunioesResultado>
    >('ObterEstatisticasReunioesUseCase');

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
  async obterEstatisticasProgresso(req: RequestWithUser, res: Response): Promise<Response> {
    const { instituicaoId, equipeId, periodo, agrupador } = req.query;

    const obterEstatisticasProgressoUseCase = container.resolve<
      IUseCase<EstatisticasBaseDTO, EstatisticasProgressoResultado>
    >('ObterEstatisticasProgressoUseCase');

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
  async obterEstatisticasDesempenho(req: RequestWithUser, res: Response): Promise<Response> {
    const { instituicaoId, equipeId, periodo, estudanteId } = req.query;

    const obterEstatisticasDesempenhoUseCase = container.resolve<
      IUseCase<EstatisticasDesempenhoDTO, EstatisticasDesempenhoResultado>
    >('ObterEstatisticasDesempenhoUseCase');

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
  async obterTendenciasAprendizagem(req: RequestWithUser, res: Response): Promise<Response> {
    const { instituicaoId, equipeId, periodo } = req.query;

    const obterTendenciasAprendizagemUseCase = container.resolve<
      IUseCase<TendenciasAprendizagemDTO, TendenciasAprendizagemResultado>
    >('ObterTendenciasAprendizagemUseCase');

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
  async gerarRelatorioEstudante(req: RequestWithUser, res: Response): Promise<Response> {
    const { estudanteId } = req.params;
    const { formato, periodo } = req.query;

    const gerarRelatorioEstudanteUseCase = container.resolve<
      IUseCase<RelatorioEstudanteDTO, RelatorioResultado>
    >('GerarRelatorioEstudanteUseCase');

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
  async gerarRelatorioIntervencoes(req: RequestWithUser, res: Response): Promise<Response> {
    const { instituicaoId, equipeId, periodo, formato, tipoIntervencao } = req.query;

    const gerarRelatorioIntervencoesUseCase = container.resolve<
      IUseCase<RelatorioIntervencoesDTO, RelatorioResultado>
    >('GerarRelatorioIntervencoesUseCase');

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
  async gerarRelatorioEquipe(req: RequestWithUser, res: Response): Promise<Response> {
    const { equipeId } = req.params;
    const { formato, periodo } = req.query;

    const gerarRelatorioEquipeUseCase = container.resolve<
      IUseCase<RelatorioEquipeDTO, RelatorioResultado>
    >('GerarRelatorioEquipeUseCase');

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
