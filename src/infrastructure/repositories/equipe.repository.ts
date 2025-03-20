import {
  IEquipeRepository,
  MembroEquipe,
  EstudanteEquipe,
} from '@domain/repositories/equipe-repository.interface';
import { Equipe, PapelMembro } from '@domain/entities/equipe.entity';
import { BaseRepository } from './base.repository';
import { Status, CargoEquipe } from '@shared/enums';
import { mapLocalStatusToPrisma, mapPrismaStatusToLocal } from '@shared/utils/enum-mappers';
import { AppError } from '@shared/errors/app-error';
import { injectable } from 'tsyringe';
import { UnitOfWork } from '../database/unit-of-work';

/**
 * Interface para os dados de usuário retornados do Prisma
 */
interface UsuarioData {
  id: string;
  email: string;
  nome: string;
  cargo: string;
}

/**
 * Interface para os dados de membro de equipe retornados do Prisma
 */
interface MembroEquipeData {
  id: string;
  equipeId: string;
  usuarioId: string;
  cargo: string;
  funcao?: string | null;
  dataEntrada: Date;
  dataSaida?: Date | null;
  usuario: UsuarioData;
}

/**
 * Interface para os dados de estudante retornados do Prisma
 */
interface EstudanteData {
  id: string;
  nome: string;
  serie?: string | null;
}

/**
 * Interface para os dados de relação estudante-equipe retornados do Prisma
 */
interface EstudanteEquipeData {
  id: string;
  equipeId: string;
  estudanteId: string;
  dataEntrada: Date;
  estudante: EstudanteData;
}

/**
 * Interface para os dados da equipe retornados do Prisma
 */
interface EquipeData {
  id: string;
  nome: string;
  descricao?: string | null;
  ativo: boolean;
  status: string;
  criadoEm: Date;
  atualizadoEm: Date;
  membros: MembroEquipeData[];
  estudantes: EstudanteEquipeData[];
}

/**
 * Implementação do repositório de equipes utilizando Prisma
 */
@injectable()
export class EquipeRepository extends BaseRepository<Equipe> implements IEquipeRepository {
  constructor(unitOfWork: UnitOfWork) {
    super(unitOfWork);
  }

