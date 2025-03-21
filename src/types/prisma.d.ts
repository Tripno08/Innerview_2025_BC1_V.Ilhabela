import {
  Status as PrismaStatus,
  CargoUsuario as PrismaCargoUsuario,
  Prisma,
  PrismaClient,
} from '@prisma/client';
import { Status, CargoUsuario } from '../shared/enums';
import {
  TipoDificuldade,
  CategoriaDificuldade,
} from '../domain/entities/dificuldade-aprendizagem.entity';
import { TipoIntervencao } from '../domain/entities/intervencao.entity';

/**
 * Este arquivo define os mapeamentos de tipos entre os enums locais da aplicação
 * e os enums gerados pelo Prisma, facilitando a interoperabilidade entre eles.
 */

// Define relações de tipo entre os enums locais e do Prisma
export type StatusMap = { [K in Status]: PrismaStatus };
export type CargoUsuarioMap = { [K in CargoUsuario]: PrismaCargoUsuario };

export type TipoDificuldadeMap = { [K in TipoDificuldade]: string };
export type CategoriaDificuldadeMap = { [K in CategoriaDificuldade]: string };
export type TipoIntervencaoMap = { [K in TipoIntervencao]: string };

export interface EstudanteDificuldadeWhereUniqueInput {
  estudanteId_dificuldadeId?: {
    estudanteId: string;
    dificuldadeId: string;
  };
}

export interface MembroEquipeWhereUniqueInput {
  equipeId_usuarioId?: {
    equipeId: string;
    usuarioId: string;
  };
}

export interface EstudanteEquipeWhereUniqueInput {
  equipeId_estudanteId?: {
    equipeId: string;
    estudanteId: string;
  };
}

export interface DificuldadeAprendizagemWhereInput {
  tipo?: string;
  categoria?: string | { equals?: string; in?: string[] };
}

export interface EstudanteDificuldadeCreateInput {
  estudanteId: string;
  dificuldadeId: string;
  tipo?: string;
  observacoes?: string;
}

export interface MembroEquipeCreateInput {
  equipeId: string;
  usuarioId: string;
  funcao?: string;
}

export interface EquipeProps {
  id: string;
  nome: string;
  descricao?: string;
  ativo?: boolean;
  instituicaoId?: string;
  criadoEm?: Date;
  atualizadoEm?: Date;
  membros?: unknown[];
  estudantes?: unknown[];
}

export interface IntervencaoUpdateInput {
  progresso?: number;
  dataFim?: Date;
}

export interface CatalogoIntervencaoModel {
  id: string;
  titulo: string;
  descricao: string;
  tipo: string;
  status: PrismaStatus;
  duracao?: number;
  dificuldadesAlvo?: string[];
  publico?: string[];
  recursos?: string[];
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface CatalogoIntervencaoFindManyArgs {
  where?: {
    id?: string | { equals?: string; in?: string[] };
    tipo?: string | { equals?: string; in?: string[] };
    status?: PrismaStatus | { equals?: PrismaStatus; in?: PrismaStatus[] };
    titulo?: string | { contains?: string };
    descricao?: string | { contains?: string };
  };
  include?: Record<string, boolean>;
  orderBy?: { [key: string]: 'asc' | 'desc' };
  skip?: number;
  take?: number;
}

export interface CatalogoIntervencaoFindUniqueArgs {
  where: {
    id: string;
  };
  include?: Record<string, boolean>;
}

export interface CatalogoIntervencaoCreateArgs {
  data: {
    id?: string;
    titulo: string;
    descricao: string;
    tipo: string;
    status?: PrismaStatus;
    duracao?: number;
    dificuldadesAlvo?: string[];
    publico?: string[];
    recursos?: string[];
  };
  include?: Record<string, boolean>;
}

export interface CatalogoIntervencaoUpdateArgs {
  where: {
    id: string;
  };
  data: {
    titulo?: string;
    descricao?: string;
    tipo?: string;
    status?: PrismaStatus;
    duracao?: number;
    dificuldadesAlvo?: string[];
    publico?: string[];
    recursos?: string[];
  };
  include?: Record<string, boolean>;
}

export interface CatalogoIntervencaoDeleteArgs {
  where: {
    id: string;
  };
  include?: Record<string, boolean>;
}

export interface ExtendedPrismaClient extends PrismaClient {
  catalogoIntervencao: {
    findMany: (args?: CatalogoIntervencaoFindManyArgs) => Promise<CatalogoIntervencaoModel[]>;
    findUnique: (
      args: CatalogoIntervencaoFindUniqueArgs,
    ) => Promise<CatalogoIntervencaoModel | null>;
    create: (args: CatalogoIntervencaoCreateArgs) => Promise<CatalogoIntervencaoModel>;
    update: (args: CatalogoIntervencaoUpdateArgs) => Promise<CatalogoIntervencaoModel>;
    delete: (args: CatalogoIntervencaoDeleteArgs) => Promise<CatalogoIntervencaoModel>;
  };
}

export interface ExtendedTransactionClient extends Prisma.TransactionClient {
  catalogoIntervencao: {
    findMany: (args?: CatalogoIntervencaoFindManyArgs) => Promise<CatalogoIntervencaoModel[]>;
    findUnique: (
      args: CatalogoIntervencaoFindUniqueArgs,
    ) => Promise<CatalogoIntervencaoModel | null>;
    create: (args: CatalogoIntervencaoCreateArgs) => Promise<CatalogoIntervencaoModel>;
    update: (args: CatalogoIntervencaoUpdateArgs) => Promise<CatalogoIntervencaoModel>;
    delete: (args: CatalogoIntervencaoDeleteArgs) => Promise<CatalogoIntervencaoModel>;
  };
}

export default {
  ExtendedPrismaClient,
  ExtendedTransactionClient
};
