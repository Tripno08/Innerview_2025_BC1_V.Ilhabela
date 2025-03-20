import {
  Status as PrismaStatus,
  CargoUsuario as PrismaCargoUsuario,
  Prisma,
  PrismaClient,
} from '@prisma/client';
import { Status, CargoUsuario } from '@shared/enums';
import {
  TipoDificuldade,
  CategoriaDificuldade,
} from '@domain/entities/dificuldade-aprendizagem.entity';
import { TipoIntervencao } from '@domain/entities/intervencao.entity';

/**
 * Este arquivo define os mapeamentos de tipos entre os enums locais da aplicação
 * e os enums gerados pelo Prisma, facilitando a interoperabilidade entre eles.
 */

// Declara o namespace para Prisma
declare namespace PrismaTypes {
  // Define relações de tipo entre os enums locais e do Prisma
  type StatusMap = { [K in Status]: PrismaStatus };
  type CargoUsuarioMap = { [K in CargoUsuario]: PrismaCargoUsuario };

  // Mapeamentos para tipos específicos do aplicativo
  type TipoDificuldadeMap = { [K in TipoDificuldade]: string };
  type CategoriaDificuldadeMap = { [K in CategoriaDificuldade]: string };
  type TipoIntervencaoMap = { [K in TipoIntervencao]: string };

  // Define tipos de composite keys que o Prisma usa
  interface EstudanteDificuldadeWhereUniqueInput
    extends Prisma.EstudanteDificuldadeWhereUniqueInput {
    estudanteId_dificuldadeId?: {
      estudanteId: string;
      dificuldadeId: string;
    };
  }

  interface MembroEquipeWhereUniqueInput extends Prisma.MembroEquipeWhereUniqueInput {
    equipeId_usuarioId?: {
      equipeId: string;
      usuarioId: string;
    };
  }

  interface EstudanteEquipeWhereUniqueInput extends Prisma.EstudanteEquipeWhereUniqueInput {
    equipeId_estudanteId?: {
      equipeId: string;
      estudanteId: string;
    };
  }

  // Extensões para EntidadeDificuldade
  interface DificuldadeAprendizagemWhereInput extends Prisma.DificuldadeAprendizagemWhereInput {
    tipo?: string;
    categoria?: string;
  }

  // Extensões para campos opcionais em modelos
  interface EstudanteDificuldadeCreateInput extends Prisma.EstudanteDificuldadeCreateInput {
    estudanteId: string;
    dificuldadeId: string;
    tipo?: string;
    observacoes?: string;
  }

  interface MembroEquipeCreateInput extends Prisma.MembroEquipeCreateInput {
    equipeId: string;
    usuarioId: string;
    funcao?: string;
  }

  // Tipos para modelos estendidos
  interface EquipeProps {
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

  // Extensões para campos do repositório de intervenção
  interface IntervencaoUpdateInput extends Prisma.IntervencaoUpdateInput {
    progresso?: number;
    dataFim?: Date;
  }

  // Mapeamento para enum Status
  const StatusMap: StatusMap = {
    [Status.ATIVO]: PrismaStatus.ATIVO,
    [Status.PENDENTE]: PrismaStatus.PENDENTE,
    [Status.AGENDADO]: PrismaStatus.AGENDADO,
    [Status.EM_ANDAMENTO]: PrismaStatus.EM_ANDAMENTO,
    [Status.CONCLUIDO]: PrismaStatus.CONCLUIDO,
    [Status.CANCELADO]: PrismaStatus.CANCELADO,
  };

  // Mapeamento para enum CargoUsuario
  const CargoUsuarioMap: CargoUsuarioMap = {
    [CargoUsuario.ADMIN]: PrismaCargoUsuario.ADMIN,
    [CargoUsuario.PROFESSOR]: PrismaCargoUsuario.PROFESSOR,
    [CargoUsuario.ESPECIALISTA]: PrismaCargoUsuario.ESPECIALISTA,
    [CargoUsuario.COORDENADOR]: PrismaCargoUsuario.COORDENADOR,
    [CargoUsuario.DIRETOR]: PrismaCargoUsuario.DIRETOR,
    [CargoUsuario.ADMINISTRADOR]: PrismaCargoUsuario.ADMINISTRADOR,
  };

  // Extensão para o modelo CatalogoIntervencao
  interface CatalogoIntervencaoModel {
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

  // Tipos para parâmetros de operações do catalogoIntervencao
  interface CatalogoIntervencaoFindManyArgs {
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

  interface CatalogoIntervencaoFindUniqueArgs {
    where: {
      id: string;
    };
    include?: Record<string, boolean>;
  }

  interface CatalogoIntervencaoCreateArgs {
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

  interface CatalogoIntervencaoUpdateArgs {
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

  interface CatalogoIntervencaoDeleteArgs {
    where: {
      id: string;
    };
    include?: Record<string, boolean>;
  }

  // Extensão do PrismaClient com o modelo catalogoIntervencao
  interface ExtendedPrismaClient extends PrismaClient {
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

  // Extensão do TransactionClient com o modelo catalogoIntervencao
  interface ExtendedTransactionClient extends Prisma.TransactionClient {
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
}

export = PrismaTypes;
