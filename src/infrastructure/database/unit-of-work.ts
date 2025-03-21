import { Prisma } from '@prisma/client';
import { prisma } from './prisma-client';
import { logger } from '../../shared/logger';
import * as PrismaTypes from '../../types/prisma';

/**
 * Implementação do padrão Unit of Work para gerenciar transações com Prisma
 */
export class UnitOfWork {
  private _prismaClient: PrismaTypes.ExtendedPrismaClient;

  constructor() {
    this._prismaClient = prisma as unknown as PrismaTypes.ExtendedPrismaClient;
  }

  /**
   * Executa uma operação dentro de uma transação
   * @param operation Função que recebe o cliente Prisma para a transação
   * @returns Resultado da operação
   */
  async withTransaction<T>(
    operation: (prismaClient: PrismaTypes.ExtendedTransactionClient) => Promise<T>,
  ): Promise<T> {
    try {
      // Executar a operação dentro de uma transação
      const result = await this._prismaClient.$transaction(
        async (tx) => {
          return await operation(tx as unknown as PrismaTypes.ExtendedTransactionClient);
        },
        {
          // Configurações da transação
          maxWait: 5000, // 5s máximo de espera
          timeout: 10000, // 10s timeout para transação
          isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted, // Nível de isolamento
        },
      );

      return result;
    } catch (error) {
      logger.error(`Erro na transação: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Executa operações de leitura (sem transação)
   * @param operation Função que recebe o cliente Prisma
   * @returns Resultado da operação
   */
  async withoutTransaction<T>(
    operation: (prismaClient: PrismaTypes.ExtendedPrismaClient) => Promise<T>,
  ): Promise<T> {
    try {
      return await operation(this._prismaClient);
    } catch (error) {
      logger.error(`Erro na operação: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Obtém o cliente Prisma diretamente (sem transação)
   * Use com cuidado, preferindo os métodos withTransaction e withoutTransaction
   */
  get prismaClient(): PrismaTypes.ExtendedPrismaClient {
    return this._prismaClient;
  }
}
