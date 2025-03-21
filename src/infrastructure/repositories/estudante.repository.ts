import {
  IEstudanteRepository,
  AvaliacaoEstudante,
} from '../../domain/repositories/estudante-repository.interface';
import { Estudante, AvaliacaoProps } from '../../domain/entities/estudante.entity';
import {
  DificuldadeAprendizagem,
  TipoDificuldade,
  CategoriaDificuldade,
} from '../../domain/entities/dificuldade-aprendizagem.entity';
import { BaseRepository } from './base.repository';
import { Status, Nivel } from '../../shared/enums';
import { AppError } from '../../shared/errors/app-error';
import { injectable } from 'tsyringe';
import { UnitOfWork } from '../database/unit-of-work';
import { mapStatusToPrisma } from '../../shared/utils/enum-mappers';
import { Prisma } from '@prisma/client';

/**
 * Tipo estendido para o Prisma com metadados
 */
type AvaliacaoWithMetadata = Prisma.AvaliacaoCreateInput & {
  metadados?: Record<string, unknown>;
};

/**
 * Implementação do repositório de estudantes utilizando Prisma
 */
@injectable()
export class EstudanteRepository extends BaseRepository<Estudante> implements IEstudanteRepository {
  constructor(unitOfWork: UnitOfWork) {
    super(unitOfWork);
  }

