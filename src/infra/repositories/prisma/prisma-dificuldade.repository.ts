import { injectable } from 'tsyringe';
import {
  CategoriaDificuldade as PrismaCategoriaDificuldade,
  DificuldadeAprendizagem as PrismaDificuldadeAprendizagem,
  EstudanteDificuldade as PrismaEstudanteDificuldade,
} from '@prisma/client';

import { IDificuldadeRepository } from '../../../domain/repositories/dificuldade-repository.interface';
import {
  DificuldadeAprendizagem,
  TipoDificuldade,
  CategoriaDificuldade,
} from '../../../domain/entities/dificuldade-aprendizagem.entity';

import {
  // Importações centralizadas
  Status,
  mapStatusToPrisma,
  mapStatusFromPrisma,
  createPrismaQuery,
  mapPrismaError,
  sanitizeForPrisma,
  mapCategoriaDificuldadeToPrisma,
  mapTipoDificuldadeToCategoria,
} from '../../repositories/index/index';
import {
  IDificuldadeFindManyArgs,
  IDificuldadeCreateArgs,
} from '../../../types/prisma-extended';

/**
 * Implementação do repositório de dificuldades de aprendizagem usando Prisma
 */
@injectable()
export class PrismaDificuldadeRepository implements IDificuldadeRepository {
  /**
   * Encontrar todas as dificuldades
   */
  async findAll(): Promise<DificuldadeAprendizagem[]> {
    try {
      const query = createPrismaQuery<IDificuldadeFindManyArgs['where']>()
        .addOrderBy('nome', 'asc')
        .build();

      const dificuldades = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.dificuldadeAprendizagem.findMany(query),
      );

      return dificuldades.map((d) => this.mapToDificuldade(d));
    } catch (error) {
      throw mapPrismaError(error, 'Dificuldade');
    }
  }

  /**
   * Encontrar dificuldade por ID
   */
  async findById(id: string): Promise<DificuldadeAprendizagem | null> {
    try {
      const dificuldade = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.dificuldadeAprendizagem.findUnique({
          where: { id },
        }),
      );

      if (!dificuldade) {
        return null;
      }

      return this.mapToDificuldade(dificuldade);
    } catch (error) {
      throw mapPrismaError(error, 'Dificuldade');
    }
  }

  /**
   * Encontrar dificuldades por tipo
   */
  async findByTipo(tipo: TipoDificuldade): Promise<DificuldadeAprendizagem[]> {
    try {
      const query = createPrismaQuery<IDificuldadeFindManyArgs['where']>()
        .addFilter('categoria', this.mapTipoToCategoria(tipo))
        .addOrderBy('nome', 'asc')
        .build();

      const dificuldades = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.dificuldadeAprendizagem.findMany(query),
      );

      return dificuldades.map((d) => this.mapToDificuldade(d));
    } catch (error) {
      throw mapPrismaError(error, 'Dificuldade');
    }
  }

  /**
   * Encontrar dificuldades por categoria
   */
  async findByCategoria(categoria: CategoriaDificuldade): Promise<DificuldadeAprendizagem[]> {
    try {
      const query = createPrismaQuery<IDificuldadeFindManyArgs['where']>()
        .addFilter('categoria', this.mapCategoriaParaPrisma(categoria))
        .addOrderBy('nome', 'asc')
        .build();

      const dificuldades = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.dificuldadeAprendizagem.findMany(query),
      );

      return dificuldades.map((d) => this.mapToDificuldade(d));
    } catch (error) {
      throw mapPrismaError(error, 'Dificuldade');
    }
  }

  /**
   * Encontrar dificuldades associadas a um estudante
   */
  async findByEstudanteId(estudanteId: string): Promise<DificuldadeAprendizagem[]> {
    try {
      const associacoes = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.estudanteDificuldade.findMany({
          where: { estudanteId },
          include: {
            dificuldade: true,
          },
        }),
      );

      type EstudanteDificuldadeWithDificuldade = PrismaEstudanteDificuldade & {
        dificuldade: PrismaDificuldadeAprendizagem;
      };

      return (associacoes as EstudanteDificuldadeWithDificuldade[]).map((assoc) =>
        this.mapToDificuldade(assoc.dificuldade),
      );
    } catch (error) {
      throw mapPrismaError(error, 'Dificuldade');
    }
  }

  /**
   * Criar uma nova dificuldade de aprendizagem
   */
  async create(data: Record<string, unknown>): Promise<DificuldadeAprendizagem> {
    try {
      const { nome, descricao, sintomas, tipo, categoria, statusInput } = data;

      if (!nome || !categoria) {
        throw new Error('Nome e categoria são obrigatórios para criar dificuldade de aprendizagem');
      }

      // Criar objeto básico
      const createData = {
        nome: String(nome),
        descricao: descricao ? String(descricao) : '',
        sintomas: sintomas ? String(sintomas) : '',
        categoria: this.mapCategoriaParaPrisma(categoria as CategoriaDificuldade),
        status: mapStatusToPrisma((statusInput as Status) || Status.ATIVO),
      };

      // Adicionar metadados se o tipo estiver definido
      const metadados = tipo ? { tipo: String(tipo) } : undefined;

      // Criar dados para o Prisma
      const prismaData = {
        ...createData,
        ...(metadados ? { metadados } : {}),
      };

      const novaDificuldade = await this.unitOfWork.withTransaction(async (prisma) => {
        return prisma.dificuldadeAprendizagem.create({
          data: sanitizeForPrisma(prismaData),
        });
      });

      return this.mapToDificuldade(novaDificuldade);
    } catch (error) {
      throw mapPrismaError(error, 'Dificuldade');
    }
  }

  /**
   * Atualizar uma dificuldade existente
   */
  async update(id: string, data: Record<string, unknown>): Promise<DificuldadeAprendizagem> {
    try {
      const { statusInput, tipo, ...outrosDados } = data;

      // Construir objeto básico de atualização
      const updateData: Record<string, unknown> = { ...outrosDados };

      // Adicionar status se fornecido
      if (statusInput) {
        updateData.status = mapStatusToPrisma(statusInput as Status);
      }

      // Adicionar metadados se o tipo estiver definido
      if (tipo) {
        updateData.metadados = { tipo: String(tipo) };
      }

      const dificuldadeAtualizada = await this.unitOfWork.withTransaction(async (prisma) => {
        return prisma.dificuldadeAprendizagem.update({
          where: { id },
          data: sanitizeForPrisma(updateData),
        });
      });

      return this.mapToDificuldade(dificuldadeAtualizada);
    } catch (error) {
      throw mapPrismaError(error, 'Dificuldade');
    }
  }

  /**
   * Excluir uma dificuldade
   */
  async delete(id: string): Promise<void> {
    try {
      await this.unitOfWork.withTransaction(async (prisma) => {
        // Primeiro verificar se existem associações com estudantes
        const associacoes = await prisma.estudanteDificuldade.findMany({
          where: { dificuldadeId: id },
        });

        if (associacoes.length > 0) {
          throw new Error(
            'Não é possível excluir esta dificuldade porque está associada a estudantes',
          );
        }

        // Excluir a dificuldade
        await prisma.dificuldadeAprendizagem.delete({
          where: { id },
        });
      });
    } catch (error) {
      throw mapPrismaError(error, 'Dificuldade');
    }
  }

  /**
   * Mapear dados do Prisma para a entidade de domínio
   */
  private mapToDificuldade(
    dificuldadePrisma: PrismaDificuldadeAprendizagem,
  ): DificuldadeAprendizagem {
    const { id, nome, descricao, sintomas, categoria, status, metadados } = dificuldadePrisma;

    // Determinar o tipo com base na categoria ou metadados
    let tipo = this.obterTipoDaCategoria(categoria);

    // Se metadados contiver um tipo, usá-lo
    if (metadados && typeof metadados === 'object' && 'tipo' in metadados) {
      tipo = metadados.tipo as unknown as TipoDificuldade;
    }

    return DificuldadeAprendizagem.restaurar({
      id,
      nome,
      descricao: descricao || '',
      sintomas: sintomas || '',
      tipo,
      categoria: this.mapCategoriaFromPrisma(categoria),
      status: mapStatusFromPrisma(status),
      criadoEm: dificuldadePrisma.criadoEm || new Date(),
      atualizadoEm: dificuldadePrisma.atualizadoEm || new Date(),
    });
  }

  /**
   * Mapear categoria de domínio para categoria do Prisma
   */
  private mapCategoriaParaPrisma(categoria: CategoriaDificuldade): PrismaCategoriaDificuldade {
    return categoria as unknown as PrismaCategoriaDificuldade;
  }

  /**
   * Mapear categoria do Prisma para categoria de domínio
   */
  private mapCategoriaFromPrisma(categoria: PrismaCategoriaDificuldade): CategoriaDificuldade {
    return categoria as unknown as CategoriaDificuldade;
  }

  /**
   * Mapear tipo de dificuldade para categoria do Prisma
   */
  private mapTipoToCategoria(tipo: TipoDificuldade): PrismaCategoriaDificuldade {
    return mapCategoriaDificuldadeToPrisma(mapTipoDificuldadeToCategoria(tipo));
  }

  /**
   * Determinar o tipo com base na categoria
   */
  private obterTipoDaCategoria(categoria: string): TipoDificuldade {
    switch (categoria as unknown as PrismaCategoriaDificuldade) {
      case PrismaCategoriaDificuldade.LEVE:
        return TipoDificuldade.LEITURA;
      case PrismaCategoriaDificuldade.MODERADA:
        return TipoDificuldade.COMPORTAMENTAL;
      case PrismaCategoriaDificuldade.GRAVE:
        return TipoDificuldade.PRIMARIA;
      default:
        return TipoDificuldade.OUTRO;
    }
  }
}
