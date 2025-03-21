import { Status, CargoUsuario, Prioridade } from '../enums';
import { Status as PrismaStatus, CargoUsuario as PrismaCargoUsuario } from '@prisma/client';

/**
 * Funções utilitárias para mapear entre enums do Prisma e enums locais da aplicação
 */

// Mapeamento para o enum Status
export const StatusMap: Record<Status, string> = {
  [Status.PENDENTE]: 'PENDENTE',
  [Status.AGENDADO]: 'AGENDADO',
  [Status.ATIVO]: 'ATIVO',
  [Status.EM_ANDAMENTO]: 'EM_ANDAMENTO',
  [Status.CONCLUIDO]: 'CONCLUIDO',
  [Status.CANCELADO]: 'CANCELADO',
};

// Mapeamento para o enum CargoUsuario
export const CargoUsuarioMap: Record<CargoUsuario, string> = {
  [CargoUsuario.ADMIN]: 'ADMIN',
  [CargoUsuario.PROFESSOR]: 'PROFESSOR',
  [CargoUsuario.ESPECIALISTA]: 'ESPECIALISTA',
  [CargoUsuario.COORDENADOR]: 'COORDENADOR',
  [CargoUsuario.DIRETOR]: 'DIRETOR',
  [CargoUsuario.ADMINISTRADOR]: 'ADMINISTRADOR',
};

/**
 * Mapeia um Status do sistema para o formato do Prisma
 * Aceita tanto o enum Status quanto uma string
 */
export function mapStatusToPrisma(status: Status | string): PrismaStatus {
  // Se for uma string, tenta converter para enum primeiro
  if (typeof status === 'string') {
    // Verificar se a string corresponde a um valor válido do enum
    const isValidEnum = Object.values(Status).includes(status as Status);
    if (isValidEnum) {
      return status as PrismaStatus;
    }
    // Se não for um valor válido, retorna o padrão
    return 'PENDENTE' as PrismaStatus;
  }

  // Se for um enum, usa o mapeamento
  return (StatusMap[status] as PrismaStatus) || ('PENDENTE' as PrismaStatus);
}

/**
 * Mapeia um Status do Prisma para o formato do sistema
 * Aceita tanto PrismaStatus quanto uma string
 */
export function mapStatusFromPrisma(status: PrismaStatus | string): Status {
  const statusStr = String(status);

  // Verificar se a string corresponde diretamente a um valor do enum Status
  if (Object.values(Status).includes(statusStr as Status)) {
    return statusStr as Status;
  }

  // Caso contrário, busca nos mapeamentos
  const entries = Object.entries(StatusMap);
  const found = entries.find(([_, value]) => value === statusStr);
  return found ? (found[0] as Status) : Status.PENDENTE;
}

/**
 * Mapeia um Cargo do sistema para o formato do Prisma
 * Aceita tanto o enum CargoUsuario quanto uma string
 */
export function mapCargoToPrisma(cargo: CargoUsuario | string): PrismaCargoUsuario {
  // Se for uma string, tenta converter para enum primeiro
  if (typeof cargo === 'string') {
    // Verificar se a string corresponde a um valor válido do enum
    const isValidEnum = Object.values(CargoUsuario).includes(cargo as CargoUsuario);
    if (isValidEnum) {
      return cargo as PrismaCargoUsuario;
    }
    // Se não for um valor válido, retorna o padrão
    return 'ADMIN' as PrismaCargoUsuario;
  }

  // Se for um enum, usa o mapeamento
  return (CargoUsuarioMap[cargo] as PrismaCargoUsuario) || ('ADMIN' as PrismaCargoUsuario);
}

/**
 * Mapeia um Cargo do Prisma para o formato do sistema
 * Aceita tanto PrismaCargoUsuario quanto uma string
 */
export function mapCargoFromPrisma(cargo: PrismaCargoUsuario | string): CargoUsuario {
  const cargoStr = String(cargo);

  // Verificar se a string corresponde diretamente a um valor do enum CargoUsuario
  if (Object.values(CargoUsuario).includes(cargoStr as CargoUsuario)) {
    return cargoStr as CargoUsuario;
  }

  // Caso contrário, busca nos mapeamentos
  const entries = Object.entries(CargoUsuarioMap);
  const found = entries.find(([_, value]) => value === cargoStr);
  return found ? (found[0] as CargoUsuario) : CargoUsuario.ADMIN;
}

/**
 * Mapeia uma Prioridade para o formato do Prisma
 * Aceita tanto o enum Prioridade quanto uma string
 */
export function mapPrioridadeToPrisma(prioridade: Prioridade | string): string {
  // Se for uma string, tenta converter para enum primeiro
  if (typeof prioridade === 'string') {
    // Verificar se a string corresponde a um valor válido do enum
    const isValidEnum = Object.values(Prioridade).includes(prioridade as Prioridade);
    if (isValidEnum) {
      return prioridade;
    }
  }

  // Se for um enum ou uma string não reconhecida, usa o switch
  switch (prioridade) {
    case Prioridade.BAIXA:
      return 'BAIXA';
    case Prioridade.MEDIA:
      return 'MEDIA';
    case Prioridade.ALTA:
      return 'ALTA';
    case Prioridade.URGENTE:
      return 'URGENTE';
    default:
      return 'MEDIA';
  }
}

/**
 * Mapeia uma Prioridade do Prisma para o formato do sistema
 * Aceita uma string
 */
export function mapPrioridadeFromPrisma(prioridade: string): Prioridade {
  // Verificar se a string corresponde diretamente a um valor do enum Prioridade
  if (Object.values(Prioridade).includes(prioridade as Prioridade)) {
    return prioridade as Prioridade;
  }

  // Caso contrário, usa o switch
  switch (prioridade) {
    case 'BAIXA':
      return Prioridade.BAIXA;
    case 'MEDIA':
      return Prioridade.MEDIA;
    case 'ALTA':
      return Prioridade.ALTA;
    case 'URGENTE':
      return Prioridade.URGENTE;
    default:
      return Prioridade.MEDIA;
  }
}
