import { injectable } from 'tsyringe';
import {
  Relatorio,
  AnexoRelatorio,
  CompartilhamentoRelatorio,
  VisualizacaoRelatorio,
} from '../../../domain/entities/relatorio.entity';
import { IRelatorioRepository } from '../../../domain/repositories/relatorio-repository.interface';
import {
  ICriarRelatorioDTO,
  IAtualizarRelatorioDTO,
  FiltrosRelatorioDTO,
} from '../../../domain/dtos/relatorio.dto';
import { AppError } from '../../../shared/errors/app-error';
import {
  // Utilitários
  handlePrismaResult,
  IRelatorioModel,
  
  // Tipos de dados
  IPrismaRelatorioData,
  IPrismaAnexoRelatorioData,
  IPrismaCompartilhamentoRelatorioData,
  IPrismaVisualizacaoRelatorioData,
  sanitizeForPrisma,
  mapPrismaError,
  mapStatusFromPrisma,
  mapStatusToPrisma,
  Status,
  TipoRelatorio,
  PeriodoRelatorio,
  ensurePrismaModel,
} from '../../repositories/index/index';

/**
 * Implementação do repositório de relatórios usando Prisma
 */
@injectable()
export class PrismaRelatorioRepository implements IRelatorioRepository {
  /**
   * Busca todos os relatórios
   */
  async findAll(): Promise<Relatorio[]> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const relatorioModel = ensurePrismaModel<IRelatorioModel>(this.prisma, 'relatorio');

      // Buscar todos os relatórios
      const relatorios = await relatorioModel.findMany({
        include: {
          responsavel: true,
          instituicao: true,
          estudante: true,
          turma: true,
          equipe: true,
          anexos: true,
          compartilhamentos: true,
          visualizacoes: true,
        },
        orderBy: {
          dataInicio: 'desc',
        },
      });

