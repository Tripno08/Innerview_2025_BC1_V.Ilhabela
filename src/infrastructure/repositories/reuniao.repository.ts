import {
  IRuniaoRepository,
  DadosEncaminhamento,
} from '@domain/repositories/reuniao-repository.interface';
import { BaseRepository } from './base.repository';
import { AppError } from '@shared/errors/app-error';
import {
  Reuniao,
  ParticipanteReuniao,
  EncaminhamentoReuniao,
} from '@domain/entities/reuniao.entity';
import { Status, Prioridade } from '@shared/enums';
import { mapLocalStatusToPrisma, mapPrismaStatusToLocal } from '@shared/utils/enum-mappers';

/**
 * Implementação do repositório de reuniões utilizando Prisma
 */
export class ReuniaoRepository extends BaseRepository<Reuniao> implements IRuniaoRepository {
  /**
   * Encontrar todas as reuniões
   */
  async findAll(): Promise<Reuniao[]> {
    try {
      const reunioes = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.reuniao.findMany({
          include: this.getReuniaoIncludes(),
          orderBy: {
            data: 'desc',
          },
        }),
      );

      return reunioes.map((r) => this.mapToReuniao(r));
    } catch (error) {
      this.handlePrismaError(error, 'Reunião');
    }
  }

  /**
   * Encontrar reuniões por equipe
   */
  async findByEquipe(equipeId: string): Promise<Reuniao[]> {
    try {
      const reunioes = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.reuniao.findMany({
          where: {
            equipeId,
          },
          include: this.getReuniaoIncludes(),
          orderBy: {
            data: 'desc',
          },
        }),
      );

      return reunioes.map((r) => this.mapToReuniao(r));
    } catch (error) {
      this.handlePrismaError(error, 'Reunião');
    }
  }

  /**
   * Encontrar reuniões por período de data
   */
  async findByData(dataInicio: Date, dataFim: Date): Promise<Reuniao[]> {
    try {
      const reunioes = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.reuniao.findMany({
          where: {
            data: {
              gte: dataInicio,
              lte: dataFim,
            },
          },
          include: this.getReuniaoIncludes(),
          orderBy: {
            data: 'desc',
          },
        }),
      );

      return reunioes.map((r) => this.mapToReuniao(r));
    } catch (error) {
      this.handlePrismaError(error, 'Reunião');
    }
  }

  /**
   * Encontrar reuniões por status
   */
  async findByStatus(status: string): Promise<Reuniao[]> {
    try {
      const reunioes = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.reuniao.findMany({
          where: {
            status: mapLocalStatusToPrisma(status as Status),
          },
          include: this.getReuniaoIncludes(),
          orderBy: {
            data: 'desc',
          },
        }),
      );

      return reunioes.map((r) => this.mapToReuniao(r));
    } catch (error) {
      this.handlePrismaError(error, 'Reunião');
    }
  }

  /**
   * Encontrar uma reunião pelo ID
   */
  async findById(id: string): Promise<Reuniao | null> {
    try {
      const reuniao = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.reuniao.findUnique({
          where: { id },
          include: this.getReuniaoIncludes(),
        }),
      );

      if (!reuniao) {
        return null;
      }

      return this.mapToReuniao(reuniao);
    } catch (error) {
      this.handlePrismaError(error, 'Reunião');
    }
  }

  /**
   * Criar uma nova reunião
   */
  async create(data: Partial<Omit<Reuniao, 'id'>>): Promise<Reuniao> {
    try {
      const reuniao = await this.unitOfWork.withTransaction(async (prisma) => {
        return await prisma.reuniao.create({
          data: {
            titulo: data.titulo,
            equipeId: data.equipeId,
            data: data.data,
            local: data.local,
            status: mapLocalStatusToPrisma(data.status || Status.AGENDADO),
            resumo: data.resumo || '',
            pauta: data.pauta || '',
            observacoes: data.observacoes || '',
          },
          include: this.getReuniaoIncludes(),
        });
      });

      return this.mapToReuniao(reuniao);
    } catch (error) {
      this.handlePrismaError(error, 'Reunião');
    }
  }

  /**
   * Atualizar uma reunião existente
   */
  async update(id: string, data: Partial<Omit<Reuniao, 'id'>>): Promise<Reuniao> {
    try {
      const reuniao = await this.unitOfWork.withTransaction(async (prisma) => {
        return await prisma.reuniao.update({
          where: { id },
          data: {
            titulo: data.titulo,
            data: data.data,
            local: data.local,
            resumo: data.resumo,
            pauta: data.pauta,
            observacoes: data.observacoes,
            status: data.status ? mapLocalStatusToPrisma(data.status) : undefined,
          },
          include: this.getReuniaoIncludes(),
        });
      });

      return this.mapToReuniao(reuniao);
    } catch (error) {
      this.handlePrismaError(error, 'Reunião');
    }
  }

  /**
   * Excluir uma reunião
   */
  async delete(id: string): Promise<void> {
    try {
      await this.unitOfWork.withTransaction(async (prisma) => {
        // Primeiro exclui todos os participantes
        await prisma.participanteReuniao.deleteMany({
          where: {
            reuniaoId: id,
          },
        });

        // Depois exclui todos os encaminhamentos
        await prisma.encaminhamento.deleteMany({
          where: {
            reuniaoId: id,
          },
        });

        // Por fim, exclui a reunião
        await prisma.reuniao.delete({
          where: { id },
        });
      });
    } catch (error) {
      this.handlePrismaError(error, 'Reunião');
    }
  }

  /**
   * Adicionar participante a uma reunião
   */
  async adicionarParticipante(reuniaoId: string, usuarioId: string, cargo?: string): Promise<void> {
    try {
      await this.unitOfWork.withTransaction(async (prisma) => {
        // Verifica se a reunião existe
        const reuniao = await prisma.reuniao.findUnique({
          where: { id: reuniaoId },
        });

        if (!reuniao) {
          throw new AppError('Reunião não encontrada', 404, 'REUNIAO_NOT_FOUND');
        }

        // Verifica se o usuário já é participante
        const participanteExistente = await prisma.participanteReuniao.findFirst({
          where: {
            reuniaoId,
            usuarioId,
          },
        });

        if (participanteExistente) {
          throw new AppError(
            'Usuário já é participante desta reunião',
            409,
            'PARTICIPANTE_ALREADY_EXISTS',
          );
        }

        // Adiciona o participante
        await prisma.participanteReuniao.create({
          data: {
            reuniaoId,
            usuarioId,
            cargo: cargo || 'MEMBRO',
            presente: false,
            confirmado: false,
          },
        });
      });
    } catch (error) {
      this.handlePrismaError(error, 'Participante da Reunião');
    }
  }

  /**
   * Remover participante de uma reunião
   */
  async removerParticipante(reuniaoId: string, usuarioId: string): Promise<void> {
    try {
      await this.unitOfWork.withTransaction(async (prisma) => {
        // Verifica se o participante existe
        const participante = await prisma.participanteReuniao.findFirst({
          where: {
            reuniaoId,
            usuarioId,
          },
        });

        if (!participante) {
          throw new AppError(
            'Participante não encontrado nesta reunião',
            404,
            'PARTICIPANTE_NOT_FOUND',
          );
        }

        // Remove o participante
        await prisma.participanteReuniao.delete({
          where: {
            id: participante.id,
          },
        });
      });
    } catch (error) {
      this.handlePrismaError(error, 'Participante da Reunião');
    }
  }

  /**
   * Marcar presença de um participante
   */
  async marcarPresenca(reuniaoId: string, usuarioId: string, presente: boolean): Promise<void> {
    try {
      await this.unitOfWork.withTransaction(async (prisma) => {
        // Verifica se o participante existe
        const participante = await prisma.participanteReuniao.findFirst({
          where: {
            reuniaoId,
            usuarioId,
          },
        });

        if (!participante) {
          throw new AppError(
            'Participante não encontrado nesta reunião',
            404,
            'PARTICIPANTE_NOT_FOUND',
          );
        }

        // Verifica se a reunião já está concluída
        const reuniao = await prisma.reuniao.findUnique({
          where: { id: reuniaoId },
        });

        if (reuniao && mapPrismaStatusToLocal(reuniao.status) === Status.CONCLUIDO) {
          throw new AppError(
            'Não é possível alterar presenças em reuniões concluídas',
            400,
            'REUNIAO_ALREADY_CONCLUDED',
          );
        }

        // Atualiza a presença
        await prisma.participanteReuniao.update({
          where: {
            id: participante.id,
          },
          data: {
            presente,
            confirmado: true,
          },
        });
      });
    } catch (error) {
      this.handlePrismaError(error, 'Participante da Reunião');
    }
  }

  /**
   * Listar participantes de uma reunião
   */
  async listarParticipantes(reuniaoId: string): Promise<ParticipanteReuniao[]> {
    try {
      const participantes = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.participanteReuniao.findMany({
          where: {
            reuniaoId,
          },
          include: {
            usuario: true,
          },
        }),
      );

      return participantes.map((p) => ({
        id: p.id,
        usuarioId: p.usuarioId,
        reuniaoId: p.reuniaoId,
        presente: p.presente,
        confirmado: p.confirmado,
        papel: p.cargo,
        usuario: {
          id: p.usuario.id,
          nome: p.usuario.nome,
          email: p.usuario.email,
          cargo: p.usuario.cargo,
        },
      }));
    } catch (error) {
      this.handlePrismaError(error, 'Participante da Reunião');
    }
  }

  /**
   * Adicionar encaminhamento a uma reunião
   */
  async adicionarEncaminhamento(
    reuniaoId: string,
    encaminhamentoData: DadosEncaminhamento,
  ): Promise<EncaminhamentoReuniao> {
    try {
      // Valida os dados
      if (!encaminhamentoData.descricao) {
        throw new AppError('Descrição do encaminhamento é obrigatória', 400, 'INVALID_INPUT');
      }

      const encaminhamento = await this.unitOfWork.withTransaction(async (prisma) => {
        // Verifica se a reunião existe
        const reuniao = await prisma.reuniao.findUnique({
          where: { id: reuniaoId },
          include: {
            equipe: {
              include: {
                estudantes: {
                  take: 1,
                  include: {
                    estudante: true,
                  },
                },
              },
            },
          },
        });

        if (!reuniao) {
          throw new AppError('Reunião não encontrada', 404, 'REUNIAO_NOT_FOUND');
        }

        // Obtém um estudante associado à equipe para o campo estudanteId (obrigatório)
        let estudanteId: string | null = null;

        if (reuniao.equipe?.estudantes?.length > 0) {
          estudanteId = reuniao.equipe.estudantes[0].estudanteId;
        } else {
          // Se não tiver estudantes na equipe, busca qualquer estudante no sistema
          const primeiroEstudante = await prisma.estudante.findFirst({
            select: { id: true },
          });

          if (primeiroEstudante) {
            estudanteId = primeiroEstudante.id;
          } else {
            throw new AppError(
              'Não foi possível criar o encaminhamento: nenhum estudante cadastrado no sistema',
              400,
              'NO_STUDENT_AVAILABLE',
            );
          }
        }

        // Obter usuário responsável ou fallback para o primeiro usuário
        let responsavelId = encaminhamentoData.responsavelId;

        if (!responsavelId) {
          const primeiroUsuario = await prisma.usuario.findFirst({
            select: { id: true },
          });

          if (primeiroUsuario) {
            responsavelId = primeiroUsuario.id;
          } else {
            throw new AppError(
              'Não foi possível criar o encaminhamento: nenhum usuário cadastrado no sistema',
              400,
              'NO_USER_AVAILABLE',
            );
          }
        }

        // Determina a prioridade
        const prioridade = encaminhamentoData.prioridade
          ? (encaminhamentoData.prioridade as Prioridade)
          : Prioridade.MEDIA;

        // Determina o status
        const status = encaminhamentoData.status
          ? (encaminhamentoData.status as Status)
          : Status.PENDENTE;

        // Cria o encaminhamento
        return await prisma.encaminhamento.create({
          data: {
            titulo: `Encaminhamento de Reunião ${reuniao.titulo}`,
            descricao: encaminhamentoData.descricao,
            reuniaoId: reuniaoId,
            prioridade: prioridade,
            status: mapLocalStatusToPrisma(status),
            dataPrazo: encaminhamentoData.prazo,
            atribuidoPara: responsavelId,
            criadoPor: responsavelId,
            estudanteId: estudanteId as string,
          },
          include: {
            atribuidoUsuario: true,
            criadoUsuario: true,
          },
        });
      });

      // Converter para o modelo de domínio
      return {
        id: encaminhamento.id,
        reuniaoId: encaminhamento.reuniaoId as string,
        descricao: encaminhamento.descricao,
        responsavelId: encaminhamento.atribuidoPara,
        prazo: encaminhamento.dataPrazo || undefined,
        status: mapPrismaStatusToLocal(encaminhamento.status),
        prioridade: encaminhamento.prioridade as Prioridade,
        observacoes: encaminhamento.observacoes || undefined,
      };
    } catch (error) {
      this.handlePrismaError(error, 'Encaminhamento');
    }
  }

  /**
   * Listar encaminhamentos de uma reunião
   */
  async listarEncaminhamentos(reuniaoId: string): Promise<EncaminhamentoReuniao[]> {
    try {
      const encaminhamentos = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.encaminhamento.findMany({
          where: {
            reuniaoId,
          },
          include: {
            atribuidoUsuario: true,
            criadoUsuario: true,
          },
        }),
      );

      return encaminhamentos.map((e) => ({
        id: e.id,
        reuniaoId: e.reuniaoId as string,
        descricao: e.descricao,
        responsavelId: e.atribuidoPara,
        prazo: e.dataPrazo || undefined,
        status: mapPrismaStatusToLocal(e.status),
        prioridade: e.prioridade as Prioridade,
        observacoes: e.observacoes || undefined,
      }));
    } catch (error) {
      this.handlePrismaError(error, 'Encaminhamento');
    }
  }

  /**
   * Atualizar o resumo de uma reunião
   */
  async atualizarResumo(reuniaoId: string, resumo: string): Promise<Reuniao> {
    try {
      const reuniao = await this.unitOfWork.withTransaction(async (prisma) => {
        return await prisma.reuniao.update({
          where: { id: reuniaoId },
          data: { resumo },
          include: this.getReuniaoIncludes(),
        });
      });

      return this.mapToReuniao(reuniao);
    } catch (error) {
      this.handlePrismaError(error, 'Reunião');
    }
  }

  /**
   * Atualizar o status de uma reunião
   */
  async atualizarStatus(reuniaoId: string, status: string): Promise<Reuniao> {
    try {
      const reuniao = await this.unitOfWork.withTransaction(async (prisma) => {
        return await prisma.reuniao.update({
          where: { id: reuniaoId },
          data: { status: mapLocalStatusToPrisma(status as Status) },
          include: this.getReuniaoIncludes(),
        });
      });

      return this.mapToReuniao(reuniao);
    } catch (error) {
      this.handlePrismaError(error, 'Reunião');
    }
  }

  /**
   * Define os includes para a consulta de reuniões
   */
  private getReuniaoIncludes() {
    return {
      participantes: {
        include: {
          usuario: true,
        },
      },
      encaminhamentos: true,
      equipe: true,
    };
  }

  /**
   * Mapeia um registro do Prisma para uma entidade Reuniao
   */
  private mapToReuniao(reuniaoPrisma: any): Reuniao {
    return {
      id: reuniaoPrisma.id as string,
      titulo: reuniaoPrisma.titulo as string,
      data: reuniaoPrisma.data as Date,
      local: reuniaoPrisma.local as string,
      pauta: reuniaoPrisma.pauta as string,
      equipeId: reuniaoPrisma.equipeId as string,
      resumo: reuniaoPrisma.resumo as string,
      observacoes: reuniaoPrisma.observacoes as string,
      status: mapPrismaStatusToLocal(reuniaoPrisma.status),
      criadoEm: reuniaoPrisma.criadoEm as Date,
      atualizadoEm: reuniaoPrisma.atualizadoEm as Date,
      participantes:
        reuniaoPrisma.participantes?.map((p: any) => ({
          id: p.id,
          usuarioId: p.usuarioId,
          reuniaoId: p.reuniaoId,
          presente: p.presente,
          confirmado: p.confirmado,
          papel: p.cargo,
          usuario: p.usuario,
        })) || [],
      encaminhamentos:
        reuniaoPrisma.encaminhamentos?.map((e: any) => ({
          id: e.id,
          reuniaoId: e.reuniaoId,
          descricao: e.descricao,
          responsavelId: e.atribuidoPara,
          prazo: e.dataPrazo,
          status: mapPrismaStatusToLocal(e.status),
          prioridade: e.prioridade as Prioridade,
          observacoes: e.observacoes,
        })) || [],
    } as Reuniao;
  }
}
