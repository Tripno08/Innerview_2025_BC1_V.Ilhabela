import { injectable } from 'tsyringe';
import { VisualizacaoRelatorio } from '../../../domain/entities/relatorio.entity';
import { IVisualizacaoRelatorioRepository } from '../../../domain/repositories/visualizacao-relatorio-repository.interface';
import { IRegistrarVisualizacaoRelatorioDTO } from '../../../domain/dtos/relatorio.dto';
import { AppError } from '../../../shared/errors/app-error';
import {
  // Importações centralizadas
  
  ensurePrismaModel,
  handlePrismaResult,
  IVisualizacaoRelatorioModel,
  IPrismaVisualizacaoRelatorioData,
  sanitizeForPrisma,
  mapPrismaError,
} from '../../repositories/index/index';

/**
 * Implementação do repositório de visualizações de relatório usando Prisma
 */
@injectable()
export class PrismaVisualizacaoRelatorioRepository implements IVisualizacaoRelatorioRepository {
  /**
   * Busca todas as visualizações
   */
  async findAll(): Promise<VisualizacaoRelatorio[]> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const visualizacaoModel = ensurePrismaModel<IVisualizacaoRelatorioModel>(
        this.prisma,
        'visualizacaoRelatorio',
      );

      // Buscar todas as visualizações
      const visualizacoes = await visualizacaoModel.findMany({
        include: {
          relatorio: true,
          usuario: true,
        },
      });

