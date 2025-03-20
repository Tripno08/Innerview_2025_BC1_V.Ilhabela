import { Status, CargoUsuario, Prioridade } from '@shared/enums';
import { Status as PrismaStatus, CargoUsuario as PrismaCargoUsuario } from '@prisma/client';
export declare function mapLocalStatusToPrisma(status: Status | string): PrismaStatus;
export declare function mapPrismaStatusToLocal(prismaStatus: PrismaStatus | string): Status;
export declare function mapLocalCargoToPrisma(cargo: CargoUsuario | string): PrismaCargoUsuario;
export declare function mapPrismaCargoToLocal(prismaCargo: PrismaCargoUsuario | string): CargoUsuario;
export declare function mapLocalPrioridadeToPrisma(prioridade: Prioridade): string;
export declare function mapPrismaPrioridadeToLocal(prioridade: string): Prioridade;