  /**
   * Encontrar todas as equipes
   */
  async findAll(): Promise<Equipe[]> {
    try {
      const equipes = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.equipe.findMany({
          include: this.getEquipeIncludes(),
          orderBy: {
            nome: 'asc',
          },
        }),
      );

      return equipes.map((e) => this.mapToEquipe(e));
    } catch (error) {
      this.handlePrismaError(error, 'Equipe');
    }
  }

  /**
   * Encontrar equipes por ID de usuário (membro da equipe)
   */
  async findByUsuarioId(usuarioId: string): Promise<Equipe[]> {
    try {
      const equipes = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.equipe.findMany({
          where: {
            membros: {
              some: {
                usuarioId,
              },
            },
          },
          include: this.getEquipeIncludes(),
          orderBy: {
            nome: 'asc',
          },
        }),
      );

      return equipes.map((e) => this.mapToEquipe(e));
    } catch (error) {
      this.handlePrismaError(error, 'Equipe');
    }
  }

  /**
   * Encontrar equipe por ID
   */
  async findById(id: string): Promise<Equipe | null> {
    try {
      const equipe = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.equipe.findUnique({
          where: { id },
          include: this.getEquipeIncludes(),
        }),
      );

      if (!equipe) {
        return null;
      }

      return this.mapToEquipe(equipe);
    } catch (error) {
      this.handlePrismaError(error, 'Equipe');
    }
  }

  /**
   * Criar uma nova equipe
   */
  async create(data: Record<string, unknown>): Promise<Equipe> {
    try {
      const equipe = await this.unitOfWork.withTransaction(async (prisma) => {
        // Extrair dados básicos
        const {
          nome,
          descricao,
          status: statusInput,
          ativo,
          ...outrosDados
        } = data as {
          nome: string;
          descricao?: string;
          status?: string;
          ativo?: boolean;
        };

        // Preparar objeto de criação com tipagem correta
        const createData = {
          nome,
          descricao,
          status: mapLocalStatusToPrisma(statusInput || Status.ATIVO),
          ativo: ativo !== undefined ? ativo : true,
          ...outrosDados,
        };

        return await prisma.equipe.create({
          data: createData,
          include: this.getEquipeIncludes(),
        });
      });

      return this.mapToEquipe(equipe);
    } catch (error) {
      this.handlePrismaError(error, 'Equipe');
    }
  }

  /**
   * Atualizar uma equipe existente
   */
  async update(id: string, data: Record<string, unknown>): Promise<Equipe> {
    try {
      const equipe = await this.unitOfWork.withTransaction(async (prisma) => {
        // Extrair status se existir
        const { status: statusInput, ...outrosDados } = data as { status?: string };

        // Preparar dados da atualização
        const updateData: Record<string, unknown> = { ...outrosDados };
        if (statusInput) {
          updateData.status = mapLocalStatusToPrisma(statusInput);
        }

        return await prisma.equipe.update({
          where: { id },
          data: updateData,
          include: this.getEquipeIncludes(),
        });
      });

      return this.mapToEquipe(equipe);
    } catch (error) {
      this.handlePrismaError(error, 'Equipe');
    }
  }

  /**
   * Remover uma equipe
   */
  async delete(id: string): Promise<void> {
    try {
      await this.unitOfWork.withTransaction(async (prisma) => {
        // Primeiro, remover todas as associações

        // Remover membros da equipe
        await prisma.membroEquipe.deleteMany({
          where: { equipeId: id },
        });

        // Remover estudantes da equipe
        await prisma.estudanteEquipe.deleteMany({
          where: { equipeId: id },
        });

        // Remover encaminhamentos da equipe
        await prisma.encaminhamento.updateMany({
          where: { equipeId: id },
          data: { equipeId: null },
        });

        // Remover reuniões da equipe
        await prisma.reuniao.updateMany({
          where: { equipeId: id },
          data: { equipeId: null },
        });

        // Remover a equipe
        await prisma.equipe.delete({
          where: { id },
        });
      });
    } catch (error) {
      this.handlePrismaError(error, 'Equipe');
    }
  }

  /**
   * Verificar se o membro existe na equipe
   */
  private async verificarMembroEquipe(equipeId: string, usuarioId: string) {
    try {
      return await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.membroEquipe.findFirst({
          where: {
            equipeId,
            usuarioId,
          },
        }),
      );
    } catch (error) {
      this.handlePrismaError(error, 'Membro da Equipe');
    }
  }

  /**
   * Adicionar membro à equipe
   */
  async adicionarMembro(equipeId: string, usuarioId: string, funcao?: string): Promise<void> {
    try {
      await this.unitOfWork.withTransaction(async (prisma) => {
        // Verificar se a equipe existe
        const equipe = await prisma.equipe.findUnique({
          where: { id: equipeId },
        });

        if (!equipe) {
          throw new AppError('Equipe não encontrada', 404, 'TEAM_NOT_FOUND');
        }

        // Verificar se o usuário existe
        const usuario = await prisma.usuario.findUnique({
          where: { id: usuarioId },
        });

        if (!usuario) {
          throw new AppError('Usuário não encontrado', 404, 'USER_NOT_FOUND');
        }

        // Verificar se o usuário já está na equipe (usando consulta alternativa)
        const membroExistente = await prisma.membroEquipe.findFirst({
          where: {
            AND: [{ equipeId }, { usuarioId }],
          },
        });

        if (membroExistente) {
          throw new AppError('Usuário já está nesta equipe', 409, 'USER_ALREADY_IN_TEAM');
        }

        // Adicionar o membro usando connect e without type assertion
        await prisma.membroEquipe.create({
          data: {
            equipe: {
              connect: { id: equipeId },
            },
            usuario: {
              connect: { id: usuarioId },
            },
            ...(funcao && { funcao }),
            // Usando um valor de enum válido para CargoEquipe
            cargo: this.mapCargoUsuarioToCargoEquipe(usuario.cargo),
          },
        });
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      this.handlePrismaError(error, 'Membro da Equipe');
    }
  }

  /**
   * Remover membro da equipe
   */
  async removerMembro(equipeId: string, usuarioId: string): Promise<void> {
    try {
      await this.unitOfWork.withTransaction(async (prisma) => {
        // Verificar se a associação existe usando consulta alternativa
        const membro = await prisma.membroEquipe.findFirst({
          where: {
            AND: [{ equipeId }, { usuarioId }],
          },
        });

        if (!membro) {
          throw new AppError('Usuário não está nesta equipe', 404, 'USER_NOT_IN_TEAM');
        }

        // Remover o membro usando o ID encontrado
        await prisma.membroEquipe.delete({
          where: { id: membro.id },
        });
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      this.handlePrismaError(error, 'Membro da Equipe');
    }
  }

  /**
   * Listar membros de uma equipe
   */
  async listarMembros(equipeId: string): Promise<MembroEquipe[]> {
    try {
      const membros = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.membroEquipe.findMany({
          where: { equipeId },
          include: {
            usuario: {
              select: {
                id: true,
                email: true,
                nome: true,
                cargo: true,
              },
            },
          },
        }),
      );

      // Mapear para o tipo MembroEquipe usando o método especializado
      return membros.map((m) => this.mapToMembro(m as Record<string, unknown>));
    } catch (error) {
      this.handlePrismaError(error, 'Membros da Equipe');
    }
  }

  /**
   * Verificar se o estudante existe na equipe
   */
  private async verificarEstudanteEquipe(equipeId: string, estudanteId: string) {
    try {
      return await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.estudanteEquipe.findFirst({
          where: {
            equipeId,
            estudanteId,
          },
        }),
      );
    } catch (error) {
      this.handlePrismaError(error, 'Estudante da Equipe');
    }
  }

  /**
   * Adicionar estudante à equipe
   */
  async adicionarEstudante(equipeId: string, estudanteId: string): Promise<void> {
    try {
      await this.unitOfWork.withTransaction(async (prisma) => {
        // Verificar se a equipe existe
        const equipe = await prisma.equipe.findUnique({
          where: { id: equipeId },
        });

        if (!equipe) {
          throw new AppError('Equipe não encontrada', 404, 'TEAM_NOT_FOUND');
        }

        // Verificar se o estudante existe
        const estudante = await prisma.estudante.findUnique({
          where: { id: estudanteId },
        });

        if (!estudante) {
          throw new AppError('Estudante não encontrado', 404, 'STUDENT_NOT_FOUND');
        }

        // Verificar se o estudante já está na equipe (usando consulta alternativa)
        const estudanteExistente = await prisma.estudanteEquipe.findFirst({
          where: {
            AND: [{ equipeId }, { estudanteId }],
          },
        });

        if (estudanteExistente) {
          throw new AppError('Estudante já está nesta equipe', 409, 'STUDENT_ALREADY_IN_TEAM');
        }

        // Adicionar o estudante
        await prisma.estudanteEquipe.create({
          data: {
            equipe: {
              connect: { id: equipeId },
            },
            estudante: {
              connect: { id: estudanteId },
            },
          },
        });
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      this.handlePrismaError(error, 'Estudante da Equipe');
    }
  }

  /**
   * Remover estudante da equipe
   */
  async removerEstudante(equipeId: string, estudanteId: string): Promise<void> {
    try {
      await this.unitOfWork.withTransaction(async (prisma) => {
        // Verificar se a associação existe usando consulta alternativa
        const estudanteEquipe = await prisma.estudanteEquipe.findFirst({
          where: {
            AND: [{ equipeId }, { estudanteId }],
          },
        });

        if (!estudanteEquipe) {
          throw new AppError('Estudante não está nesta equipe', 404, 'STUDENT_NOT_IN_TEAM');
        }

        // Remover o estudante usando o ID
        await prisma.estudanteEquipe.delete({
          where: { id: estudanteEquipe.id },
        });
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      this.handlePrismaError(error, 'Estudante da Equipe');
    }
  }

  /**
   * Listar estudantes de uma equipe
   */
  async listarEstudantes(equipeId: string): Promise<EstudanteEquipe[]> {
    try {
      const estudantes = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.estudanteEquipe.findMany({
          where: { equipeId },
          include: {
            estudante: {
              select: {
                id: true,
                nome: true,
                serie: true,
                dataNascimento: true,
                usuario: {
                  select: {
                    id: true,
                    nome: true,
                  },
                },
              },
            },
          },
        }),
      );

      // Mapear os estudantes incluindo os detalhes
      return estudantes.map((e) => ({
        id: e.id,
        equipeId: e.equipeId,
        estudanteId: e.estudanteId,
        dataEntrada: e.criadoEm, // usando criadoEm como dataEntrada
        dataSaida: e.atualizadoEm, // opcional
        estudante: e.estudante
          ? {
              id: e.estudante.id,
              nome: e.estudante.nome,
              serie: e.estudante.serie || '',
              idade: e.estudante.dataNascimento
                ? this.calcularIdade(e.estudante.dataNascimento)
                : undefined,
            }
          : undefined,
      }));
    } catch (error) {
      this.handlePrismaError(error, 'Estudantes da Equipe');
    }
  }

  /**
   * Calcular idade a partir da data de nascimento
   */
  private calcularIdade(dataNascimento: Date): number {
    const hoje = new Date();
    let idade = hoje.getFullYear() - dataNascimento.getFullYear();
    const m = hoje.getMonth() - dataNascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < dataNascimento.getDate())) {
      idade--;
    }
    return idade;
  }

  /**
   * Configuração de inclusões para consultas de equipe
   */
  private getEquipeIncludes() {
    return {
      membros: {
        include: {
          usuario: {
            select: {
              id: true,
              email: true,
              nome: true,
              cargo: true,
            },
          },
        },
      },
      estudantes: {
        include: {
          estudante: {
            select: {
              id: true,
              nome: true,
              serie: true,
            },
          },
        },
      },
    };
  }

  /**
   * Mapear cargo de usuário para cargo de equipe compatível
   */
  private mapCargoUsuarioToCargoEquipe(cargoUsuario: string): CargoEquipe {
    // Aqui você pode implementar a lógica de mapeamento adequada
    // Retorna um valor válido para CargoEquipe baseado no CargoUsuario
    switch (cargoUsuario) {
      case 'PROFESSOR':
        return CargoEquipe.PROFESSOR;
      case 'COORDENADOR':
        return CargoEquipe.COORDENADOR;
      case 'ESPECIALISTA':
        return CargoEquipe.ESPECIALISTA;
      case 'DIRETOR':
      case 'ADMINISTRADOR':
      case 'ADMIN':
        return CargoEquipe.OUTRO;
      default:
        return CargoEquipe.OUTRO; // valor padrão seguro
    }
  }

  /**
   * Método para mapear uma equipe do Prisma para a entidade Equipe
   */
  private mapToEquipe(equipePrisma: Record<string, unknown>): Equipe {
    const data = equipePrisma as unknown as EquipeData;

    // Criamos objetos simplificados que atendem à interface, sem herdar todos os métodos
    const membrosProps = data.membros.map((m) => ({
      id: m.id,
      papelMembro: this.mapCargoPapel(m.cargo),
      usuarioId: m.usuarioId,
      // Criar um objeto literal que satisfaz o mínimo necessário para Equipe.restaurar
      usuario: m.usuario
        ? {
            id: m.usuario.id,
            nome: m.usuario.nome,
            email: m.usuario.email,
            cargo: m.usuario.cargo,
          }
        : undefined,
      criadoEm: m.dataEntrada,
      atualizadoEm: m.dataSaida || m.dataEntrada,
    }));

    const estudantesProps = data.estudantes.map((e) => ({
      id: e.id,
      estudanteId: e.estudanteId,
      // Criar um objeto literal que satisfaz o mínimo necessário para Equipe.restaurar
      estudante: e.estudante
        ? {
            id: e.estudante.id,
            nome: e.estudante.nome,
            serie: e.estudante.serie || '',
          }
        : undefined,
      criadoEm: e.dataEntrada,
      atualizadoEm: e.dataEntrada,
    }));

    // Use as any para contornar o erro de tipo, já que estamos garantindo que os dados são compatíveis
    return Equipe.restaurar({
      id: data.id,
      nome: data.nome,
      descricao: data.descricao || '',
      status: mapPrismaStatusToLocal(data.status),
      membros: membrosProps as any,
      estudantes: estudantesProps as any,
      criadoEm: data.criadoEm,
      atualizadoEm: data.atualizadoEm,
    });
  }

  /**
   * Mapear cargo para PapelMembro
   */
  private mapCargoPapel(cargo: string): PapelMembro {
    // Mapeamento simples de cargo para papel
    switch (cargo) {
      case 'COORDENADOR':
        return PapelMembro.COORDENADOR;
      case 'PROFESSOR':
        return PapelMembro.PROFESSOR;
      case 'PSICOLOGO':
        return PapelMembro.PSICOLOGO;
      case 'ASSISTENTE_SOCIAL':
        return PapelMembro.ASSISTENTE_SOCIAL;
      case 'FONOAUDIOLOGO':
        return PapelMembro.FONOAUDIOLOGO;
      case 'TERAPEUTA_OCUPACIONAL':
        return PapelMembro.TERAPEUTA_OCUPACIONAL;
      default:
        return PapelMembro.OUTRO;
    }
  }

  private parseDate(value: unknown): Date {
    if (value instanceof Date) return value;
    if (typeof value === 'string' || typeof value === 'number') return new Date(value);
    return new Date();
  }

  /**
   * Método para mapear um membro de equipe do Prisma para o tipo MembroEquipe
   */
  private mapToMembro(m: Record<string, unknown>): MembroEquipe {
    const usuario = m.usuario as Record<string, unknown>;

    return {
      id: m.id as string,
      usuarioId: m.usuarioId as string,
      equipeId: m.equipeId as string,
      cargo: m.cargo as string,
      // Usar acesso seguro com operador de cadeia opcional
      funcao: m.funcao !== undefined && m.funcao !== null ? (m.funcao as string) : undefined,
      dataEntrada: this.parseDate(m.dataEntrada),
      dataSaida: m.dataSaida ? this.parseDate(m.dataSaida) : undefined,
      usuario: {
        id: usuario.id as string,
        nome: usuario.nome as string,
        email: usuario.email as string,
        cargo: usuario.cargo as string,
      },
    };
  }
}
