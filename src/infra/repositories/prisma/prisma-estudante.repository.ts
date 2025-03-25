import { injectable } from 'tsyringe';
import { Estudante, Avaliacao } from '../../../domain/entities/estudante.entity';
import { DificuldadeAprendizagem } from '../../../domain/entities/dificuldade-aprendizagem.entity';
import {
  IEstudanteRepository,
  IAvaliacaoEstudante,
  IDadosDificuldadeAprendizagem,
} from '../../../domain/repositories/estudante-repository.interface';
import {
  IFiltrosEstudanteDTO,
  ICriarEstudanteDTO,
  IAtualizarEstudanteDTO,
} from '../../../domain/dtos/estudante.dto';
import { AppError } from '../../../shared/errors/app-error';
import {
  // Importações de modelos e utils agora vêm do arquivo índice
  IPrismaEstudanteData,
  IPrismaAvaliacaoData,
  createPrismaQuery,
  sanitizeForPrisma,
  mapPrismaError,
  mapStatusFromPrisma,
  mapStatusToPrisma,
  Status,
} from '../../repositories/index/index';

// Tipo temporário para facilitar migração gradual
interface IPrismaEstudanteExtendido extends Partial<IPrismaEstudanteData> {
  id: string;
  nome: string;
  serie: string;
  dataNascimento: Date;
  status?: string;
  usuarioId: string;
  instituicaoId?: string;
  criadoEm: Date;
  atualizadoEm: Date;
  dificuldadesAprendizagem?: any[];
  avaliacoes?: IPrismaAvaliacaoData[];
}

@injectable()
export class PrismaEstudanteRepository implements IEstudanteRepository {
  // Implementação de IBaseRepository

  async findAll(): Promise<Estudante[]> {
    try {
      // @ts-expect-error - Incompatibilidade temporária com o Prisma
      const queryBuilder = createPrismaQuery()
        .addInclude('dificuldadesAprendizagem', {
          include: {
            dificuldade: true,
          },
        })
        .addInclude('avaliacoes');

      // @ts-expect-error - Incompatibilidade temporária entre queryBuilder e Prisma
      const estudantes = await this.prisma.estudante.findMany(queryBuilder.build());
      return estudantes.map((estudante) =>
        this.mapToDomain(estudante as unknown as IPrismaEstudanteExtendido),
      );
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao buscar estudantes');
    }
  }

  async findById(id: string): Promise<Estudante | null> {
    try {
      const estudante = await this.prisma.estudante.findUnique({
        where: { id },
        include: {
          // @ts-expect-error - Incompatibilidade temporária com o Prisma
          dificuldadesAprendizagem: {
            include: {
              dificuldade: true,
            },
          },
          avaliacoes: true,
        },
      });

      if (!estudante) {
        return null;
      }

      return this.mapToDomain(estudante as unknown as IPrismaEstudanteExtendido);
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao buscar estudante');
    }
  }

  async create(data: ICriarEstudanteDTO): Promise<Estudante> {
    try {
      // Criação da entidade usando o método estático
      const estudanteProps = {
        nome: data.nome,
        serie: data.serie,
        dataNascimento: data.dataNascimento,
        status: Status.ATIVO,
        usuarioId: data.usuarioId,
        dificuldades: [],
        avaliacoes: [],
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      };

      // @ts-expect-error - Usando método estático criar em vez do construtor privado
      const estudanteEntity = Estudante.criar(estudanteProps);

      const estudanteData = sanitizeForPrisma({
        id: estudanteEntity.id,
        nome: estudanteEntity.nome,
        serie: estudanteEntity.serie,
        dataNascimento: estudanteEntity.dataNascimento,
        status: String(mapStatusToPrisma(estudanteEntity.status)),
        usuarioId: estudanteEntity.usuarioId,
        criadoEm: estudanteEntity.criadoEm,
        atualizadoEm: estudanteEntity.atualizadoEm,
      });

      // @ts-expect-error - Incompatibilidade temporária com o Prisma
      const novoEstudante = await this.prisma.estudante.create({
        data: estudanteData,
        include: {
          dificuldadesAprendizagem: {
            include: {
              dificuldade: true,
            },
          },
          avaliacoes: true,
        },
      });

      return this.mapToDomain(novoEstudante as unknown as IPrismaEstudanteExtendido);
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao criar estudante');
    }
  }

