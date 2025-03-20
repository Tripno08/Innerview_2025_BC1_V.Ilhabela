import {
  IEstudanteRepository,
  AvaliacaoEstudante,
} from '@domain/repositories/estudante-repository.interface';
import { Estudante } from '@domain/entities/estudante.entity';
import {
  DificuldadeAprendizagem,
  TipoDificuldade,
} from '@domain/entities/dificuldade-aprendizagem.entity';
import { BaseRepository } from './base.repository';
import { Status } from '@shared/enums';
import { AppError } from '@shared/errors/app-error';
import { injectable } from 'tsyringe';
import { UnitOfWork } from '../database/unit-of-work';
import { mapLocalStatusToPrisma } from '@shared/utils/enum-mappers';

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

      return estudantes.map((e) => this.mapToEstudante(e));
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

      return estudantes.map((e) => this.mapToEstudante(e));
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
  private adaptToPrismaCreate(data: Partial<Estudante>): any {
    const { status, ...restData } = data;
    return {
      ...restData,
      ...(status && { status: mapLocalStatusToPrisma(status) }),
    };
  }

  /**
   * Adaptar dados de atualização para o formato do Prisma
   */
  private adaptToPrismaUpdate(data: Partial<Omit<Estudante, 'id'>>): any {
    const { status, ...restData } = data;
    return {
      ...restData,
      ...(status && { status: mapLocalStatusToPrisma(status) }),
    };
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
        const createData: any = {
          estudanteId,
          dificuldadeId,
          nivel: 'LEVE', // Valor padrão obrigatório
        };

        if (dadosAdicionais?.tipo) {
          createData.tipo = dadosAdicionais.tipo;
        }

        if (dadosAdicionais?.observacoes) {
          createData.observacoes = dadosAdicionais.observacoes;
        }

        await prisma.estudanteDificuldade.create({
          data: createData,
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
        const prismaAvaliacaoData: any = {
          ...avaliacaoData,
          estudanteId,
          data: avaliacaoData.data || new Date(),
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

      return estudantes.map((e) => this.mapToEstudante(e));
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
  private mapToEstudante(estudantePrisma: any): Estudante {
    // Mapear dificuldades
    const dificuldades = Array.isArray(estudantePrisma.dificuldades)
      ? estudantePrisma.dificuldades.map((rel: any) =>
          DificuldadeAprendizagem.restaurar({
            ...rel.dificuldade,
            tipo:
              rel.dificuldade.categoria === 'LEITURA'
                ? TipoDificuldade.LEITURA
                : rel.dificuldade.categoria === 'ESCRITA'
                  ? TipoDificuldade.ESCRITA
                  : rel.dificuldade.categoria === 'MATEMATICA'
                    ? TipoDificuldade.MATEMATICA
                    : TipoDificuldade.OUTRO,
          }),
        )
      : [];

    // Criar a entidade Estudante
    return Estudante.restaurar({
      id: estudantePrisma.id as string,
      nome: estudantePrisma.nome as string,
      serie: estudantePrisma.serie as string,
      dataNascimento: estudantePrisma.dataNascimento as Date,
      status: estudantePrisma.status as Status,
      usuarioId: estudantePrisma.usuarioId as string,
      dificuldades,
      avaliacoes: (Array.isArray(estudantePrisma.avaliacoes)
        ? estudantePrisma.avaliacoes
        : []) as any[],
      criadoEm: estudantePrisma.criadoEm as Date,
      atualizadoEm: estudantePrisma.atualizadoEm as Date,
    });
  }
}
