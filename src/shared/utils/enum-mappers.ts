import { Status, CargoUsuario, Prioridade } from '@shared/enums';
import { Status as PrismaStatus, CargoUsuario as PrismaCargoUsuario } from '@prisma/client';
import PrismaTypes from '../../types/prisma';

/**
 * Funções utilitárias para mapear entre enums do Prisma e enums locais da aplicação
 */

/**
 * Mapeia um Status local para o equivalente no Prisma
 */
export function mapLocalStatusToPrisma(status: Status | string): PrismaStatus {
  // Se for string, convert para o enum local primeiro
  const localStatus = typeof status === 'string' ? (status as Status) : status;
  return PrismaTypes.StatusMap[localStatus] || PrismaStatus.PENDENTE;
}

/**
 * Mapeia um Status do Prisma para o equivalente local
 */
export function mapPrismaStatusToLocal(prismaStatus: PrismaStatus | string): Status {
  const prismaStatusValue =
    typeof prismaStatus === 'string' ? (prismaStatus as PrismaStatus) : prismaStatus;
  // Encontra a chave do enum local que corresponde ao valor do Prisma
  for (const [key, value] of Object.entries(PrismaTypes.StatusMap)) {
    if (value === prismaStatusValue) {
      return key as Status;
    }
  }
  return Status.PENDENTE; // valor padrão
}

/**
 * Mapeia um CargoUsuario local para o equivalente no Prisma
 */
export function mapLocalCargoToPrisma(cargo: CargoUsuario | string): PrismaCargoUsuario {
  // Se for string, convert para o enum local primeiro
  const localCargo = typeof cargo === 'string' ? (cargo as CargoUsuario) : cargo;
  return PrismaTypes.CargoUsuarioMap[localCargo] || PrismaCargoUsuario.PROFESSOR;
}

/**
 * Mapeia um CargoUsuario do Prisma para o equivalente local
 */
export function mapPrismaCargoToLocal(prismaCargo: PrismaCargoUsuario | string): CargoUsuario {
  const prismaCargoValue =
    typeof prismaCargo === 'string' ? (prismaCargo as PrismaCargoUsuario) : prismaCargo;
  // Encontra a chave do enum local que corresponde ao valor do Prisma
  for (const [key, value] of Object.entries(PrismaTypes.CargoUsuarioMap)) {
    if (value === prismaCargoValue) {
      return key as CargoUsuario;
    }
  }
  return CargoUsuario.PROFESSOR; // valor padrão
}

/**
 * Mapeia um valor de Prioridade local para o formato usado pelo Prisma
 */
export function mapLocalPrioridadeToPrisma(prioridade: Prioridade): string {
  return prioridade.toString();
}

/**
 * Mapeia um valor de Prioridade do Prisma para o formato usado localmente
 */
export function mapPrismaPrioridadeToLocal(prioridade: string): Prioridade {
  return prioridade as Prioridade;
}