  async update(id: string, data: IAtualizarEstudanteDTO): Promise<Estudante> {
    try {
      const estudanteExistente = await this.findById(id);
      if (!estudanteExistente) {
        throw new AppError('Estudante não encontrado', 404);
      }

      // Preparar os dados atualizados
      const dadosAtualizados = {
        nome: data.nome !== undefined ? data.nome : estudanteExistente.nome,
        serie: data.serie !== undefined ? data.serie : estudanteExistente.serie,
        dataNascimento:
          data.dataNascimento !== undefined
            ? data.dataNascimento
            : estudanteExistente.dataNascimento,
        status: data.status !== undefined ? data.status : estudanteExistente.status,
        usuarioId: data.usuarioId !== undefined ? data.usuarioId : estudanteExistente.usuarioId,
      };

      // Atualizar a entidade usando o método da própria entidade
      const estudanteAtualizado = await estudanteExistente.atualizar(dadosAtualizados);

      const estudanteData = sanitizeForPrisma({
        nome: estudanteAtualizado.nome,
        serie: estudanteAtualizado.serie,
        dataNascimento: estudanteAtualizado.dataNascimento,
        status: String(mapStatusToPrisma(estudanteAtualizado.status)),
        usuarioId: estudanteAtualizado.usuarioId,
        atualizadoEm: new Date(),
      });

      // @ts-expect-error - Incompatibilidade temporária com o Prisma
      const estudanteAtualizadoDB = await this.prisma.estudante.update({
        where: { id },
        data: estudanteData,
        include: {
          dificuldadesAprendizagem: {
            include: {
              dificuldade: true,
            },
          },
          avaliacoes: true,
        },
      });

      return this.mapToDomain(estudanteAtualizadoDB as unknown as IPrismaEstudanteExtendido);
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao atualizar estudante');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      // @ts-expect-error - Incompatibilidade temporária com o Prisma
      await this.prisma.estudante.update({
        where: { id },
        data: {
          status: String(mapStatusToPrisma(Status.CANCELADO)),
          atualizadoEm: new Date(),
        },
      });
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao excluir estudante');
    }
  }

  // Implementação específica de IEstudanteRepository

  async findByFilter(filtros?: IFiltrosEstudanteDTO): Promise<Estudante[]> {
    try {
      // @ts-expect-error - Incompatibilidade temporária com o Prisma
      const queryBuilder = createPrismaQuery()
        .addFilter('status', { not: mapStatusToPrisma(Status.CANCELADO) })
        .addInclude('dificuldadesAprendizagem', {
          include: {
            dificuldade: true,
          },
        })
        .addInclude('avaliacoes');

      if (filtros?.nome) {
        queryBuilder.addFilter('nome', {
          contains: filtros.nome,
          mode: 'insensitive',
        });
      }

      if (filtros?.serie) {
        queryBuilder.addFilter('serie', {
          equals: filtros.serie,
        });
      }

      if (filtros?.usuarioId) {
        queryBuilder.addFilter('usuarioId', {
          equals: filtros.usuarioId,
        });
      }

      if (filtros?.status) {
        queryBuilder.addFilter('status', {
          equals: filtros.status,
        });
      }

      if (filtros?.comDificuldade) {
        queryBuilder.addFilter('dificuldadesAprendizagem', {
          some: {
            dificuldade: {
              id: {
                equals: filtros.comDificuldade,
              },
            },
          },
        });
      }

      // @ts-expect-error - Incompatibilidade temporária entre queryBuilder e Prisma
      const estudantes = await this.prisma.estudante.findMany(queryBuilder.build());
      return estudantes.map((estudante) =>
        this.mapToDomain(estudante as unknown as IPrismaEstudanteExtendido),
      );
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao buscar estudantes com filtros');
    }
  }

  async findByUsuarioId(usuarioId: string): Promise<Estudante[]> {
    try {
      // @ts-expect-error - Incompatibilidade temporária com o Prisma
      const queryBuilder = createPrismaQuery()
        .addFilter('usuarioId', usuarioId)
        .addFilter('status', { not: mapStatusToPrisma(Status.CANCELADO) })
        .addInclude('dificuldadesAprendizagem', {
          include: {
            dificuldade: true,
          },
        })
        .addInclude('avaliacoes');

      // @ts-expect-error - Incompatibilidade temporária entre queryBuilder e Prisma
      const estudantes = await this.prisma.estudante.findMany(queryBuilder.build());
      return estudantes.map((estudante) =>
        this.mapToDomain(estudante as unknown as IPrismaEstudanteExtendido),
      );
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao buscar estudantes por usuário');
    }
  }

