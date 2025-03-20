import { IEstudanteRepository } from '@domain/repositories/estudante-repository.interface';
import { IDificuldadeRepository } from '@domain/repositories/dificuldade-repository.interface';
import { IIntervencaoRepository } from '@domain/repositories/intervencao-repository.interface';
import { CatalogoIntervencao } from '@domain/entities/intervencao.entity';
import { AppError } from '@shared/errors/app-error';

interface RecomendarIntervencoesDTO {
  estudanteId: string;
}

interface RecomendarIntervencoesResultado {
  intervencoes: CatalogoIntervencao[];
}

/**
 * Caso de uso para recomendar intervenções com base no perfil de um estudante
 */
export class RecomendarIntervencoesUseCase {
  constructor(
    private readonly estudanteRepository: IEstudanteRepository,
    private readonly dificuldadeRepository: IDificuldadeRepository,
    private readonly intervencaoRepository: IIntervencaoRepository,
  ) {}

  /**
   * Executa o caso de uso
   */
  async execute(data: RecomendarIntervencoesDTO): Promise<RecomendarIntervencoesResultado> {
    // Verificar se o estudante existe
    const estudante = await this.estudanteRepository.findById(data.estudanteId);

    if (!estudante) {
      throw new AppError('Estudante não encontrado', 404, 'STUDENT_NOT_FOUND');
    }

    // Obter as dificuldades do estudante
    const dificuldades = await this.dificuldadeRepository.findByEstudanteId(data.estudanteId);

    if (dificuldades.length === 0) {
      throw new AppError(
        'Estudante não possui dificuldades cadastradas para recomendação',
        400,
        'NO_DIFFICULTIES_FOUND',
      );
    }

    // Obter intervenções já aplicadas ao estudante
    const intervencoesAplicadas = await this.intervencaoRepository.findByEstudanteId(
      data.estudanteId,
    );
    const idsIntervencoesAplicadas = intervencoesAplicadas
      .map((i) => i.intervencaoBaseId)
      .filter(Boolean);

    // Conjunto para armazenar as recomendações sem duplicação
    const recomendacoesSet = new Set<CatalogoIntervencao>();

    // Para cada dificuldade, buscar intervenções recomendadas
    for (const dificuldade of dificuldades) {
      const intervencoesPorDificuldade = await this.intervencaoRepository.findCatalogoByDificuldade(
        dificuldade.id,
      );

      // Adicionar intervenções que ainda não foram aplicadas
      for (const intervencao of intervencoesPorDificuldade) {
        if (!idsIntervencoesAplicadas.includes(intervencao.id) && intervencao.estaAtiva()) {
          recomendacoesSet.add(intervencao);
        }
      }
    }

    // Se não encontrou nenhuma recomendação específica, buscar por tipo de dificuldade
    if (recomendacoesSet.size === 0) {
      const tiposDificuldade = [...new Set(dificuldades.map((d) => d.tipo))];

      // Buscar todas as intervenções ativas do catálogo
      const todasIntervencoes = await this.intervencaoRepository.findAllCatalogo();

      // Filtrando intervenções por tipo e que não foram aplicadas
      for (const intervencao of todasIntervencoes) {
        if (
          !idsIntervencoesAplicadas.includes(intervencao.id) &&
          intervencao.estaAtiva() &&
          this.intervencaoAtendeTiposDificuldade(intervencao, tiposDificuldade)
        ) {
          recomendacoesSet.add(intervencao);
        }
      }
    }

    // Converter Set para array
    const recomendacoes = Array.from(recomendacoesSet);

    // Priorizar por relevância (neste caso, ordenando por dificuldades graves primeiro)
    const temDificuldadeGrave = estudante.possuiDificuldadeGrave();
    if (temDificuldadeGrave) {
      recomendacoes.sort((a, b) => {
        // Priorizar intervenções multidisciplinares para dificuldades graves
        if (a.tipo === 'MULTIDISCIPLINAR' && b.tipo !== 'MULTIDISCIPLINAR') return -1;
        if (a.tipo !== 'MULTIDISCIPLINAR' && b.tipo === 'MULTIDISCIPLINAR') return 1;
        return 0;
      });
    }

    return { intervencoes: recomendacoes };
  }

  /**
   * Verifica se uma intervenção atende aos tipos de dificuldade do estudante
   */
  private intervencaoAtendeTiposDificuldade(
    intervencao: CatalogoIntervencao,
    tiposDificuldade: string[],
  ): boolean {
    // Se a intervenção não tem dificuldades alvo especificadas, considerar como genérica
    if (!intervencao.dificuldadesAlvo || intervencao.dificuldadesAlvo.length === 0) {
      return true;
    }

    // Verificar se há pelo menos um tipo de dificuldade em comum
    return tiposDificuldade.some((tipo) => intervencao.dificuldadesAlvo.includes(tipo));
  }
}
