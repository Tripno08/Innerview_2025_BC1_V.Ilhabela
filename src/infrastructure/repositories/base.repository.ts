import { PrismaClient, Prisma } from '@prisma/client';
import { UnitOfWork } from '@infrastructure/database/unit-of-work';
import { AppError } from '@shared/errors/app-error';
import { IBaseRepository } from '@domain/repositories/base-repository.interface';

/**
 * Classe base para todos os repositórios Prisma
 */
export abstract class BaseRepository<T, ID = string> implements IBaseRepository<T, ID> {
  protected unitOfWork: UnitOfWork;

  constructor(unitOfWork?: UnitOfWork) {
    this.unitOfWork = unitOfWork || new UnitOfWork();
  }

  /**
   * Métodos abstratos a serem implementados pelas classes que herdam
   */
  abstract findAll(): Promise<T[]>;
  abstract findById(id: ID): Promise<T | null>;
  abstract create(data: Partial<Omit<T, 'id'>>): Promise<T>;
  abstract update(id: ID, data: Partial<Omit<T, 'id'>>): Promise<T>;
  abstract delete(id: ID): Promise<void>;

  /**
   * Método para lidar com erros do Prisma e convertê-los em AppError
   */
  protected handlePrismaError(error: unknown, entityName: string): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Erro de registro não encontrado
      if (error.code === 'P2025') {
        throw new AppError(
          `${entityName} não encontrado(a)`,
          404,
          `${entityName.toUpperCase()}_NOT_FOUND`,
        );
      }

      // Erro de violação de chave única
      if (error.code === 'P2002') {
        const field = error.meta?.target ? (error.meta.target as string[])[0] : 'campo';
        throw new AppError(
          `${entityName} com ${field} já existe`,
          409,
          `${entityName.toUpperCase()}_ALREADY_EXISTS`,
        );
      }

      // Erro de violação de chave estrangeira
      if (error.code === 'P2003') {
        throw new AppError(
          `Relacionamento inválido em ${entityName}`,
          400,
          `INVALID_${entityName.toUpperCase()}_RELATIONSHIP`,
        );
      }
    }

    // Se não for um erro conhecido do Prisma, repassar o erro original
    if (error instanceof Error) {
      throw new AppError(error.message, 500, `${entityName.toUpperCase()}_ERROR`);
    }

    // Erro genérico
    throw new AppError(`Erro ao processar ${entityName}`, 500, `${entityName.toUpperCase()}_ERROR`);
  }

  /**
   * Obter cliente Prisma para transações ou operações não transacionais
   */
  protected get prisma(): PrismaClient {
    return this.unitOfWork.prismaClient;
  }
}