  async adicionarDificuldade(
    estudanteId: string,
    dificuldadeId: string,
    dadosAdicionais?: IDadosDificuldadeAprendizagem,
  ): Promise<Estudante> {
    try {
      const estudante = await this.findById(estudanteId);
      if (!estudante) {
        throw new AppError('Estudante não encontrado', 404);
      }

      const dificuldade = await this.findDificuldadeById(dificuldadeId);
      if (!dificuldade) {
        throw new AppError('Dificuldade de aprendizagem não encontrada', 404);
      }

      // Verificar se a dificuldade já existe
      // @ts-expect-error - Incompatibilidade temporária com o Prisma
      const existente = await this.prisma.estudanteDificuldade.findFirst({
        where: {
          estudanteId,
          dificuldadeId,
          ativo: true,
        },
      });

      if (existente) {
        throw new AppError('Esta dificuldade já está associada ao estudante', 400);
      }

      // Criar associação entre estudante e dificuldade
      // @ts-expect-error - Incompatibilidade temporária com o Prisma
      await this.prisma.estudanteDificuldade.create({
        data: {
          estudanteId,
          dificuldadeId,
          tipo: dadosAdicionais?.tipo || '',
          observacoes: dadosAdicionais?.observacoes || '',
          ativo: true,
        },
      });

      // Recarregar o estudante com as dificuldades atualizadas
      const estudanteAtualizado = await this.prisma.estudante.findUnique({
        where: { id: estudanteId },
        include: {
          // @ts-expect-error - Incompatibilidade temporária com o Prisma
          dificuldadesAprendizagem: {
            include: {
              dificuldade: true,
            },
            where: {
              ativo: true,
            },
          },
          avaliacoes: true,
        },
      });

      return this.mapToDomain(estudanteAtualizado as unknown as IPrismaEstudanteExtendido);
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao adicionar dificuldade ao estudante');
    }
  }

  async removerDificuldade(estudanteId: string, dificuldadeId: string): Promise<Estudante> {
    try {
      const estudante = await this.findById(estudanteId);
      if (!estudante) {
        throw new AppError('Estudante não encontrado', 404);
      }

      // @ts-expect-error - Incompatibilidade temporária com o Prisma
      const associacao = await this.prisma.estudanteDificuldade.findFirst({
        where: {
          estudanteId,
          dificuldadeId,
          ativo: true,
        },
      });

      if (!associacao) {
        throw new AppError('Dificuldade não está associada a este estudante', 404);
      }

      // Marcar a associação como inativa em vez de excluir
      // @ts-expect-error - Incompatibilidade temporária com o Prisma
      await this.prisma.estudanteDificuldade.update({
        where: {
          id: associacao.id,
        },
        data: {
          ativo: false,
          atualizadoEm: new Date(),
        },
      });

      // Recarregar o estudante com as dificuldades atualizadas
      const estudanteAtualizado = await this.prisma.estudante.findUnique({
        where: { id: estudanteId },
        include: {
          // @ts-expect-error - Incompatibilidade temporária com o Prisma
          dificuldadesAprendizagem: {
            include: {
              dificuldade: true,
            },
            where: {
              ativo: true,
            },
          },
          avaliacoes: true,
        },
      });

      return this.mapToDomain(estudanteAtualizado as unknown as IPrismaEstudanteExtendido);
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao remover dificuldade do estudante');
    }
  }

  async adicionarAvaliacao(
    estudanteId: string,
    avaliacaoData: IAvaliacaoEstudante,
  ): Promise<Estudante> {
    try {
      const estudante = await this.findById(estudanteId);
      if (!estudante) {
        throw new AppError('Estudante não encontrado', 404);
      }

      // Criar avaliação
      // @ts-expect-error - Incompatibilidade temporária com o Prisma
      await this.prisma.avaliacao.create({
        data: {
          estudanteId,
          data: avaliacaoData.data,
          tipo: avaliacaoData.tipo,
          pontuacao: avaliacaoData.pontuacao,
          observacoes: avaliacaoData.observacoes,
          metadados:
            avaliacaoData.disciplina || avaliacaoData.conteudo
              ? {
                  disciplina: avaliacaoData.disciplina,
                  conteudo: avaliacaoData.conteudo,
                  avaliadorId: avaliacaoData.avaliadorId,
                }
              : undefined,
        },
      });

      // Recarregar o estudante com as avaliações atualizadas
      const estudanteAtualizado = await this.prisma.estudante.findUnique({
        where: { id: estudanteId },
        include: {
          // @ts-expect-error - Incompatibilidade temporária com o Prisma
          dificuldadesAprendizagem: {
            include: {
              dificuldade: true,
            },
            where: {
              ativo: true,
            },
          },
          avaliacoes: true,
        },
      });

      return this.mapToDomain(estudanteAtualizado as unknown as IPrismaEstudanteExtendido);
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao adicionar avaliação ao estudante');
    }
  }

