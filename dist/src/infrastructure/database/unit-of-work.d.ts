import PrismaTypes from '../../types/prisma';
export declare class UnitOfWork {
    private _prismaClient;
    constructor();
    withTransaction<T>(operation: (prismaClient: PrismaTypes.ExtendedTransactionClient) => Promise<T>): Promise<T>;
    withoutTransaction<T>(operation: (prismaClient: PrismaTypes.ExtendedPrismaClient) => Promise<T>): Promise<T>;
    get prismaClient(): PrismaTypes.ExtendedPrismaClient;
}
