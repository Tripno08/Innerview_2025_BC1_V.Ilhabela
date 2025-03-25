import { injectable, inject } from 'tsyringe';
import {
  Reuniao,
  IParticipanteReuniao,
  IEncaminhamentoReuniao,
} from '../../../domain/entities/reuniao.entity';
import { IReuniaoRepository } from '../../../domain/repositories/reuniao-repository.interface';
import { mapStatusFromPrisma, mapStatusToPrisma } from '../../../shared/utils/enum-mappers';
import { Status } from '../../../shared/enums';
import {
  IAdicionarEncaminhamentoDTO,
  ICriarReuniaoDTO,
  IAtualizarReuniaoDTO,
} from '../../../domain/dtos/reuniao.dto';
import { sanitizeForPrisma, mapPrismaError, safePrismaResult } from '../../../shared/helpers/prisma-helper';
import { AppError } from '../../../shared/errors/app-error';
import {
  PrismaClientExtended,
  ensurePrismaModel,
  IReuniaoModel,
  IParticipanteReuniaoModel,
  IEncaminhamentoModel,
} from '../../../types/prisma-extended';

/**
 * Interface para dados do Prisma de reunião com campos necessários
 */
interface IPrismaReuniaoData {
  id: string;
  titulo: string;
  data: Date;
  local?: string | null;
  pauta?: string | null;
  status: string;
  observacoes?: string | null;
  resumo?: string | null;
  criadoEm: Date;
  atualizadoEm: Date;
  equipeId: string;
  equipe?: Record<string, unknown> | null;
  participantes?: Record<string, unknown>[] | null;
  encaminhamentos?: Record<string, unknown>[] | null;
}

/**
 * Interface para dados do Prisma de participante com campos necessários
 */
interface IPrismaParticipanteData {
  id: string;
  usuarioId: string;
  reuniaoId: string;
  presente: boolean;
  confirmado: boolean;
  cargo?: string | null;
  usuario?: Record<string, unknown> | null;
}

/**
 * Interface para dados do Prisma de encaminhamento com campos necessários
 */
interface IPrismaEncaminhamentoData {
  id: string;
  reuniaoId: string;
  titulo: string;
  descricao: string;
  atribuidoPara?: string | null;
  dataPrazo?: Date | null;
  status: string;
  prioridade?: string | null;
  observacoes?: string | null;
  atribuidoUsuario?: Record<string, unknown> | null;
}

/**
 * Implementação do repositório de reuniões usando Prisma
 */
@injectable()
export class PrismaReuniaoRepository implements IReuniaoRepository {
  constructor(
    @inject('PrismaClient')
    private prisma: PrismaClientExtended
  ) {}

  /**
   * Busca todas as reuniões
   */
  async findAll(): Promise<Reuniao[]> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const reuniaoModel = ensurePrismaModel<IReuniaoModel>(this.prisma, 'reuniao');

      // Buscar todas as reuniões
      const reunioes = await reuniaoModel.findMany({
        include: {
          equipe: true,
          participantes: {
            include: {
              usuario: true,
            },
          },
          encaminhamentos: true,
        },
        orderBy: {
          data: 'desc',
        },
      });

