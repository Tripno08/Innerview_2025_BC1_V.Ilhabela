import { IEstudanteRepository } from '@domain/repositories/estudante-repository.interface';
import { IIntervencaoRepository } from '@domain/repositories/intervencao-repository.interface';
import { Intervencao } from '@domain/entities/intervencao.entity';
import { Avaliacao } from '@domain/entities/estudante.entity';
import { AppError } from '@shared/errors/app-error';

interface AcompanharProgressoDTO {
  estudanteId: string;
}

interface AcompanharProgressoResultado {
  intervencoes: Intervencao[];
  avaliacoes: Avaliacao[];
  progressoGeral: number;
  statusIntervencoes: {
    ativas: number;
    concluidas: number;
    canceladas: number;
  };
  mediaAvaliacoes: number;
  tendencia: 'MELHORA' | 'ESTAVEL' | 'PIORA';
}

/**
 * Caso de uso para acompanhar o progresso de um estudante
 */
export class AcompanharProgressoUseCase {
  constructor(
    private readonly estudanteRepository: IEstudanteRepository,
    private readonly intervencaoRepository: IIntervencaoRepository,
  ) {}

  /**
   * Executa o caso de uso
   */
  async execute(data: AcompanharProgressoDTO): Promise<AcompanharProgressoResultado> {
    // Verificar se o estudante existe
    const estudante = await this.estudanteRepository.findById(data.estudanteId);

    if (!estudante) {
      throw new AppError('Estudante não encontrado', 404, 'STUDENT_NOT_FOUND');
    }

    // Obter todas as intervenções do estudante
    const intervencoes = await this.intervencaoRepository.findByEstudanteId(data.estudanteId);

    if (intervencoes.length === 0) {
      throw new AppError(
        'Estudante não possui intervenções cadastradas para acompanhamento',
        400,
        'NO_INTERVENTIONS_FOUND',
      );
    }

    // Contagem de status de intervenções
    const statusIntervencoes = {
      ativas: intervencoes.filter((i) => i.estaEmAndamento()).length,
      concluidas: intervencoes.filter((i) => i.estaConcluida()).length,
      canceladas: intervencoes.filter((i) => !i.estaAtiva()).length,
    };

    // Calcular progresso geral (média dos progressos de intervenções ativas e concluídas)
    const intervencoesRelevantes = intervencoes.filter(
      (i) => i.estaEmAndamento() || i.estaConcluida(),
    );

    const progressoGeral =
      intervencoesRelevantes.length > 0
        ? intervencoesRelevantes.reduce((acc, i) => acc + i.progresso, 0) /
          intervencoesRelevantes.length
        : 0;

    // Obter avaliações em ordem cronológica
    const avaliacoes = [...estudante.avaliacoes].sort(
      (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime(),
    );

    // Calcular a média das avaliações
    const mediaAvaliacoes = estudante.calcularMediaAvaliacoes();

    // Analisar tendência comparando as últimas avaliações (se houver pelo menos 2)
    let tendencia: 'MELHORA' | 'ESTAVEL' | 'PIORA' = 'ESTAVEL';

    if (avaliacoes.length >= 2) {
      // Dividir as avaliações em dois grupos para comparar
      const metade = Math.floor(avaliacoes.length / 2);
      const primeiraMetade = avaliacoes.slice(0, metade);
      const segundaMetade = avaliacoes.slice(metade);

      // Calcular a média de cada metade
      const mediaPrimeira =
        primeiraMetade.reduce((acc, av) => acc + av.pontuacao, 0) / primeiraMetade.length;
      const mediaSegunda =
        segundaMetade.reduce((acc, av) => acc + av.pontuacao, 0) / segundaMetade.length;

      // Definir tendência com base na diferença entre as médias
      const diferenca = mediaSegunda - mediaPrimeira;
      if (diferenca > 0.5) {
        tendencia = 'MELHORA';
      } else if (diferenca < -0.5) {
        tendencia = 'PIORA';
      }
    }

    return {
      intervencoes,
      avaliacoes,
      progressoGeral,
      statusIntervencoes,
      mediaAvaliacoes,
      tendencia,
    };
  }
}