      // Mapear para o domínio
      return relatorios.map((relatorio) => this.mapToDomain(relatorio as IPrismaRelatorioData));
    } catch (error) {
      throw mapPrismaError(error, 'Relatorio');
    }
  }

  /**
   * Busca um relatório por ID
   */
  async findById(id: string): Promise<Relatorio | null> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const relatorioModel = ensurePrismaModel<IRelatorioModel>(this.prisma, 'relatorio');

      // Buscar o relatório pelo ID
      const relatorio = await relatorioModel.findUnique({
        where: { id },
        include: {
          responsavel: true,
          instituicao: true,
          estudante: true,
          turma: true,
          equipe: true,
          anexos: true,
          compartilhamentos: true,
          visualizacoes: true,
        },
      });

      // Retornar null se não encontrar ou mapear para o domínio
      return handlePrismaResult(relatorio, (data) =>
        this.mapToDomain(data as IPrismaRelatorioData),
      );
    } catch (error) {
      throw mapPrismaError(error, 'Relatorio');
    }
  }

  /**
   * Cria um novo relatório
   */
  async create(data: ICriarRelatorioDTO): Promise<Relatorio> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const relatorioModel = ensurePrismaModel<IRelatorioModel>(this.prisma, 'relatorio');

      // Preparar os dados para criação
      const createData = sanitizeForPrisma({
        titulo: data.titulo,
        descricao: data.descricao,
        tipo: data.tipo,
        periodo: data.periodo,
        dataInicio: data.dataInicio,
        dataFim: data.dataFim,
        responsavelId: data.responsavelId,
        instituicaoId: data.instituicaoId,
        estudanteId: data.estudanteId,
        turmaId: data.turmaId,
        equipeId: data.equipeId,
        observacoes: data.observacoes,
        conteudo: data.conteudo,
        metadados: data.metadados,
        status: mapStatusToPrisma(Status.ATIVO),
      });

      // Criar o relatório
      const relatorio = await relatorioModel.create({
        data: createData,
        include: {
          responsavel: true,
          instituicao: true,
          estudante: true,
          turma: true,
          equipe: true,
        },
      });

      // Mapear para o domínio
      return this.mapToDomain(relatorio as IPrismaRelatorioData);
    } catch (error) {
      throw mapPrismaError(error, 'Relatorio');
    }
  }

  /**
   * Atualiza um relatório existente
   */
  async update(id: string, data: IAtualizarRelatorioDTO): Promise<Relatorio> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const relatorioModel = ensurePrismaModel<IRelatorioModel>(this.prisma, 'relatorio');

      // Verificar se o relatório existe
      const relatorioExistente = await relatorioModel.findUnique({
        where: { id },
      });

      if (!relatorioExistente) {
        throw new AppError('Relatório não encontrado', 404);
      }

      // Preparar os dados para atualização
      const updateData = sanitizeForPrisma({
        titulo: data.titulo,
        descricao: data.descricao,
        tipo: data.tipo,
        periodo: data.periodo,
        dataInicio: data.dataInicio,
        dataFim: data.dataFim,
        responsavelId: data.responsavelId,
        instituicaoId: data.instituicaoId,
        estudanteId: data.estudanteId,
        turmaId: data.turmaId,
        equipeId: data.equipeId,
        observacoes: data.observacoes,
        conteudo: data.conteudo,
        metadados: data.metadados,
        status: data.status ? mapStatusToPrisma(data.status) : undefined,
      });

      // Atualizar o relatório
      const relatorio = await relatorioModel.update({
        where: { id },
        data: updateData,
        include: {
          responsavel: true,
          instituicao: true,
          estudante: true,
          turma: true,
          equipe: true,
          anexos: true,
          compartilhamentos: true,
          visualizacoes: true,
        },
      });

      // Mapear para o domínio
      return this.mapToDomain(relatorio as IPrismaRelatorioData);
    } catch (error) {
      throw mapPrismaError(error, 'Relatorio');
    }
  }

  /**
   * Exclui um relatório
   */
  async delete(id: string): Promise<void> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const relatorioModel = ensurePrismaModel<IRelatorioModel>(this.prisma, 'relatorio');

      // Verificar se o relatório existe
      const relatorioExistente = await relatorioModel.findUnique({
        where: { id },
      });

      if (!relatorioExistente) {
        throw new AppError('Relatório não encontrado', 404);
      }

      // Excluir o relatório
      await relatorioModel.delete({
        where: { id },
      });
    } catch (error) {
      throw mapPrismaError(error, 'Relatorio');
    }
  }

  // Implementações específicas para interface IRelatorioRepository

  /**
   * Busca um relatório por ID (alias para findById)
   */
  async buscarPorId(id: string): Promise<Relatorio | null> {
    return this.findById(id);
  }

  /**
   * Lista relatórios com base em filtros opcionais
   */
  async listar(filtros?: FiltrosRelatorioDTO): Promise<Relatorio[]> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const relatorioModel = ensurePrismaModel<IRelatorioModel>(this.prisma, 'relatorio');

      // Construir o filtro com base nos parâmetros recebidos
      const where: any = {};

      if (filtros?.titulo) {
        where.titulo = {
          contains: filtros.titulo,
          mode: 'insensitive',
        };
      }

      if (filtros?.tipo) {
        where.tipo = filtros.tipo;
      }

      if (filtros?.periodo) {
        where.periodo = filtros.periodo;
      }

      if (filtros?.dataInicio) {
        where.dataInicio = { gte: filtros.dataInicio };
      }

      if (filtros?.dataFim) {
        where.dataFim = { lte: filtros.dataFim };
      }

      if (filtros?.responsavelId) {
        where.responsavelId = filtros.responsavelId;
      }

      if (filtros?.instituicaoId) {
        where.instituicaoId = filtros.instituicaoId;
      }

      if (filtros?.estudanteId) {
        where.estudanteId = filtros.estudanteId;
      }

      if (filtros?.turmaId) {
        where.turmaId = filtros.turmaId;
      }

      if (filtros?.equipeId) {
        where.equipeId = filtros.equipeId;
      }

      if (filtros?.status) {
        where.status = mapStatusToPrisma(filtros.status);
      }

      // Buscar os relatórios aplicando os filtros
      const relatorios = await relatorioModel.findMany({
        where,
        include: {
          responsavel: true,
          instituicao: true,
          estudante: true,
          turma: true,
          equipe: true,
          anexos: true,
          compartilhamentos: true,
          visualizacoes: true,
        },
        orderBy: {
          dataInicio: 'desc',
        },
      });

      // Mapear para o domínio
      return relatorios.map((relatorio) => this.mapToDomain(relatorio as IPrismaRelatorioData));
    } catch (error) {
      throw mapPrismaError(error, 'Relatorio');
    }
  }

  /**
   * Cria um novo relatório (alias para create)
   */
  async criar(relatorio: Relatorio): Promise<Relatorio> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const relatorioModel = ensurePrismaModel<IRelatorioModel>(this.prisma, 'relatorio');

      // Preparar os dados para criação
      const createData = sanitizeForPrisma({
        titulo: relatorio.titulo,
        descricao: relatorio.descricao,
        tipo: relatorio.tipo,
        periodo: relatorio.periodo,
        dataInicio: relatorio.dataInicio,
        dataFim: relatorio.dataFim,
        responsavelId: relatorio.responsavelId,
        instituicaoId: relatorio.instituicaoId,
        estudanteId: relatorio.estudanteId,
        turmaId: relatorio.turmaId,
        equipeId: relatorio.equipeId,
        observacoes: relatorio.observacoes,
        conteudo: relatorio.conteudo,
        metadados: relatorio.metadados,
        status: mapStatusToPrisma(relatorio.status),
      });

      // Criar o relatório
      const novoRelatorio = await relatorioModel.create({
        data: createData,
        include: {
          responsavel: true,
          instituicao: true,
          estudante: true,
          turma: true,
          equipe: true,
        },
      });

      // Mapear para o domínio
      return this.mapToDomain(novoRelatorio as IPrismaRelatorioData);
    } catch (error) {
      throw mapPrismaError(error, 'Relatorio');
    }
  }

  /**
   * Atualiza um relatório existente (alias para update)
   */
  async atualizar(id: string, relatorio: Relatorio): Promise<Relatorio> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const relatorioModel = ensurePrismaModel<IRelatorioModel>(this.prisma, 'relatorio');

      // Verificar se o relatório existe
      const relatorioExistente = await relatorioModel.findUnique({
        where: { id },
      });

      if (!relatorioExistente) {
        throw new AppError('Relatório não encontrado', 404);
      }

      // Preparar os dados para atualização
      const updateData = sanitizeForPrisma({
        titulo: relatorio.titulo,
        descricao: relatorio.descricao,
        tipo: relatorio.tipo,
        periodo: relatorio.periodo,
        dataInicio: relatorio.dataInicio,
        dataFim: relatorio.dataFim,
        responsavelId: relatorio.responsavelId,
        instituicaoId: relatorio.instituicaoId,
        estudanteId: relatorio.estudanteId,
        turmaId: relatorio.turmaId,
        equipeId: relatorio.equipeId,
        observacoes: relatorio.observacoes,
        conteudo: relatorio.conteudo,
        metadados: relatorio.metadados,
        status: mapStatusToPrisma(relatorio.status),
      });

      // Atualizar o relatório
      const relatorioDB = await relatorioModel.update({
        where: { id },
        data: updateData,
        include: {
          responsavel: true,
          instituicao: true,
          estudante: true,
          turma: true,
          equipe: true,
          anexos: true,
          compartilhamentos: true,
          visualizacoes: true,
        },
      });

      // Mapear para o domínio
      return this.mapToDomain(relatorioDB as IPrismaRelatorioData);
    } catch (error) {
      throw mapPrismaError(error, 'Relatorio');
    }
  }

  /**
   * Lista relatórios por ID do estudante
   */
  async listarPorEstudanteId(estudanteId: string): Promise<Relatorio[]> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const relatorioModel = ensurePrismaModel<IRelatorioModel>(this.prisma, 'relatorio');

      // Buscar os relatórios por estudante
      const relatorios = await relatorioModel.findMany({
        where: {
          estudanteId,
          status: { not: mapStatusToPrisma(Status.CANCELADO) },
        },
        include: {
          responsavel: true,
          instituicao: true,
          estudante: true,
          anexos: true,
          compartilhamentos: true,
          visualizacoes: true,
        },
        orderBy: {
          dataInicio: 'desc',
        },
      });

      // Mapear para o domínio
      return relatorios.map((relatorio) => this.mapToDomain(relatorio as IPrismaRelatorioData));
    } catch (error) {
      throw mapPrismaError(error, 'Relatorio');
    }
  }

  /**
   * Lista relatórios por ID da turma
   */
  async listarPorTurmaId(turmaId: string): Promise<Relatorio[]> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const relatorioModel = ensurePrismaModel<IRelatorioModel>(this.prisma, 'relatorio');

      // Buscar os relatórios por turma
      const relatorios = await relatorioModel.findMany({
        where: {
          turmaId,
          status: { not: mapStatusToPrisma(Status.CANCELADO) },
        },
        include: {
          responsavel: true,
          instituicao: true,
          turma: true,
          anexos: true,
          compartilhamentos: true,
          visualizacoes: true,
        },
        orderBy: {
          dataInicio: 'desc',
        },
      });

      // Mapear para o domínio
      return relatorios.map((relatorio) => this.mapToDomain(relatorio as IPrismaRelatorioData));
    } catch (error) {
      throw mapPrismaError(error, 'Relatorio');
    }
  }

  /**
   * Lista relatórios por ID da equipe
   */
  async listarPorEquipeId(equipeId: string): Promise<Relatorio[]> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const relatorioModel = ensurePrismaModel<IRelatorioModel>(this.prisma, 'relatorio');

      // Buscar os relatórios por equipe
      const relatorios = await relatorioModel.findMany({
        where: {
          equipeId,
          status: { not: mapStatusToPrisma(Status.CANCELADO) },
        },
        include: {
          responsavel: true,
          instituicao: true,
          equipe: true,
          anexos: true,
          compartilhamentos: true,
          visualizacoes: true,
        },
        orderBy: {
          dataInicio: 'desc',
        },
      });

      // Mapear para o domínio
      return relatorios.map((relatorio) => this.mapToDomain(relatorio as IPrismaRelatorioData));
    } catch (error) {
      throw mapPrismaError(error, 'Relatorio');
    }
  }

  /**
   * Lista relatórios por ID do responsável
   */
  async listarPorResponsavelId(responsavelId: string): Promise<Relatorio[]> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const relatorioModel = ensurePrismaModel<IRelatorioModel>(this.prisma, 'relatorio');

      // Buscar os relatórios por responsável
      const relatorios = await relatorioModel.findMany({
        where: {
          responsavelId,
          status: { not: mapStatusToPrisma(Status.CANCELADO) },
        },
        include: {
          responsavel: true,
          instituicao: true,
          estudante: true,
          turma: true,
          equipe: true,
          anexos: true,
          compartilhamentos: true,
          visualizacoes: true,
        },
        orderBy: {
          dataInicio: 'desc',
        },
      });

      // Mapear para o domínio
      return relatorios.map((relatorio) => this.mapToDomain(relatorio as IPrismaRelatorioData));
    } catch (error) {
      throw mapPrismaError(error, 'Relatorio');
    }
  }

  /**
   * Lista relatórios por ID da instituição
   */
  async listarPorInstituicaoId(instituicaoId: string): Promise<Relatorio[]> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const relatorioModel = ensurePrismaModel<IRelatorioModel>(this.prisma, 'relatorio');

      // Buscar os relatórios por instituição
      const relatorios = await relatorioModel.findMany({
        where: {
          instituicaoId,
          status: { not: mapStatusToPrisma(Status.CANCELADO) },
        },
        include: {
          responsavel: true,
          instituicao: true,
          estudante: true,
          turma: true,
          equipe: true,
          anexos: true,
          compartilhamentos: true,
          visualizacoes: true,
        },
        orderBy: {
          dataInicio: 'desc',
        },
      });

      // Mapear para o domínio
      return relatorios.map((relatorio) => this.mapToDomain(relatorio as IPrismaRelatorioData));
    } catch (error) {
      throw mapPrismaError(error, 'Relatorio');
    }
  }

  /**
   * Lista relatórios por tipo
   */
  async listarPorTipo(tipo: TipoRelatorio): Promise<Relatorio[]> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const relatorioModel = ensurePrismaModel<IRelatorioModel>(this.prisma, 'relatorio');

      // Buscar os relatórios por tipo
      const relatorios = await relatorioModel.findMany({
        where: {
          tipo,
          status: { not: mapStatusToPrisma(Status.CANCELADO) },
        },
        include: {
          responsavel: true,
          instituicao: true,
          estudante: true,
          turma: true,
          equipe: true,
          anexos: true,
          compartilhamentos: true,
          visualizacoes: true,
        },
        orderBy: {
          dataInicio: 'desc',
        },
      });

      // Mapear para o domínio
      return relatorios.map((relatorio) => this.mapToDomain(relatorio as IPrismaRelatorioData));
    } catch (error) {
      throw mapPrismaError(error, 'Relatorio');
    }
  }

  /**
   * Lista relatórios por período
   */
  async listarPorPeriodo(periodo: PeriodoRelatorio): Promise<Relatorio[]> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const relatorioModel = ensurePrismaModel<IRelatorioModel>(this.prisma, 'relatorio');

      // Buscar os relatórios por período
      const relatorios = await relatorioModel.findMany({
        where: {
          periodo,
          status: { not: mapStatusToPrisma(Status.CANCELADO) },
        },
        include: {
          responsavel: true,
          instituicao: true,
          estudante: true,
          turma: true,
          equipe: true,
          anexos: true,
          compartilhamentos: true,
          visualizacoes: true,
        },
        orderBy: {
          dataInicio: 'desc',
        },
      });

      // Mapear para o domínio
      return relatorios.map((relatorio) => this.mapToDomain(relatorio as IPrismaRelatorioData));
    } catch (error) {
      throw mapPrismaError(error, 'Relatorio');
    }
  }

  /**
   * Lista relatórios por intervalo de datas
   */
  async listarPorIntervaloData(dataInicio: Date, dataFim: Date): Promise<Relatorio[]> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const relatorioModel = ensurePrismaModel<IRelatorioModel>(this.prisma, 'relatorio');

      // Buscar os relatórios por intervalo de datas
      const relatorios = await relatorioModel.findMany({
        where: {
          dataInicio: { gte: dataInicio },
          dataFim: { lte: dataFim },
          status: { not: mapStatusToPrisma(Status.CANCELADO) },
        },
        include: {
          responsavel: true,
          instituicao: true,
          estudante: true,
          turma: true,
          equipe: true,
          anexos: true,
          compartilhamentos: true,
          visualizacoes: true,
        },
        orderBy: {
          dataInicio: 'desc',
        },
      });

      // Mapear para o domínio
      return relatorios.map((relatorio) => this.mapToDomain(relatorio as IPrismaRelatorioData));
    } catch (error) {
      throw mapPrismaError(error, 'Relatorio');
    }
  }

  /**
   * Conta relatórios por ID do estudante
   */
  async contarPorEstudanteId(estudanteId: string): Promise<number> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const relatorioModel = ensurePrismaModel<IRelatorioModel>(this.prisma, 'relatorio');

      // Contar os relatórios por estudante
      const count = await relatorioModel.findMany({
        where: {
          estudanteId,
          status: { not: mapStatusToPrisma(Status.CANCELADO) },
        },
      });

      return count.length;
    } catch (error) {
      throw mapPrismaError(error, 'Relatorio');
    }
  }

  /**
   * Conta relatórios por ID da equipe
   */
  async contarPorEquipeId(equipeId: string): Promise<number> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const relatorioModel = ensurePrismaModel<IRelatorioModel>(this.prisma, 'relatorio');

      // Contar os relatórios por equipe
      const count = await relatorioModel.findMany({
        where: {
          equipeId,
          status: { not: mapStatusToPrisma(Status.CANCELADO) },
        },
      });

      return count.length;
    } catch (error) {
      throw mapPrismaError(error, 'Relatorio');
    }
  }

  /**
   * Conta relatórios por tipo
   */
  async contarPorTipo(tipo: TipoRelatorio): Promise<number> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const relatorioModel = ensurePrismaModel<IRelatorioModel>(this.prisma, 'relatorio');

      // Contar os relatórios por tipo
      const count = await relatorioModel.findMany({
        where: {
          tipo,
          status: { not: mapStatusToPrisma(Status.CANCELADO) },
        },
      });

      return count.length;
    } catch (error) {
      throw mapPrismaError(error, 'Relatorio');
    }
  }

  /**
   * Conta relatórios por período
   */
  async contarPorPeriodo(periodo: PeriodoRelatorio): Promise<number> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const relatorioModel = ensurePrismaModel<IRelatorioModel>(this.prisma, 'relatorio');

      // Contar os relatórios por período
      const count = await relatorioModel.findMany({
        where: {
          periodo,
          status: { not: mapStatusToPrisma(Status.CANCELADO) },
        },
      });

      return count.length;
    } catch (error) {
      throw mapPrismaError(error, 'Relatorio');
    }
  }

  /**
   * Mapeia dados do Prisma para a entidade de domínio Relatorio
   */
  private mapToDomain(data: IPrismaRelatorioData): Relatorio {
    // Mapear os anexos
    const anexos = data.anexos
      ? data.anexos.map((anexo) => this.mapAnexoToDomain(anexo as IPrismaAnexoRelatorioData))
      : [];

    // Mapear os compartilhamentos
    const compartilhamentos = data.compartilhamentos
      ? data.compartilhamentos.map((compartilhamento) =>
          this.mapCompartilhamentoToDomain(
            compartilhamento as IPrismaCompartilhamentoRelatorioData,
          ),
        )
      : [];

    // Mapear as visualizações
    const visualizacoes = data.visualizacoes
      ? data.visualizacoes.map((visualizacao) =>
          this.mapVisualizacaoToDomain(visualizacao as IPrismaVisualizacaoRelatorioData),
        )
      : [];

    // Mapear a entidade principal
    return Relatorio.restaurar({
      id: data.id,
      titulo: data.titulo,
      descricao: data.descricao,
      tipo: data.tipo as TipoRelatorio,
      periodo: data.periodo as PeriodoRelatorio,
      dataInicio: data.dataInicio,
      dataFim: data.dataFim,
      responsavelId: data.responsavelId,
      instituicaoId: data.instituicaoId,
      estudanteId: data.estudanteId,
      turmaId: data.turmaId,
      equipeId: data.equipeId,
      observacoes: data.observacoes,
      conteudo: data.conteudo,
      metadados: data.metadados,
      status: mapStatusFromPrisma(data.status),
      anexos,
      compartilhamentos,
      visualizacoes,
      criadoEm: data.criadoEm,
      atualizadoEm: data.atualizadoEm,
    });
  }

  /**
   * Mapeia dados do Prisma para a entidade AnexoRelatorio
   */
  private mapAnexoToDomain(data: IPrismaAnexoRelatorioData): AnexoRelatorio {
    return AnexoRelatorio.restaurar({
      id: data.id,
      relatorioId: data.relatorioId,
      nomeArquivo: data.nomeArquivo,
      urlArquivo: data.urlArquivo,
      tipoArquivo: data.tipoArquivo,
      tamanhoArquivo: data.tamanhoArquivo,
      descricao: data.descricao,
      criadoEm: data.criadoEm,
      atualizadoEm: data.atualizadoEm,
    });
  }

  /**
   * Mapeia dados do Prisma para a entidade CompartilhamentoRelatorio
   */
  private mapCompartilhamentoToDomain(
    data: IPrismaCompartilhamentoRelatorioData,
  ): CompartilhamentoRelatorio {
    return CompartilhamentoRelatorio.restaurar({
      id: data.id,
      relatorioId: data.relatorioId,
      usuarioId: data.usuarioId,
      permiteEdicao: data.permiteEdicao,
      permiteCompartilhamento: data.permiteCompartilhamento,
      mensagem: data.mensagem,
      compartilhadoEm: data.compartilhadoEm,
      atualizadoEm: data.atualizadoEm,
    });
  }

  /**
   * Mapeia dados do Prisma para a entidade VisualizacaoRelatorio
   */
  private mapVisualizacaoToDomain(data: IPrismaVisualizacaoRelatorioData): VisualizacaoRelatorio {
    return VisualizacaoRelatorio.restaurar({
      id: data.id,
      relatorioId: data.relatorioId,
      usuarioId: data.usuarioId,
      visualizadoEm: data.visualizadoEm,
    });
  }
}