  /**
   * Encontrar todos os estudantes
   */
  async findAll(): Promise<Estudante[]> {
    try {
      const estudantes = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.estudante.findMany({
          include: this.getEstudanteIncludes(),
          orderBy: {
            nome: 'asc',
          },
        }),
      );

      return (estudantes as any[]).map((e) => this.mapToEstudante(e));
    } catch (error) {
      this.handlePrismaError(error, 'Estudante');
    }
  }

  /**
   * Encontrar estudantes por ID de usuário (professor)
   */
  async findByUsuarioId(usuarioId: string): Promise<Estudante[]> {
    try {
      const estudantes = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.estudante.findMany({
          where: { usuarioId },
          include: this.getEstudanteIncludes(),
          orderBy: {
            nome: 'asc',
          },
        }),
      );

      return (estudantes as any[]).map((e) => this.mapToEstudante(e));
    } catch (error) {
      this.handlePrismaError(error, 'Estudante');
    }
  }

  /**
   * Encontrar estudante por ID
   */
  async findById(id: string): Promise<Estudante | null> {
    try {
      const estudante = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.estudante.findUnique({
          where: { id },
          include: this.getEstudanteIncludes(),
        }),
      );

      if (!estudante) {
        return null;
      }

      return this.mapToEstudante(estudante);
    } catch (error) {
      this.handlePrismaError(error, 'Estudante');
    }
  }

  /**
   * Adaptar dados de entidade para o formato do Prisma
   */
  private adaptToPrismaCreate(data: Partial<Estudante>): Prisma.EstudanteCreateInput {
    // Remover propriedades complexas que Prisma não aceita diretamente
    const { status, ...restData } = data;

    // Omitir propriedades complexas
    const dadosSemPropriedadesComplexas = this.removerPropriedadesEntidade(restData);

    // Construir o objeto aceitável pelo Prisma
    const resultado: Record<string, unknown> = {
      ...dadosSemPropriedadesComplexas,
    };

    if (status) {
      resultado.status = mapStatusToPrisma(status);
    }

    return resultado as unknown as Prisma.EstudanteCreateInput;
  }

  /**
   * Adaptar dados de atualização para o formato do Prisma
   */
  private adaptToPrismaUpdate(data: Partial<Omit<Estudante, 'id'>>): Prisma.EstudanteUpdateInput {
    // Remover propriedades complexas que Prisma não aceita diretamente
    const { status, ...restData } = data;

    // Omitir propriedades complexas
    const dadosSemPropriedadesComplexas = this.removerPropriedadesEntidade(restData);

    // Construir o objeto aceitável pelo Prisma
    const resultado: Record<string, unknown> = {
      ...dadosSemPropriedadesComplexas,
    };

    if (status) {
      resultado.status = mapStatusToPrisma(status);
    }

    return resultado as unknown as Prisma.EstudanteUpdateInput;
  }

  /**
   * Remove propriedades de entidade que o Prisma não aceita diretamente
   */
  private removerPropriedadesEntidade(data: Record<string, unknown>): Record<string, unknown> {
    // Lista de propriedades que devem ser excluídas do objeto enviado ao Prisma
    const propsParaRemover = [
      'calcularIdade',
      'calcularMediaAvaliacoes',
      'estaAtivo',
      'inativar',
      'possuiDificuldadeGrave',
      'adicionarAvaliacao',
      'adicionarDificuldade',
      'atualizar',
      'removerDificuldade',
      'dificuldades',
      'avaliacoes',
    ];

    const resultado = { ...data };

    for (const prop of propsParaRemover) {
      if (prop in resultado) {
        delete resultado[prop];
      }
    }

    return resultado;
  }

  /**
   * Criar um novo estudante
   */
  async create(data: Partial<Estudante>): Promise<Estudante> {
    try {
      const prismaData = this.adaptToPrismaCreate(data);
      const estudante = await this.unitOfWork.withTransaction(async (prisma) => {
        return await prisma.estudante.create({
          data: prismaData,
          include: this.getEstudanteIncludes(),
        });
      });

      return this.mapToEstudante(estudante);
    } catch (error) {
      this.handlePrismaError(error, 'Estudante');
    }
  }

  /**
   * Atualizar um estudante existente
   */
  async update(id: string, data: Partial<Omit<Estudante, 'id'>>): Promise<Estudante> {
    try {
      const prismaData = this.adaptToPrismaUpdate(data);
      const estudante = await this.unitOfWork.withTransaction(async (prisma) => {
        return await prisma.estudante.update({
          where: { id },
          data: prismaData,
          include: this.getEstudanteIncludes(),
        });
      });

      return this.mapToEstudante(estudante);
    } catch (error) {
      this.handlePrismaError(error, 'Estudante');
    }
  }

  /**
   * Remover um estudante
   */
  async delete(id: string): Promise<void> {
    try {
      await this.unitOfWork.withTransaction(async (prisma) => {
        // Primeiro, remover todas as associações
        await prisma.estudanteDificuldade.deleteMany({
          where: { estudanteId: id },
        });

        // Remover avaliações
        await prisma.avaliacao.deleteMany({
          where: { estudanteId: id },
        });

        // Remover intervenções
        await prisma.intervencao.deleteMany({
          where: { estudanteId: id },
        });

        // Finalmente, remover o estudante
        await prisma.estudante.delete({
          where: { id },
        });
      });
    } catch (error) {
      this.handlePrismaError(error, 'Estudante');
    }
  }

  /**
   * Adicionar uma dificuldade de aprendizagem a um estudante
   */
  async adicionarDificuldade(
    estudanteId: string,
    dificuldadeId: string,
    dadosAdicionais?: {
      tipo: string;
      observacoes?: string;
    },
  ): Promise<Estudante> {
    try {
      await this.unitOfWork.withTransaction(async (prisma) => {
        // Verificar se o estudante existe
        const estudante = await prisma.estudante.findUnique({
          where: { id: estudanteId },
        });

        if (!estudante) {
          throw new AppError('Estudante não encontrado', 404, 'STUDENT_NOT_FOUND');
        }

        // Verificar se a dificuldade existe
        const dificuldade = await prisma.dificuldadeAprendizagem.findUnique({
          where: { id: dificuldadeId },
        });

        if (!dificuldade) {
          throw new AppError('Dificuldade não encontrada', 404, 'DIFFICULTY_NOT_FOUND');
        }

        // Verificar se a associação já existe
        const associacaoExistente = await prisma.estudanteDificuldade.findFirst({
          where: {
            estudanteId,
            dificuldadeId,
          },
        });

        if (associacaoExistente) {
          throw new AppError(
            'Dificuldade já associada a este estudante',
            409,
            'DIFFICULTY_ALREADY_ASSOCIATED',
          );
        }

        // Criar a associação com os dados adicionais, se fornecidos
        const createData: Omit<Prisma.EstudanteDificuldadeCreateInput, 'tipo'> & {
          tipo?: string;
        } = {
          estudante: { connect: { id: estudanteId } },
          dificuldade: { connect: { id: dificuldadeId } },
          nivel: Nivel.BAIXO, // Usando o enum correto do sistema
        };

        if (dadosAdicionais?.tipo) {
          createData.tipo = dadosAdicionais.tipo;
        }

        if (dadosAdicionais?.observacoes) {
          createData.observacoes = dadosAdicionais.observacoes;
        }

        await prisma.estudanteDificuldade.create({
          data: createData as Prisma.EstudanteDificuldadeCreateInput,
        });
      });

      // Buscar o estudante atualizado
      return await this.findById(estudanteId);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      this.handlePrismaError(error, 'Estudante-Dificuldade');
    }
  }

  /**
   * Remover uma dificuldade de aprendizagem de um estudante
   */
  async removerDificuldade(estudanteId: string, dificuldadeId: string): Promise<Estudante> {
    try {
      await this.unitOfWork.withTransaction(async (prisma) => {
        // Verificar se a associação existe
        const associacao = await prisma.estudanteDificuldade.findFirst({
          where: {
            estudanteId,
            dificuldadeId,
          },
        });

        if (!associacao) {
          throw new AppError(
            'Dificuldade não está associada a este estudante',
            404,
            'DIFFICULTY_NOT_ASSOCIATED',
          );
        }

        // Remover a associação
        await prisma.estudanteDificuldade.deleteMany({
          where: {
            estudanteId,
            dificuldadeId,
          },
        });
      });

      // Buscar o estudante atualizado
      return await this.findById(estudanteId);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      this.handlePrismaError(error, 'Estudante-Dificuldade');
    }
  }

  /**
   * Adicionar uma avaliação a um estudante
   */
  async adicionarAvaliacao(
    estudanteId: string,
    avaliacaoData: AvaliacaoEstudante,
  ): Promise<Estudante> {
    try {
      await this.unitOfWork.withTransaction(async (prisma) => {
        // Verificar se o estudante existe
        const estudante = await prisma.estudante.findUnique({
          where: { id: estudanteId },
        });

        if (!estudante) {
          throw new AppError('Estudante não encontrado', 404, 'STUDENT_NOT_FOUND');
        }

        // Verificar se o avaliadorId foi fornecido
        if (!avaliacaoData.avaliadorId) {
          throw new AppError('ID do avaliador é obrigatório', 400, 'ASSESSOR_REQUIRED');
        }

        // Adaptar os dados para o formato esperado pelo Prisma
        const prismaAvaliacaoData: AvaliacaoWithMetadata = {
          estudante: { connect: { id: estudanteId } },
          data: avaliacaoData.data || new Date(),
          tipo: avaliacaoData.tipo,
          pontuacao: avaliacaoData.pontuacao || 0,
          observacoes: avaliacaoData.observacoes,
          metadados: {
            avaliadorId: avaliacaoData.avaliadorId,
            ...(avaliacaoData.disciplina && { disciplina: avaliacaoData.disciplina }),
            ...(avaliacaoData.conteudo && { conteudo: avaliacaoData.conteudo }),
          },
        };

        // Adicionar a avaliação
        await prisma.avaliacao.create({
          data: prismaAvaliacaoData,
        });
      });

      // Buscar o estudante atualizado com a nova avaliação
      return await this.findById(estudanteId);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      this.handlePrismaError(error, 'Estudante-Avaliação');
    }
  }

  /**
   * Buscar estudantes com necessidades similares
   */
  async buscarEstudantesComNecessidadesSimilares(dificuldadeIds: string[]): Promise<Estudante[]> {
    try {
      const estudantes = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.estudante.findMany({
          where: {
            dificuldades: {
              some: {
                dificuldadeId: {
                  in: dificuldadeIds,
                },
              },
            },
          },
          include: this.getEstudanteIncludes(),
          orderBy: {
            nome: 'asc',
          },
        }),
      );

      return (estudantes as any[]).map((e) => this.mapToEstudante(e));
    } catch (error) {
      this.handlePrismaError(error, 'Estudante');
    }
  }

  /**
   * Configuração de inclusões para consultas de estudante
   */
  private getEstudanteIncludes() {
    return {
      dificuldades: {
        include: {
          dificuldade: true,
        },
      },
      avaliacoes: true,
      usuario: {
        select: {
          id: true,
          nome: true,
          email: true,
        },
      },
    };
  }

  /**
   * Método para mapear um estudante do Prisma para a entidade Estudante
   */
  private mapToEstudante(estudantePrisma: unknown): Estudante {
    const data = estudantePrisma as Record<string, unknown>;

    // Mapear dificuldades
    const dificuldades = Array.isArray(data.dificuldades)
      ? data.dificuldades.map((rel) => {
          const relData = rel as Record<string, unknown>;
          const difData = relData.dificuldade as Record<string, unknown>;

          // Converter sintomas para o formato correto considerando que no Prisma pode estar como string
          let sintomasProcessados: string;
          if (typeof difData.sintomas === 'string') {
            sintomasProcessados = difData.sintomas;
          } else if (Array.isArray(difData.sintomas)) {
            sintomasProcessados = difData.sintomas.join(', ');
          } else {
            sintomasProcessados = '';
          }

          // Determinar o tipo com base na categoria
          let tipo = TipoDificuldade.OUTRO;
          const categoria = difData.categoria as string;
          if (categoria === 'LEITURA') {
            tipo = TipoDificuldade.LEITURA;
          } else if (categoria === 'ESCRITA') {
            tipo = TipoDificuldade.ESCRITA;
          } else if (categoria === 'MATEMATICA') {
            tipo = TipoDificuldade.MATEMATICA;
          }

          // Mapear categoria para o enum corretamente
          // Usar um valor padrão seguro se não conseguir mapear corretamente
          let categoriaMapeada = 'LEVE' as unknown as CategoriaDificuldade;

          try {
            if (['LEVE', 'MODERADA', 'GRAVE'].includes(categoria)) {
              categoriaMapeada = categoria as unknown as CategoriaDificuldade;
            }
          } catch (error) {
            // Em caso de erro, manter o valor padrão
          }

          return DificuldadeAprendizagem.restaurar({
            id: difData.id as string,
            nome: difData.nome as string,
            descricao: difData.descricao as string,
            sintomas: sintomasProcessados,
            categoria: categoriaMapeada,
            tipo: tipo,
          });
        })
      : [];

    // Mapear avaliações
    const avaliacoes = Array.isArray(data.avaliacoes)
      ? data.avaliacoes.map((aval) => {
          const avalData = aval as Record<string, unknown>;
          return {
            id: avalData.id as string,
            data: avalData.data as Date,
            tipo: avalData.tipo as string,
            pontuacao: Number(avalData.pontuacao || 0),
            observacoes: avalData.observacoes as string | undefined,
            criadoEm: avalData.criadoEm as Date,
            atualizadoEm: avalData.atualizadoEm as Date,
          } as AvaliacaoProps;
        })
      : [];

    // Criar a entidade Estudante
    return Estudante.restaurar({
      id: data.id as string,
      nome: data.nome as string,
      serie: data.serie as string,
      dataNascimento: data.dataNascimento as Date,
      status: data.status as Status,
      usuarioId: data.usuarioId as string,
      dificuldades,
      avaliacoes,
      criadoEm: data.criadoEm as Date,
      atualizadoEm: data.atualizadoEm as Date,
    });
  }
}
