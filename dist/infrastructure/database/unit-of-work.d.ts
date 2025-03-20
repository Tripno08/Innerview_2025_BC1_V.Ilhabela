import { PrismaClient, Prisma } from '@prisma/client';
export declare class UnitOfWork {
    private _prismaClient;
    constructor();
    withTransaction<T>(operation: (prismaClient: Prisma.TransactionClient) => Promise<T>): Promise<T>;
    withoutTransaction<T>(operation: (prismaClient: PrismaClient) => Promise<T>): Promise<T>;
    get prismaClient(): PrismaClient;
}
