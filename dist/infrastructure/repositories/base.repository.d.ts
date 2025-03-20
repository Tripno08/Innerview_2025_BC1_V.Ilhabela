import { PrismaClient } from '@prisma/client';
import { UnitOfWork } from '@infrastructure/database/unit-of-work';
export declare abstract class BaseRepository<T> {
    protected unitOfWork: UnitOfWork;
    constructor();
    protected handlePrismaError(error: unknown, entityName: string): never;
    protected get prisma(): PrismaClient;
}
