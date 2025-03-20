import { IDificuldadeRepository } from '@domain/repositories/dificuldade-repository.interface';
import {
  DificuldadeAprendizagem,
  TipoDificuldade,
  CategoriaDificuldade,
} from '@domain/entities/dificuldade-aprendizagem.entity';
import { BaseRepository } from './base.repository';
import { Status } from '@shared/enums';
import { mapLocalStatusToPrisma, mapPrismaStatusToLocal } from '@shared/utils/enum-mappers';
import { injectable } from 'tsyringe';
import { UnitOfWork } from '../database/unit-of-work';

/**
 * Interface para os dados retornados do Prisma
 */
interface DificuldadeAprendizagemData {
  id: string;
  nome: string;
  descricao: string;
  sintomas?: string | null;
  tipo: string;
  categoria: string;
  status: string;
  criadoEm: Date;
  atualizadoEm: Date;
}

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
   * Encontrar todas as dificuldades de aprendizagem
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

      return dificuldades.map((d) => this.mapToDificuldade(d));
    } catch (error) {
      this.handlePrismaError(error, 'Dificuldade');
    }
  }

  /**
   * Encontrar por ID
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
      this.handlePrismaError(error, 'Dificuldade');
    }
  }

  /**
   * Encontrar por tipo
   */
  async findByTipo(tipo: TipoDificuldade): Promise<DificuldadeAprendizagem[]> {
    try {
      // Mapeamento entre TipoDificuldade do domínio e CategoriaDificuldade do Prisma
      let categoria: string;

      // Converter o tipo para a categoria correspondente no banco de dados
      switch (tipo) {
        case TipoDificuldade.LEITURA:
          categoria = 'LEITURA';
          break;
        case TipoDificuldade.ESCRITA:
          categoria = 'ESCRITA';
          break;
        case TipoDificuldade.MATEMATICA:
          categoria = 'MATEMATICA';
          break;
        case TipoDificuldade.COMPORTAMENTAL:
          categoria = 'COMPORTAMENTO';
          break;
        case TipoDificuldade.ATENCAO:
          categoria = 'ATENCAO';
          break;
        case TipoDificuldade.SOCIAL:
          categoria = 'COMUNICACAO';
          break;
        case TipoDificuldade.NEUROMOTORA:
          categoria = 'COORDENACAO_MOTORA';
          break;
        default:
          categoria = 'OUTRO';
      }

      const dificuldades = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.dificuldadeAprendizagem.findMany({
          where: {
            categoria: categoria as any,
          },
          orderBy: {
            nome: 'asc',
          },
        }),
      );

      return dificuldades.map((d) => this.mapToDificuldade(d));
    } catch (error) {
      this.handlePrismaError(error, 'Dificuldade');
    }
  }

  /**
   * Encontrar dificuldades associadas a um estudante
   */
  async findByEstudanteId(estudanteId: string): Promise<DificuldadeAprendizagem[]> {
    try {
      const dificuldades = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.estudanteDificuldade.findMany({
          where: { estudanteId },
          include: {
            dificuldade: true,
          },
        }),
      );

      return dificuldades.map((rel) => this.mapToDificuldade(rel.dificuldade));
    } catch (error) {
      this.handlePrismaError(error, 'Dificuldade');
    }
  }

  /**
   * Criar uma nova dificuldade
   */
  async create(data: Record<string, unknown>): Promise<DificuldadeAprendizagem> {
    try {
      const dificuldade = await this.unitOfWork.withTransaction(async (prisma) => {
        // Extrair e tipar corretamente os campos necessários
        const {
          nome,
          descricao,
          sintomas,
          tipo,
          categoria,
          status: statusInput,
          ...restData
        } = data as {
          nome: string;
          descricao: string;
          sintomas?: string;
          tipo: TipoDificuldade;
          categoria: CategoriaDificuldade;
          status?: Status;
        };

        // Converter enum para string para o banco
        const createData = {
          nome,
          descricao,
          sintomas: sintomas || '',
          tipo: String(tipo),
          categoria: String(categoria),
          status: mapLocalStatusToPrisma(statusInput || Status.ATIVO),
          ...restData,
        };

        return await prisma.dificuldadeAprendizagem.create({
          data: createData as any, // Usando any para contornar a incompatibilidade de tipos
        });
      });

      return this.mapToDificuldade(dificuldade);
    } catch (error) {
      this.handlePrismaError(error, 'Dificuldade');
    }
  }

  /**
   * Atualizar uma dificuldade
   */
  async update(id: string, data: Record<string, unknown>): Promise<DificuldadeAprendizagem> {
    try {
      const dificuldade = await this.unitOfWork.withTransaction(async (prisma) => {
        // Extrair status se existir para mapeamento correto
        const { status: statusInput, ...outrosDados } = data as { status?: string };

        // Montar objeto de atualização tipado
        const updateData: Record<string, unknown> = { ...outrosDados };
        if (statusInput) {
          updateData.status = mapLocalStatusToPrisma(statusInput);
        }

        return await prisma.dificuldadeAprendizagem.update({
          where: { id },
          data: updateData,
        });
      });

      return this.mapToDificuldade(dificuldade);
    } catch (error) {
      this.handlePrismaError(error, 'Dificuldade');
    }
  }

  /**
   * Remover uma dificuldade
   */
  async delete(id: string): Promise<void> {
    try {
      await this.unitOfWork.withTransaction(async (prisma) => {
        // Remover associações com estudantes primeiro
        await prisma.estudanteDificuldade.deleteMany({
          where: { dificuldadeId: id },
        });

        // Remover a dificuldade
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
    return DificuldadeAprendizagem.restaurar({
      id: dificuldadePrisma.id as string,
      nome: dificuldadePrisma.nome as string,
      descricao: dificuldadePrisma.descricao as string,
      sintomas: (dificuldadePrisma.sintomas as string) || '',
      tipo: dificuldadePrisma.tipo as string as TipoDificuldade,
      categoria: dificuldadePrisma.categoria as string as CategoriaDificuldade,
      status: mapPrismaStatusToLocal(dificuldadePrisma.status as string),
      criadoEm: this.parseDate(dificuldadePrisma.criadoEm),
      atualizadoEm: this.parseDate(dificuldadePrisma.atualizadoEm),
    });
  }

  private parseDate(value: unknown): Date {
    if (value instanceof Date) return value;
    if (typeof value === 'string' || typeof value === 'number') return new Date(value);
    return new Date();
  }
}
