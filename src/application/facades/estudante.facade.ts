import {
  IEstudanteRepository,
  AvaliacaoEstudante,
} from '@domain/repositories/estudante-repository.interface';
import { IDificuldadeRepository } from '@domain/repositories/dificuldade-repository.interface';
import { IIntervencaoRepository } from '@domain/repositories/intervencao-repository.interface';
import { UnitOfWork } from '@infrastructure/database/unit-of-work';
import { Estudante } from '@domain/entities/estudante.entity';
import {
  DificuldadeAprendizagem,
  TipoDificuldade,
  CategoriaDificuldade,
} from '@domain/entities/dificuldade-aprendizagem.entity';
import { Intervencao, CatalogoIntervencao } from '@domain/entities/intervencao.entity';
import { AppError } from '@shared/errors/app-error';

/**
 * Facade para operações complexas relacionadas a estudantes
 *
 * Esta classe implementa padrão Facade para simplificar operações
 * que envolvem múltiplos repositórios e casos de uso, abstraindo a complexidade
 * e fornecendo uma interface simplificada.
 */
export class EstudanteFacade {
  private unitOfWork: UnitOfWork;

  constructor(
    private readonly estudanteRepository: IEstudanteRepository,
    private readonly dificuldadeRepository: IDificuldadeRepository,
    private readonly intervencaoRepository: IIntervencaoRepository,
  ) {
    this.unitOfWork = new UnitOfWork();
  }

  /**
   * Transferir um estudante de uma turma para outra, atualizando todas as relações necessárias
   */
  async transferirEstudante(
    estudanteId: string,
    novaSerie: string,
    novoResponsavelId: string,
  ): Promise<Estudante> {
    return await this.unitOfWork.withTransaction(async (prisma) => {
      // Validar se o estudante existe
      const estudante = await prisma.estudante.findUnique({
        where: { id: estudanteId },
        include: { usuario: true },
      });

      if (!estudante) {
        throw new AppError('Estudante não encontrado', 404, 'STUDENT_NOT_FOUND');
      }

      // Validar se o novo responsável existe
      const novoResponsavel = await prisma.usuario.findUnique({
        where: { id: novoResponsavelId },
      });

      if (!novoResponsavel) {
        throw new AppError('Novo responsável não encontrado', 404, 'USER_NOT_FOUND');
      }

      // Atualizar o estudante com a nova série e o novo responsável
      const estudanteAtualizado = await prisma.estudante.update({
        where: { id: estudanteId },
        data: {
          serie: novaSerie,
          usuarioId: novoResponsavelId,
        },
        include: {
          dificuldades: {
            include: {
              dificuldade: true,
            },
          },
          avaliacoes: true,
        },
      });

      // Mapear para entidade de domínio
      const dificuldades = estudanteAtualizado.dificuldades.map((d) => {
        // Determinar o tipo baseado na categoria
        const tipo =
          d.dificuldade.categoria === 'LEITURA'
            ? TipoDificuldade.LEITURA
            : d.dificuldade.categoria === 'ESCRITA'
              ? TipoDificuldade.ESCRITA
              : d.dificuldade.categoria === 'MATEMATICA'
                ? TipoDificuldade.MATEMATICA
                : TipoDificuldade.OUTRO;

        // Mapear para o tipo correto de CategoriaDificuldade da entidade
        const categoria = d.dificuldade.categoria as unknown as CategoriaDificuldade;

        return DificuldadeAprendizagem.restaurar({
          ...d.dificuldade,
          tipo,
          categoria,
          sintomas: d.dificuldade.sintomas || '',
        });
      });

      return Estudante.restaurar({
        ...estudanteAtualizado,
        dificuldades,
      });
    });
  }

