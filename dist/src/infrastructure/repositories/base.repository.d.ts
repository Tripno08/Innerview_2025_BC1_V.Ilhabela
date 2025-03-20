import { PrismaClient } from '@prisma/client';
import { UnitOfWork } from '@infrastructure/database/unit-of-work';
import { IBaseRepository } from '@domain/repositories/base-repository.interface';
export declare abstract class BaseRepository<T, ID = string> implements IBaseRepository<T, ID> {
    protected unitOfWork: UnitOfWork;
    constructor(unitOfWork?: UnitOfWork);
    abstract findAll(): Promise<T[]>;
    abstract findById(id: ID): Promise<T | null>;
    abstract create(data: Partial<Omit<T, 'id'>>): Promise<T>;
    abstract update(id: ID, data: Partial<Omit<T, 'id'>>): Promise<T>;
    abstract delete(id: ID): Promise<void>;
    protected handlePrismaError(error: unknown, entityName: string): never;
    protected get prisma(): PrismaClient;
}