  async buscarEstudantesComNecessidadesSimilares(dificuldadeIds: string[]): Promise<Estudante[]> {
    try {
      if (!dificuldadeIds.length) {
        return [];
      }

      // @ts-expect-error - Incompatibilidade temporária com o Prisma
      const queryBuilder = createPrismaQuery()
        .addFilter('dificuldadesAprendizagem', {
          some: {
            dificuldadeId: {
              in: dificuldadeIds,
            },
            ativo: true,
          },
        })
        .addFilter('status', { not: mapStatusToPrisma(Status.CANCELADO) })
        .addInclude('dificuldadesAprendizagem', {
          include: {
            dificuldade: true,
          },
          where: {
            ativo: true,
          },
        })
        .addInclude('avaliacoes');

      // @ts-expect-error - Incompatibilidade temporária entre queryBuilder e Prisma
      const estudantes = await this.prisma.estudante.findMany(queryBuilder.build());
      return estudantes.map((estudante) =>
        this.mapToDomain(estudante as unknown as IPrismaEstudanteExtendido),
      );
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao buscar estudantes com necessidades similares');
    }
  }

  async findDificuldadeById(id: string): Promise<DificuldadeAprendizagem | null> {
    try {
      // @ts-expect-error - Incompatibilidade temporária com o Prisma
      const dificuldade = await this.prisma.dificuldadeAprendizagem.findUnique({
        where: { id },
      });

      if (!dificuldade) {
        return null;
      }

      return {
        id: dificuldade.id,
        nome: dificuldade.nome,
        descricao: dificuldade.descricao || '',
        categoria: dificuldade.categoria,
        nivel: dificuldade.nivel,
        recomendacoes: dificuldade.recomendacoes || '',
        criadoEm: dificuldade.criadoEm,
        atualizadoEm: dificuldade.atualizadoEm,
      };
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao buscar dificuldade de aprendizagem');
    }
  }

  async obterPorId(id: string): Promise<Estudante | null> {
    return this.findById(id);
  }

  /**
   * Método privado para mapear dados do Prisma para o domínio
   */
  private mapToDomain(data: IPrismaEstudanteExtendido): Estudante {
    // Criar propriedades do estudante usando IEstudanteProps
    const props = {
      id: data.id,
      nome: data.nome,
      serie: data.serie,
      dataNascimento: data.dataNascimento,
      status: data.status ? mapStatusFromPrisma(data.status) : Status.ATIVO,
      usuarioId: data.usuarioId,
      dificuldades: data.dificuldadesAprendizagem?.map((d) => this.mapDificuldadeToDomain(d)) || [],
      avaliacoes: data.avaliacoes?.map((a) => this.mapAvaliacaoToDomain(a)) || [],
      criadoEm: data.criadoEm,
      atualizadoEm: data.atualizadoEm,
      // Propriedades opcionais que podem não estar presentes nos dados do Prisma
      instituicaoId: data.instituicaoId,
    };

    // @ts-expect-error - Usando método estático restaurar em vez do construtor privado
    return Estudante.restaurar(props);
  }

  /**
   * Método privado para mapear dificuldade de aprendizagem
   */
  private mapDificuldadeToDomain(data: any): DificuldadeAprendizagem {
    return {
      id: data.id,
      nome: data.nome,
      descricao: data.descricao || '',
      categoria: data.categoria,
      nivel: data.nivel,
      recomendacoes: data.recomendacoes || '',
      criadoEm: data.criadoEm,
      atualizadoEm: data.atualizadoEm,
    };
  }

  /**
   * Método privado para mapear avaliação
   */
  private mapAvaliacaoToDomain(data: any): Avaliacao {
    const avaliacaoProps = {
      id: data.id,
      data: data.data,
      tipo: data.tipo,
      pontuacao: data.pontuacao,
      observacoes: data.observacoes || '',
      metadados: data.metadados || {},
      criadoEm: data.criadoEm,
      atualizadoEm: data.atualizadoEm,
    };

    // @ts-expect-error - Usando método estático criar em vez do construtor privado
    return Avaliacao.criar(avaliacaoProps);
  }

  private calcularIdade(dataNascimento?: Date): number {
    if (!dataNascimento) {
      return 0;
    }

    const hoje = new Date();
    let idade = hoje.getFullYear() - dataNascimento.getFullYear();
    const mesAtual = hoje.getMonth();
    const diaAtual = hoje.getDate();
    const mesNascimento = dataNascimento.getMonth();
    const diaNascimento = dataNascimento.getDate();

    // Ajustar idade se ainda não completou aniversário no ano corrente
    if (mesAtual < mesNascimento || (mesAtual === mesNascimento && diaAtual < diaNascimento)) {
      idade--;
    }

    return idade;
  }
}