  /**
   * Criar um perfil completo de estudante com dificuldades, avaliação inicial e intervenção recomendada
   */
  async criarPerfilCompleto(
    dadosEstudante: Partial<Estudante>,
    dificuldadeIds: string[],
    avaliacaoInicial: Partial<AvaliacaoEstudante> & {
      tipo: string;
      data: Date;
      avaliadorId: string;
    },
  ): Promise<{
    estudante: Estudante;
    dificuldades: DificuldadeAprendizagem[];
    intervencoes: CatalogoIntervencao[];
  }> {
    return await this.unitOfWork.withTransaction(async () => {
      // Criar o estudante
      const estudanteEntity = await this.estudanteRepository.create(dadosEstudante);

      const dificuldadesEncontradas: DificuldadeAprendizagem[] = [];

      // Associar as dificuldades
      for (const dificuldadeId of dificuldadeIds) {
        // Verificar se a dificuldade existe
        const dificuldade = await this.dificuldadeRepository.findById(dificuldadeId);
        if (!dificuldade) {
          throw new AppError(
            `Dificuldade ${dificuldadeId} não encontrada`,
            404,
            'DIFFICULTY_NOT_FOUND',
          );
        }

        // Associar ao estudante com tipo "PRIMARIA" para a primeira dificuldade, "SECUNDARIA" para as demais
        const tipoRelacao = dificuldadesEncontradas.length === 0 ? 'PRIMARIA' : 'SECUNDARIA';
        await this.estudanteRepository.adicionarDificuldade(estudanteEntity.id, dificuldadeId, {
          tipo: tipoRelacao,
          observacoes: `Adicionado durante a criação do perfil (${tipoRelacao})`,
        });

        dificuldadesEncontradas.push(dificuldade);
      }

      // Registrar a avaliação inicial
      if (avaliacaoInicial) {
        await this.estudanteRepository.adicionarAvaliacao(estudanteEntity.id, {
          ...avaliacaoInicial,
          data: avaliacaoInicial.data || new Date(),
          avaliadorId: avaliacaoInicial.avaliadorId,
        });
      }

      // Buscar recomendações de intervenções
      const intervencoes = await this.intervencaoRepository.findCatalogoByDificuldade(
        dificuldadeIds[0], // Primeira dificuldade como exemplo
      );

      // Buscar o estudante atualizado com todas as relações
      const estudante = await this.estudanteRepository.findById(estudanteEntity.id);

      return {
        estudante,
        dificuldades: dificuldadesEncontradas,
        intervencoes,
      };
    });
  }

  /**
   * Obter um resumo completo do estudante com todas as informações relacionadas
   */
  async obterPerfilCompleto(estudanteId: string): Promise<{
    estudante: Estudante;
    dificuldades: DificuldadeAprendizagem[];
    intervencoes: Intervencao[];
    historicoAvaliacoes: Record<string, unknown>[];
    progressoMedio: number;
  }> {
    // Buscar o estudante
    const estudante = await this.estudanteRepository.findById(estudanteId);

    if (!estudante) {
      throw new AppError('Estudante não encontrado', 404, 'STUDENT_NOT_FOUND');
    }

    // Buscar dificuldades
    const dificuldades = await this.dificuldadeRepository.findByEstudanteId(estudanteId);

    // Buscar intervenções
    const intervencoes = await this.intervencaoRepository.findByEstudanteId(estudanteId);

    // Calcular progresso médio
    const intervencoesAtivas = intervencoes.filter((i) => i.estaAtiva());
    const progressoMedio =
      intervencoesAtivas.length > 0
        ? intervencoesAtivas.reduce((acc, i) => acc + i.progresso, 0) / intervencoesAtivas.length
        : 0;

    // Organizar as avaliações em ordem cronológica
    const avaliacoesOrdenadas = [...estudante.avaliacoes].sort(
      (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime(),
    );

    // Mapear avaliações com dados adicionais
    const historicoAvaliacoes = avaliacoesOrdenadas.map((av, index, array) => {
      // Calcular diferença da pontuação em relação à anterior
      const pontuacaoAnterior = index > 0 ? array[index - 1].pontuacao : null;
      const diferenca = pontuacaoAnterior !== null ? av.pontuacao - pontuacaoAnterior : null;

      return {
        ...av,
        diferenca,
        tendencia:
          diferenca === null
            ? 'INICIAL'
            : diferenca > 0
              ? 'MELHORA'
              : diferenca < 0
                ? 'PIORA'
                : 'ESTAVEL',
      };
    });

    return {
      estudante,
      dificuldades,
      intervencoes,
      historicoAvaliacoes,
      progressoMedio,
    };
  }
}
