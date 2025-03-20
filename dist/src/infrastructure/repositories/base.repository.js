"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
const client_1 = require("@prisma/client");
const unit_of_work_1 = require("@infrastructure/database/unit-of-work");
const app_error_1 = require("@shared/errors/app-error");
class BaseRepository {
    unitOfWork;
    constructor(unitOfWork) {
        this.unitOfWork = unitOfWork || new unit_of_work_1.UnitOfWork();
    }
    handlePrismaError(error, entityName) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                throw new app_error_1.AppError(`${entityName} não encontrado(a)`, 404, `${entityName.toUpperCase()}_NOT_FOUND`);
            }
            if (error.code === 'P2002') {
                const field = error.meta?.target ? error.meta.target[0] : 'campo';
                throw new app_error_1.AppError(`${entityName} com ${field} já existe`, 409, `${entityName.toUpperCase()}_ALREADY_EXISTS`);
            }
            if (error.code === 'P2003') {
                throw new app_error_1.AppError(`Relacionamento inválido em ${entityName}`, 400, `INVALID_${entityName.toUpperCase()}_RELATIONSHIP`);
            }
        }
        if (error instanceof Error) {
            throw new app_error_1.AppError(error.message, 500, `${entityName.toUpperCase()}_ERROR`);
        }
        throw new app_error_1.AppError(`Erro ao processar ${entityName}`, 500, `${entityName.toUpperCase()}_ERROR`);
    }
    get prisma() {
        return this.unitOfWork.prismaClient;
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=base.repository.js.map