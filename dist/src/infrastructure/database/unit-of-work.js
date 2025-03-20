"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitOfWork = void 0;
const client_1 = require("@prisma/client");
const prisma_client_1 = require("./prisma-client");
const logger_1 = require("@shared/logger");
class UnitOfWork {
    _prismaClient;
    constructor() {
        this._prismaClient = prisma_client_1.prisma;
    }
    async withTransaction(operation) {
        try {
            const result = await this._prismaClient.$transaction(async (tx) => {
                return await operation(tx);
            }, {
                maxWait: 5000,
                timeout: 10000,
                isolationLevel: client_1.Prisma.TransactionIsolationLevel.ReadCommitted,
            });
            return result;
        }
        catch (error) {
            logger_1.logger.error(`Erro na transação: ${error.message}`);
            throw error;
        }
    }
    async withoutTransaction(operation) {
        try {
            return await operation(this._prismaClient);
        }
        catch (error) {
            logger_1.logger.error(`Erro na operação: ${error.message}`);
            throw error;
        }
    }
    get prismaClient() {
        return this._prismaClient;
    }
}
exports.UnitOfWork = UnitOfWork;
//# sourceMappingURL=unit-of-work.js.map