import { IDificuldadeRepository } from '../../domain/repositories/dificuldade-repository.interface';
import {
  DificuldadeAprendizagem,
  TipoDificuldade,
  CategoriaDificuldade,
} from '../../domain/entities/dificuldade-aprendizagem.entity';
import { BaseRepository } from './base.repository';
import { Status } from '../../shared/enums';
import { mapStatusToPrisma, mapStatusFromPrisma } from '../../shared/utils/enum-mappers';
import { injectable } from 'tsyringe';
import { UnitOfWork } from '../database/unit-of-work';
import { Prisma, CategoriaDificuldade as PrismaCategoriaDificuldade } from '@prisma/client';

/**
 * Tipo estendido para incluir os campos adicionados no schema
 */
type DificuldadeAprendizagemWithMetadata = Prisma.DificuldadeAprendizagemCreateInput & {
  metadados?: Record<string, string>;
  status?: any;
};

/**
 * Implementação do repositório de dificuldades de aprendizagem utilizando Prisma
 */
@injectable()
export class DificuldadeRepository
  extends BaseRepository<DificuldadeAprendizagem>
  implements IDificuldadeRepository
{
  constructor(unitOfWork: UnitOfWork) {
    super(unitOfWork);
  }

  /**
   * Encontrar todas as dificuldades
   */
  async findAll(): Promise<DificuldadeAprendizagem[]> {
    try {
      const dificuldades = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.dificuldadeAprendizagem.findMany({
          orderBy: {
            nome: 'asc',
          },
        }),
      );

      return (dificuldades as any[]).map((d) => this.mapToDificuldade(d));
    } catch (error) {
      this.handlePrismaError(error, 'Dificuldade');
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

      return this.mapToDificuldade(dificuldade as Record<string, unknown>);
    } catch (error) {
      this.handlePrismaError(error, 'Dificuldade');
    }
  }

  /**
   * Encontrar dificuldades por tipo
   */
  async findByTipo(tipo: TipoDificuldade): Promise<DificuldadeAprendizagem[]> {
    try {
      // Usar filtro customizado se o schema de Prisma não tiver campo 'tipo'
      const dificuldades = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.dificuldadeAprendizagem.findMany({
          where: {
            // Filtragem customizada usando propriedades existentes no schema
            // ou outros critérios dependendo de como os tipos são armazenados
            categoria: {
              equals: this.mapTipoToCategoria(tipo),
            },
          },
          orderBy: {
            nome: 'asc',
          },
        }),
      );

      return (dificuldades as any[]).map((d) => this.mapToDificuldade(d));
    } catch (error) {
      this.handlePrismaError(error, 'Dificuldade');
    }
  }

  /**
   * Encontrar dificuldades por categoria
   */
  async findByCategoria(categoria: CategoriaDificuldade): Promise<DificuldadeAprendizagem[]> {
    try {
      const dificuldades = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.dificuldadeAprendizagem.findMany({
          where: {
            categoria: this.mapCategoriaParaPrisma(categoria),
          },
          orderBy: {
            nome: 'asc',
          },
        }),
      );

      return (dificuldades as any[]).map((d) => this.mapToDificuldade(d));
    } catch (error) {
      this.handlePrismaError(error, 'Dificuldade');
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

      return (associacoes as any[]).map((assoc) => this.mapToDificuldade(assoc.dificuldade));
    } catch (error) {
      this.handlePrismaError(error, 'Dificuldade');
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

      // Criar dados compatíveis com o schema do Prisma
      const createData: DificuldadeAprendizagemWithMetadata = {
        nome: String(nome),
        descricao: descricao ? String(descricao) : '',
        sintomas: sintomas ? String(sintomas) : '',
        categoria: this.mapCategoriaParaPrisma(categoria as CategoriaDificuldade),
        status: mapStatusToPrisma((statusInput as Status) || Status.ATIVO),
      };

      // Adicionar metadados para armazenar o tipo se não existir no schema
      if (tipo) {
        createData.metadados = {
          tipo: String(tipo),
        };
      }

      const novaDificuldade = await this.unitOfWork.withTransaction(async (prisma) => {
        return await prisma.dificuldadeAprendizagem.create({
          data: createData,
        });
      });

      return this.mapToDificuldade(novaDificuldade);
    } catch (error) {
      this.handlePrismaError(error, 'Dificuldade');
    }
  }

  /**
   * Atualizar uma dificuldade existente
   */
  async update(id: string, data: Record<string, unknown>): Promise<DificuldadeAprendizagem> {
    try {
      const { statusInput, ...outrosDados } = data;

      // Construir objeto de update
      const updateData: Record<string, unknown> = { ...outrosDados };
      if (statusInput) {
        updateData.status = mapStatusToPrisma(statusInput as Status);
      }

      // Remover campos que não existem no schema do Prisma
      if ('tipo' in updateData) {
        // Se o schema não tiver 'tipo', mas tiver 'metadados', armazenar lá
        const metadadosObj = {
          tipo: String(updateData.tipo),
        };

        updateData.metadados = metadadosObj;
        delete updateData.tipo;
      }

      const dificuldadeAtualizada = await this.unitOfWork.withTransaction(async (prisma) => {
        return await prisma.dificuldadeAprendizagem.update({
          where: { id },
          data: updateData as Prisma.DificuldadeAprendizagemUpdateInput,
        });
      });

      return this.mapToDificuldade(dificuldadeAtualizada);
    } catch (error) {
      this.handlePrismaError(error, 'Dificuldade');
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
      this.handlePrismaError(error, 'Dificuldade');
    }
  }

  /**
   * Converter dados do Prisma para a entidade de domínio
   */
  private mapToDificuldade(dificuldadePrisma: Record<string, unknown>): DificuldadeAprendizagem {
    // Extrair tipo do campo metadados se não houver campo tipo direto
    let tipo = dificuldadePrisma.tipo as string;
    if (!tipo && dificuldadePrisma.metadados) {
      const metadados = dificuldadePrisma.metadados as Record<string, unknown>;
      tipo = metadados.tipo as string;
    }

    return DificuldadeAprendizagem.restaurar({
      id: dificuldadePrisma.id as string,
      nome: dificuldadePrisma.nome as string,
      descricao: dificuldadePrisma.descricao as string,
      sintomas: (dificuldadePrisma.sintomas as string) || '',
      tipo:
        (tipo as TipoDificuldade) ||
        this.obterTipoDaCategoria(dificuldadePrisma.categoria as string),
      categoria: dificuldadePrisma.categoria as string as CategoriaDificuldade,
      status: mapStatusFromPrisma(dificuldadePrisma.status as Status),
      criadoEm: this.parseDate(dificuldadePrisma.criadoEm),
      atualizadoEm: this.parseDate(dificuldadePrisma.atualizadoEm),
    });
  }

  private parseDate(value: unknown): Date {
    if (value instanceof Date) return value;
    if (typeof value === 'string' || typeof value === 'number') return new Date(value);
    return new Date();
  }

  private mapCategoriaParaPrisma(categoria: CategoriaDificuldade): PrismaCategoriaDificuldade {
    return categoria as unknown as PrismaCategoriaDificuldade;
  }

  private mapTipoToCategoria(tipo: TipoDificuldade): PrismaCategoriaDificuldade {
    // Mapeamento entre TipoDificuldade e CategoriaDificuldade do Prisma
    switch (tipo) {
      case TipoDificuldade.LEITURA:
        return 'LEITURA' as PrismaCategoriaDificuldade;
      case TipoDificuldade.ESCRITA:
        return 'ESCRITA' as PrismaCategoriaDificuldade;
      case TipoDificuldade.MATEMATICA:
        return 'MATEMATICA' as PrismaCategoriaDificuldade;
      case TipoDificuldade.COMPORTAMENTAL:
        return 'COMPORTAMENTO' as PrismaCategoriaDificuldade;
      case TipoDificuldade.ATENCAO:
        return 'ATENCAO' as PrismaCategoriaDificuldade;
      case TipoDificuldade.SOCIAL:
        return 'COMUNICACAO' as PrismaCategoriaDificuldade;
      case TipoDificuldade.NEUROMOTORA:
        return 'COORDENACAO_MOTORA' as PrismaCategoriaDificuldade;
      default:
        return 'OUTRO' as PrismaCategoriaDificuldade;
    }
  }

  private obterTipoDaCategoria(categoria: string): TipoDificuldade {
    // Inferir o tipo a partir da categoria
    switch (categoria) {
      case 'LEITURA':
        return TipoDificuldade.LEITURA;
      case 'ESCRITA':
        return TipoDificuldade.ESCRITA;
      case 'MATEMATICA':
        return TipoDificuldade.MATEMATICA;
      case 'COMPORTAMENTO':
        return TipoDificuldade.COMPORTAMENTAL;
      case 'ATENCAO':
        return TipoDificuldade.ATENCAO;
      case 'COMUNICACAO':
        return TipoDificuldade.SOCIAL;
      case 'COORDENACAO_MOTORA':
        return TipoDificuldade.NEUROMOTORA;
      default:
        return TipoDificuldade.OUTRO;
    }
  }
}