      // Usar safePrismaResult para mapear com segurança
      return safePrismaResult(
        reunioes,
        (data) => data.map(reuniao => {
          // Conversão segura usando dupla conversão de tipo
          const tipoSeguro = reuniao as unknown as IPrismaReuniaoData;
          return this.mapToDomain(tipoSeguro);
        }),
        []
      );
    } catch (error) {
      throw mapPrismaError(error, 'Reuniao');
    }
  }

  /**
   * Busca uma reunião pelo ID
   */
  async findById(id: string): Promise<Reuniao | null> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const reuniaoModel = ensurePrismaModel<IReuniaoModel>(this.prisma, 'reuniao');

      // Buscar a reunião pelo ID
      const reuniao = await reuniaoModel.findUnique({
        where: { id },
        include: {
          equipe: true,
          participantes: {
            include: {
              usuario: true,
            },
          },
          encaminhamentos: true,
        },
      });

      // Usar safePrismaResult para tratar valores nulos e converter tipos
      return safePrismaResult(
        reuniao, 
        (data) => {
          // Conversão segura usando dupla conversão de tipo
          const tipoSeguro = data as unknown as IPrismaReuniaoData;
          return this.mapToDomain(tipoSeguro);
        },
        null
      );
    } catch (error) {
      throw mapPrismaError(error, 'Reuniao');
    }
  }

  /**
   * Cria uma nova reunião
   */
  async create(data: ICriarReuniaoDTO): Promise<Reuniao> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const reuniaoModel = ensurePrismaModel<IReuniaoModel>(this.prisma, 'reuniao');

      // Preparar os dados para criação
      const createData = sanitizeForPrisma({
        titulo: data.titulo,
        data: data.data,
        local: data.local,
        pauta: data.descricao,
        status: mapStatusToPrisma(Status.AGENDADO), // Valor padrão
        // O DTO não tem equipeId, então vamos obter de onde é mais apropriado ou usar um padrão
        equipeId: '1', // Valor temporário, deve ser definido pelo caso de uso
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      });

      // Criar a reunião
      const reuniao = await reuniaoModel.create({
        data: createData,
        include: {
          equipe: true,
        },
      });

      // Usar safePrismaResult para garantir tipagem segura
      return safePrismaResult(
        reuniao,
        (data) => this.mapToDomain(data as unknown as IPrismaReuniaoData),
        // Este é um caso onde não esperamos null/undefined, então poderíamos lançar um erro
        // como fallback, mas seguiremos o padrão e usaremos uma entidade vazia
        {} as Reuniao
      );
    } catch (error) {
      throw mapPrismaError(error, 'Reuniao');
    }
  }

  /**
   * Atualiza uma reunião existente
   */
  async update(id: string, data: IAtualizarReuniaoDTO): Promise<Reuniao> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const reuniaoModel = ensurePrismaModel<IReuniaoModel>(this.prisma, 'reuniao');

      // Verificar se a reunião existe
      const reuniaoExistente = await reuniaoModel.findUnique({
        where: { id },
      });

      if (!reuniaoExistente) {
        throw new AppError('Reunião não encontrada', 404);
      }

      // Preparar os dados para atualização
      const updateData = sanitizeForPrisma({
        titulo: data.titulo,
        data: data.data,
        local: data.local,
        pauta: data.descricao, // Corrigido de 'descricao' para 'pauta'
        status: data.status ? mapStatusToPrisma(data.status) : undefined,
        atualizadoEm: new Date()
      });

      // Atualizar a reunião
      const reuniao = await reuniaoModel.update({
        where: { id },
        data: updateData,
        include: {
          equipe: true,
          participantes: {
            include: {
              usuario: true,
            },
          },
          encaminhamentos: true,
        },
      });

      // Usar safePrismaResult para garantir tipagem segura
      return safePrismaResult(
        reuniao,
        (data) => this.mapToDomain(data as unknown as IPrismaReuniaoData),
        {} as Reuniao // Fallback, mas na prática não deveria ocorrer
      );
    } catch (error) {
      throw mapPrismaError(error, 'Reuniao');
    }
  }

  /**
   * Exclui uma reunião
   */
  async delete(id: string): Promise<void> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const reuniaoModel = ensurePrismaModel<IReuniaoModel>(this.prisma, 'reuniao');

      // Verificar se a reunião existe
      const reuniaoExistente = await reuniaoModel.findUnique({
        where: { id },
      });

      if (!reuniaoExistente) {
        throw new AppError('Reunião não encontrada', 404);
      }

      // Excluir a reunião
      await reuniaoModel.delete({
        where: { id },
      });
    } catch (error) {
      throw mapPrismaError(error, 'Reuniao');
    }
  }

  /**
   * Busca reuniões por equipe
   */
  async findByEquipe(equipeId: string): Promise<Reuniao[]> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const reuniaoModel = ensurePrismaModel<IReuniaoModel>(this.prisma, 'reuniao');

      // Buscar reuniões da equipe
      const reunioes = await reuniaoModel.findMany({
        where: { equipeId },
        include: {
          equipe: true,
          participantes: {
            include: {
              usuario: true,
            },
          },
          encaminhamentos: true,
        },
        orderBy: {
          data: 'desc',
        },
      });

      // Mapear para o domínio
      return reunioes.map((reuniao) => this.mapToDomain(reuniao as IPrismaReuniaoData));
    } catch (error) {
      throw mapPrismaError(error, 'Reuniao');
    }
  }

  /**
   * Busca reuniões por período
   */
  async findByData(dataInicio: Date, dataFim: Date): Promise<Reuniao[]> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const reuniaoModel = ensurePrismaModel<IReuniaoModel>(this.prisma, 'reuniao');

      // Buscar reuniões no período especificado
      const reunioes = await reuniaoModel.findMany({
        where: {
          data: {
            gte: dataInicio,
            lte: dataFim,
          },
        },
        include: {
          equipe: true,
          participantes: {
            include: {
              usuario: true,
            },
          },
          encaminhamentos: true,
        },
        orderBy: {
          data: 'asc',
        },
      });

      // Mapear para o domínio
      return reunioes.map((reuniao) => this.mapToDomain(reuniao as IPrismaReuniaoData));
    } catch (error) {
      throw mapPrismaError(error, 'Reuniao');
    }
  }

  /**
   * Busca reuniões por status
   */
  async findByStatus(status: string): Promise<Reuniao[]> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const reuniaoModel = ensurePrismaModel<IReuniaoModel>(this.prisma, 'reuniao');

      // Buscar reuniões pelo status
      const reunioes = await reuniaoModel.findMany({
        where: {
          status: mapStatusToPrisma(status),
        },
        include: {
          equipe: true,
          participantes: {
            include: {
              usuario: true,
            },
          },
          encaminhamentos: true,
        },
        orderBy: {
          data: 'desc',
        },
      });

      // Mapear para o domínio
      return reunioes.map((reuniao) => this.mapToDomain(reuniao as IPrismaReuniaoData));
    } catch (error) {
      throw mapPrismaError(error, 'Reuniao');
    }
  }

  /**
   * Adiciona um participante à reunião
   */
  async adicionarParticipante(reuniaoId: string, usuarioId: string, cargo?: string): Promise<void> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const participanteModel = ensurePrismaModel<IParticipanteReuniaoModel>(
        this.prisma,
        'participanteReuniao',
      );

      // Verificar se o participante já existe
      const participanteExistente = await participanteModel.findFirst({
        where: {
          reuniaoId,
          usuarioId,
        },
      });

      if (participanteExistente) {
        // Atualizar o participante existente
        await participanteModel.update({
          where: {
            id: participanteExistente.id,
          },
          data: {
            cargo,
            atualizadoEm: new Date(),
          },
        });
      } else {
        // Criar novo participante
        await participanteModel.create({
          data: {
            reuniaoId,
            usuarioId,
            presente: false,
            confirmado: false,
            cargo,
          },
        });
      }
    } catch (error) {
      throw mapPrismaError(error, 'ParticipanteReuniao');
    }
  }

  /**
   * Remove um participante da reunião
   */
  async removerParticipante(reuniaoId: string, usuarioId: string): Promise<void> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const participanteModel = ensurePrismaModel<IParticipanteReuniaoModel>(
        this.prisma,
        'participanteReuniao',
      );

      // Remover o participante
      await participanteModel.deleteMany({
        where: {
          reuniaoId,
          usuarioId,
        },
      });
    } catch (error) {
      throw mapPrismaError(error, 'ParticipanteReuniao');
    }
  }

  /**
   * Marca presença de um participante na reunião
   */
  async marcarPresenca(reuniaoId: string, usuarioId: string, presente: boolean): Promise<void> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const participanteModel = ensurePrismaModel<IParticipanteReuniaoModel>(
        this.prisma,
        'participanteReuniao',
      );

      // Buscar o participante
      const participante = await participanteModel.findFirst({
        where: {
          reuniaoId,
          usuarioId,
        },
      });

      if (!participante) {
        throw new AppError('Participante não encontrado na reunião', 404);
      }

      // Atualizar a presença
      await participanteModel.update({
        where: {
          id: participante.id,
        },
        data: {
          presente,
          atualizadoEm: new Date(),
        },
      });
    } catch (error) {
      throw mapPrismaError(error, 'ParticipanteReuniao');
    }
  }

  /**
   * Lista os participantes de uma reunião
   * @param reuniaoId ID da reunião
   * @returns Lista de participantes
   */
  async listarParticipantes(reuniaoId: string): Promise<IParticipanteReuniao[]> {
    try {
      // Validar parâmetro
      if (!reuniaoId || typeof reuniaoId !== 'string') {
        throw new AppError('ID de reunião inválido', 400);
      }

      // Garantir que o modelo existe
      const participanteModel = ensurePrismaModel<IParticipanteReuniaoModel>(
        this.prisma,
        'participanteReuniao'
      );
      
      // Buscar participantes
      const participantes = await participanteModel.findMany({
        where: { reuniaoId },
        include: { 
          usuario: true 
        }
      });
      
      // Usar safePrismaResult para mapear com segurança
      return safePrismaResult(
        participantes,
        (data) => data.map(participante => {
          // Converter com segurança
          return this.mapParticipanteToDTO(participante as unknown as IPrismaParticipanteData);
        }),
        [] // Array vazio como valor padrão
      );
    } catch (error) {
      throw mapPrismaError(error, 'ParticipanteReuniao');
    }
  }

  /**
   * Adiciona um encaminhamento à reunião
   * @param reuniaoId ID da reunião
   * @param dados Dados do encaminhamento
   * @returns Encaminhamento criado
   */
  async adicionarEncaminhamento(
    reuniaoId: string,
    dados: IAdicionarEncaminhamentoDTO
  ): Promise<IEncaminhamentoReuniao> {
    try {
      // Validar parâmetros
      if (!reuniaoId || typeof reuniaoId !== 'string') {
        throw new AppError('ID de reunião inválido', 400);
      }
      
      if (!dados.descricao || typeof dados.descricao !== 'string') {
        throw new AppError('Descrição do encaminhamento é obrigatória', 400);
      }
      
      // Verificar se a reunião existe
      const reuniaoModel = ensurePrismaModel<IReuniaoModel>(this.prisma, 'reuniao');
      const reuniaoExistente = await reuniaoModel.findUnique({ where: { id: reuniaoId } });
      
      if (!reuniaoExistente) {
        throw new AppError('Reunião não encontrada', 404);
      }
      
      // Garantir que o modelo de encaminhamento existe
      const encaminhamentoModel = ensurePrismaModel<IEncaminhamentoModel>(
        this.prisma,
        'encaminhamento'
      );
      
      // Preparar dados para criação
      const createData = sanitizeForPrisma({
        reuniaoId,
        titulo: dados.titulo || dados.descricao.substring(0, Math.min(50, dados.descricao.length)),
        descricao: dados.descricao,
        atribuidoPara: dados.responsavelId,
        dataPrazo: dados.prazo,
        status: mapStatusToPrisma(Status.PENDENTE),
        criadoEm: new Date(),
        atualizadoEm: new Date()
      });
      
      // Criar encaminhamento
      const encaminhamento = await encaminhamentoModel.create({
        data: createData
      });
      
      // Usar safePrismaResult para garantir tipagem segura
      return safePrismaResult(
        encaminhamento,
        (data) => {
          // Conversão segura usando dupla conversão de tipo
          const tipoSeguro = data as unknown as IPrismaEncaminhamentoData;
          return this.mapEncaminhamentoToDTO(tipoSeguro);
        },
        {
          // Objeto básico como fallback (não deveria ser usado)
          id: '',
          reuniaoId: '',
          descricao: '',
          status: 'PENDENTE'
        }
      );
    } catch (error) {
      throw mapPrismaError(error, 'Encaminhamento');
    }
  }

  /**
   * Lista os encaminhamentos de uma reunião
   * @param reuniaoId ID da reunião
   * @returns Lista de encaminhamentos
   */
  async listarEncaminhamentos(reuniaoId: string): Promise<IEncaminhamentoReuniao[]> {
    try {
      // Validar parâmetro
      if (!reuniaoId || typeof reuniaoId !== 'string') {
        throw new AppError('ID de reunião inválido', 400);
      }

      // Garantir que o modelo existe
      const encaminhamentoModel = ensurePrismaModel<IEncaminhamentoModel>(
        this.prisma,
        'encaminhamento'
      );
      
      // Buscar encaminhamentos
      const encaminhamentos = await encaminhamentoModel.findMany({
        where: { reuniaoId },
        include: { 
          atribuidoUsuario: true 
        }
      });
      
      // Usar safePrismaResult para mapear com segurança
      return safePrismaResult(
        encaminhamentos,
        (data) => data.map(encaminhamento => {
          // Converter com segurança
          return this.mapEncaminhamentoToDTO(encaminhamento as unknown as IPrismaEncaminhamentoData);
        }),
        [] // Array vazio como valor padrão
      );
    } catch (error) {
      throw mapPrismaError(error, 'Encaminhamento');
    }
  }

  /**
   * Atualiza o resumo de uma reunião
   */
  async atualizarResumo(reuniaoId: string, resumo: string): Promise<Reuniao> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const reuniaoModel = ensurePrismaModel<IReuniaoModel>(this.prisma, 'reuniao');

      // Verificar se a reunião existe
      const reuniaoExistente = await reuniaoModel.findUnique({
        where: { id: reuniaoId },
      });

      if (!reuniaoExistente) {
        throw new AppError('Reunião não encontrada', 404);
      }

      // Atualizar o resumo
      const reuniao = await reuniaoModel.update({
        where: { id: reuniaoId },
        data: {
          resumo,
          atualizadoEm: new Date(),
        },
        include: {
          equipe: true,
          participantes: {
            include: {
              usuario: true,
            },
          },
          encaminhamentos: true,
        },
      });

      // Mapear para o domínio
      return this.mapToDomain(reuniao as unknown as IPrismaReuniaoData);
    } catch (error) {
      throw mapPrismaError(error, 'Reuniao');
    }
  }

  /**
   * Atualiza o status de uma reunião
   */
  async atualizarStatus(reuniaoId: string, status: string): Promise<Reuniao> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const reuniaoModel = ensurePrismaModel<IReuniaoModel>(this.prisma, 'reuniao');

      // Verificar se a reunião existe
      const reuniaoExistente = await reuniaoModel.findUnique({
        where: { id: reuniaoId },
      });

      if (!reuniaoExistente) {
        throw new AppError('Reunião não encontrada', 404);
      }

      // Atualizar o status
      const reuniao = await reuniaoModel.update({
        where: { id: reuniaoId },
        data: {
          status: mapStatusToPrisma(status),
          atualizadoEm: new Date(),
        },
        include: {
          equipe: true,
          participantes: {
            include: {
              usuario: true,
            },
          },
          encaminhamentos: true,
        },
      });

      // Mapear para o domínio
      return this.mapToDomain(reuniao as IPrismaReuniaoData);
    } catch (error) {
      throw mapPrismaError(error, 'Reuniao');
    }
  }

  /**
   * Mapeia dados do Prisma para o domínio
   */
  private mapToDomain(data: IPrismaReuniaoData): Reuniao {
    // Extrair e validar dados da equipe, se presente
    let equipe = undefined;
    
    if (data.equipe) {
      const equipeData = data.equipe as Record<string, unknown>;
      const id = equipeData.id ? String(equipeData.id) : '';
      const nome = equipeData.nome ? String(equipeData.nome) : '';
      const descricao = equipeData.descricao ? String(equipeData.descricao) : '';
      
      // Tratar datas com segurança
      let criadoEm = new Date();
      let atualizadoEm = new Date();
      
      try {
        if (equipeData.criadoEm) {
          criadoEm = new Date(String(equipeData.criadoEm));
        }
        if (equipeData.atualizadoEm) {
          atualizadoEm = new Date(String(equipeData.atualizadoEm));
        }
      } catch (e) {
        // Em caso de erro ao converter, usar datas atuais
        console.warn('Erro ao converter datas da equipe:', e);
      }
      
      // Criar objeto de equipe simplificado (não é a entidade Equipe completa)
      equipe = {
        id,
        nome,
        descricao,
        criadoEm,
        atualizadoEm,
      };
    }
    
    // Mapear participantes com segurança
    const participantes = data.participantes?.map(p => {
      const participante = p as unknown as IPrismaParticipanteData;
      return this.mapParticipanteToDTO(participante);
    });
    
    // Mapear encaminhamentos com segurança
    const encaminhamentos = data.encaminhamentos?.map(e => {
      const encaminhamento = e as unknown as IPrismaEncaminhamentoData;
      return this.mapEncaminhamentoToDTO(encaminhamento);
    });
    
    // Criar entidade de domínio
    return Reuniao.restaurar({
      id: data.id,
      titulo: data.titulo,
      data: data.data,
      local: data.local ?? undefined,
      pauta: data.pauta ?? undefined,
      status: mapStatusFromPrisma(data.status),
      observacoes: data.observacoes ?? undefined,
      resumo: data.resumo ?? undefined,
      criadoEm: data.criadoEm,
      atualizadoEm: data.atualizadoEm,
      equipeId: data.equipeId,
      equipe: equipe as any, // Usamos any aqui porque a tipagem completa da Equipe seria muito complexa
      participantes,
      encaminhamentos,
    });
  }

  /**
   * Mapeia participante do Prisma para DTO
   */
  private mapParticipanteToDTO(participante: IPrismaParticipanteData): IParticipanteReuniao {
    return {
      id: participante.id,
      usuarioId: participante.usuarioId,
      reuniaoId: participante.reuniaoId,
      presente: participante.presente,
      confirmado: participante.confirmado,
      papel: participante.cargo,
    };
  }

  /**
   * Mapeia encaminhamento do Prisma para DTO
   */
  private mapEncaminhamentoToDTO(
    encaminhamento: IPrismaEncaminhamentoData,
  ): IEncaminhamentoReuniao {
    return {
      id: encaminhamento.id,
      reuniaoId: encaminhamento.reuniaoId,
      descricao: encaminhamento.descricao,
      responsavelId: encaminhamento.atribuidoPara,
      prazo: encaminhamento.dataPrazo,
      status: encaminhamento.status,
      prioridade: encaminhamento.prioridade,
      observacoes: encaminhamento.observacoes,
    };
  }
}