      // Mapear para o domínio
      return visualizacoes.map((visualizacao) =>
        this.mapToDomain(visualizacao as IPrismaVisualizacaoRelatorioData),
      );
    } catch (error) {
      throw mapPrismaError(error, 'VisualizacaoRelatorio');
    }
  }

  /**
   * Busca uma visualização por ID
   */
  async findById(id: string): Promise<VisualizacaoRelatorio | null> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const visualizacaoModel = ensurePrismaModel<IVisualizacaoRelatorioModel>(
        this.prisma,
        'visualizacaoRelatorio',
      );

      // Buscar a visualização pelo ID
      const visualizacao = await visualizacaoModel.findMany({
        where: { id },
        include: {
          relatorio: true,
          usuario: true,
        },
      });

      // Retornar null se não encontrar ou mapear para o domínio
      return handlePrismaResult(visualizacao.length > 0 ? visualizacao[0] : null, (data) =>
        this.mapToDomain(data as IPrismaVisualizacaoRelatorioData),
      );
    } catch (error) {
      throw mapPrismaError(error, 'VisualizacaoRelatorio');
    }
  }

  /**
   * Cria uma nova visualização
   */
  async create(data: IRegistrarVisualizacaoRelatorioDTO): Promise<VisualizacaoRelatorio> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const visualizacaoModel = ensurePrismaModel<IVisualizacaoRelatorioModel>(
        this.prisma,
        'visualizacaoRelatorio',
      );

      // Criar instância da entidade
      const visualizacao = VisualizacaoRelatorio.criar({
        relatorioId: data.relatorioId,
        usuarioId: data.usuarioId,
      });

      // Preparar os dados para criação
      const createData = sanitizeForPrisma({
        id: visualizacao.id,
        relatorioId: visualizacao.relatorioId,
        usuarioId: visualizacao.usuarioId,
        visualizadoEm: visualizacao.visualizadoEm,
      });

      // Criar a visualização no banco
      const novaVisualizacao = await visualizacaoModel.create({
        data: createData,
      });

      // Mapear para o domínio
      return this.mapToDomain(novaVisualizacao as IPrismaVisualizacaoRelatorioData);
    } catch (error) {
      throw mapPrismaError(error, 'VisualizacaoRelatorio');
    }
  }

  /**
   * Atualiza uma visualização existente (não aplicável para visualizações)
   */
  async update(id: string, data: any): Promise<VisualizacaoRelatorio> {
    throw new AppError('Visualizações não podem ser atualizadas', 400);
  }

  /**
   * Exclui uma visualização
   */
  async delete(id: string): Promise<void> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const visualizacaoModel = ensurePrismaModel<IVisualizacaoRelatorioModel>(
        this.prisma,
        'visualizacaoRelatorio',
      );

      // Verificar se a visualização existe
      const visualizacaoExistente = await this.findById(id);
      if (!visualizacaoExistente) {
        throw new AppError('Visualização de relatório não encontrada', 404);
      }

      // Excluir a visualização
      await visualizacaoModel.delete({
        where: { id },
      });
    } catch (error) {
      throw mapPrismaError(error, 'VisualizacaoRelatorio');
    }
  }

  /**
   * Busca uma visualização por ID (alias para findById)
   */
  async buscarPorId(id: string): Promise<VisualizacaoRelatorio | null> {
    return this.findById(id);
  }

  /**
   * Lista todas as visualizações de um relatório
   */
  async listarPorRelatorioId(relatorioId: string): Promise<VisualizacaoRelatorio[]> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const visualizacaoModel = ensurePrismaModel<IVisualizacaoRelatorioModel>(
        this.prisma,
        'visualizacaoRelatorio',
      );

      // Buscar as visualizações pelo relatorioId
      const visualizacoes = await visualizacaoModel.findMany({
        where: { relatorioId },
        include: {
          relatorio: true,
          usuario: true,
        },
        orderBy: {
          visualizadoEm: 'desc',
        },
      });

      // Mapear para o domínio
      return visualizacoes.map((visualizacao) =>
        this.mapToDomain(visualizacao as IPrismaVisualizacaoRelatorioData),
      );
    } catch (error) {
      throw mapPrismaError(error, 'VisualizacaoRelatorio');
    }
  }

  /**
   * Lista todas as visualizações de um usuário
   */
  async listarPorUsuarioId(usuarioId: string): Promise<VisualizacaoRelatorio[]> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const visualizacaoModel = ensurePrismaModel<IVisualizacaoRelatorioModel>(
        this.prisma,
        'visualizacaoRelatorio',
      );

      // Buscar as visualizações pelo usuarioId
      const visualizacoes = await visualizacaoModel.findMany({
        where: { usuarioId },
        include: {
          relatorio: true,
          usuario: true,
        },
        orderBy: {
          visualizadoEm: 'desc',
        },
      });

      // Mapear para o domínio
      return visualizacoes.map((visualizacao) =>
        this.mapToDomain(visualizacao as IPrismaVisualizacaoRelatorioData),
      );
    } catch (error) {
      throw mapPrismaError(error, 'VisualizacaoRelatorio');
    }
  }

  /**
   * Busca a última visualização de um relatório por um usuário específico
   */
  async buscarUltimaPorRelatorioIdEUsuarioId(
    relatorioId: string,
    usuarioId: string,
  ): Promise<VisualizacaoRelatorio | null> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const visualizacaoModel = ensurePrismaModel<IVisualizacaoRelatorioModel>(
        this.prisma,
        'visualizacaoRelatorio',
      );

      // Buscar as visualizações pelo relatorioId e usuarioId, ordenadas pela data de visualização
      const visualizacoes = await visualizacaoModel.findMany({
        where: {
          relatorioId,
          usuarioId,
        },
        include: {
          relatorio: true,
          usuario: true,
        },
        orderBy: {
          visualizadoEm: 'desc',
        },
        take: 1,
      });

      // Retornar null se não encontrar ou mapear para o domínio
      return handlePrismaResult(visualizacoes.length > 0 ? visualizacoes[0] : null, (data) =>
        this.mapToDomain(data as IPrismaVisualizacaoRelatorioData),
      );
    } catch (error) {
      throw mapPrismaError(error, 'VisualizacaoRelatorio');
    }
  }

  /**
   * Cria uma nova visualização (alias para create)
   */
  async criar(visualizacao: VisualizacaoRelatorio): Promise<VisualizacaoRelatorio> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const visualizacaoModel = ensurePrismaModel<IVisualizacaoRelatorioModel>(
        this.prisma,
        'visualizacaoRelatorio',
      );

      // Preparar os dados para criação
      const createData = sanitizeForPrisma({
        id: visualizacao.id,
        relatorioId: visualizacao.relatorioId,
        usuarioId: visualizacao.usuarioId,
        visualizadoEm: visualizacao.visualizadoEm,
      });

      // Criar a visualização
      const novaVisualizacao = await visualizacaoModel.create({
        data: createData,
      });

      // Mapear para o domínio
      return this.mapToDomain(novaVisualizacao as IPrismaVisualizacaoRelatorioData);
    } catch (error) {
      throw mapPrismaError(error, 'VisualizacaoRelatorio');
    }
  }

  /**
   * Conta o número de visualizações de um relatório
   */
  async contarPorRelatorioId(relatorioId: string): Promise<number> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const visualizacaoModel = ensurePrismaModel<IVisualizacaoRelatorioModel>(
        this.prisma,
        'visualizacaoRelatorio',
      );

      // Contar as visualizações
      const visualizacoes = await visualizacaoModel.findMany({
        where: { relatorioId },
      });

      return visualizacoes.length;
    } catch (error) {
      throw mapPrismaError(error, 'VisualizacaoRelatorio');
    }
  }

  /**
   * Conta o número de visualizações por usuário
   */
  async contarPorUsuarioId(usuarioId: string): Promise<number> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const visualizacaoModel = ensurePrismaModel<IVisualizacaoRelatorioModel>(
        this.prisma,
        'visualizacaoRelatorio',
      );

      // Contar as visualizações
      const visualizacoes = await visualizacaoModel.findMany({
        where: { usuarioId },
      });

      return visualizacoes.length;
    } catch (error) {
      throw mapPrismaError(error, 'VisualizacaoRelatorio');
    }
  }

  /**
   * Remove todas as visualizações de um relatório
   */
  async removerTodasPorRelatorioId(relatorioId: string): Promise<void> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const visualizacaoModel = ensurePrismaModel<IVisualizacaoRelatorioModel>(
        this.prisma,
        'visualizacaoRelatorio',
      );

      // Excluir as visualizações
      await visualizacaoModel.deleteMany({
        where: { relatorioId },
      });
    } catch (error) {
      throw mapPrismaError(error, 'VisualizacaoRelatorio');
    }
  }

  /**
   * Mapeia dados do Prisma para a entidade de domínio VisualizacaoRelatorio
   */
  private mapToDomain(data: IPrismaVisualizacaoRelatorioData): VisualizacaoRelatorio {
    return VisualizacaoRelatorio.restaurar({
      id: data.id,
      relatorioId: data.relatorioId,
      usuarioId: data.usuarioId,
      visualizadoEm: data.visualizadoEm,
    });
  }
}
