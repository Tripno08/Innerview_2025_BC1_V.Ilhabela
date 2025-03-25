import { injectable } from 'tsyringe';
import { CompartilhamentoRelatorio } from '../../../domain/entities/relatorio.entity';
import { ICompartilhamentoRelatorioRepository } from '../../../domain/repositories/compartilhamento-relatorio-repository.interface';
import { ICompartilharRelatorioDTO } from '../../../domain/dtos/relatorio.dto';
import { AppError } from '../../../shared/errors/app-error';
import {
  // Importações centralizadas
  
  ensurePrismaModel,
  handlePrismaResult,
  ICompartilhamentoRelatorioModel,
  IPrismaCompartilhamentoRelatorioData,
  sanitizeForPrisma,
  mapPrismaError,
} from '../../repositories/index/index';

/**
 * DTO para atualizar um compartilhamento de relatório
 */
interface IAtualizarCompartilhamentoRelatorioDTO {
  permiteEdicao?: boolean;
  permiteCompartilhamento?: boolean;
  mensagem?: string;
}

/**
 * @deprecated Use IAtualizarCompartilhamentoRelatorioDTO instead. Este alias será removido em versões futuras.
 */
type AtualizarCompartilhamentoRelatorioDTO = IAtualizarCompartilhamentoRelatorioDTO;

/**
 * Implementação do repositório de compartilhamentos de relatório usando Prisma
 */
@injectable()
export class PrismaCompartilhamentoRelatorioRepository
  implements ICompartilhamentoRelatorioRepository
{
  /**
   * Busca todos os compartilhamentos
   */
  async findAll(): Promise<CompartilhamentoRelatorio[]> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const compartilhamentoModel = ensurePrismaModel<ICompartilhamentoRelatorioModel>(
        this.prisma,
        'compartilhamentoRelatorio',
      );

      // Buscar todos os compartilhamentos
      const compartilhamentos = await compartilhamentoModel.findMany({
        include: {
          relatorio: true,
          usuario: true,
        },
      });

      // Mapear para o domínio
      return compartilhamentos.map((compartilhamento) =>
        this.mapToDomain(compartilhamento as IPrismaCompartilhamentoRelatorioData),
      );
    } catch (error) {
      throw mapPrismaError(error, 'CompartilhamentoRelatorio');
    }
  }

  /**
   * Busca um compartilhamento por ID
   */
  async findById(id: string): Promise<CompartilhamentoRelatorio | null> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const compartilhamentoModel = ensurePrismaModel<ICompartilhamentoRelatorioModel>(
        this.prisma,
        'compartilhamentoRelatorio',
      );

      // Buscar o compartilhamento pelo ID
      const compartilhamento = await compartilhamentoModel.findMany({
        where: { id },
        include: {
          relatorio: true,
          usuario: true,
        },
      });

      // Retornar null se não encontrar ou mapear para o domínio
      return handlePrismaResult(compartilhamento.length > 0 ? compartilhamento[0] : null, (data) =>
        this.mapToDomain(data as IPrismaCompartilhamentoRelatorioData),
      );
    } catch (error) {
      throw mapPrismaError(error, 'CompartilhamentoRelatorio');
    }
  }

  /**
   * Cria um novo compartilhamento
   */
  async create(data: ICompartilharRelatorioDTO): Promise<CompartilhamentoRelatorio> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const compartilhamentoModel = ensurePrismaModel<ICompartilhamentoRelatorioModel>(
        this.prisma,
        'compartilhamentoRelatorio',
      );

      // Para compartilhamentos em lote, criamos um único (o primeiro) e retornamos
      if (data.usuariosIds && data.usuariosIds.length > 0) {
        const usuarioId = data.usuariosIds[0];

        // Criar instância da entidade
        const compartilhamento = CompartilhamentoRelatorio.criar({
          relatorioId: data.relatorioId,
          usuarioId,
          permiteEdicao: data.permiteEdicao || false,
          permiteCompartilhamento: data.permiteCompartilhamento || false,
          mensagem: data.mensagem,
        });

        // Preparar os dados para criação
        const createData = sanitizeForPrisma({
          id: compartilhamento.id,
          relatorioId: compartilhamento.relatorioId,
          usuarioId: compartilhamento.usuarioId,
          permiteEdicao: compartilhamento.permiteEdicao,
          permiteCompartilhamento: compartilhamento.permiteCompartilhamento,
          mensagem: compartilhamento.mensagem,
          compartilhadoEm: compartilhamento.compartilhadoEm,
          atualizadoEm: compartilhamento.atualizadoEm,
        });

        // Criar o compartilhamento no banco
        const novoCompartilhamento = await compartilhamentoModel.create({
          data: createData,
        });

        // Mapear para o domínio
        return this.mapToDomain(novoCompartilhamento as IPrismaCompartilhamentoRelatorioData);
      } else {
        throw new AppError('Pelo menos um usuário é necessário para compartilhamento', 400);
      }
    } catch (error) {
      throw mapPrismaError(error, 'CompartilhamentoRelatorio');
    }
  }

  /**
   * Atualiza um compartilhamento existente
   */
  async update(
    id: string,
    data: IAtualizarCompartilhamentoRelatorioDTO,
  ): Promise<CompartilhamentoRelatorio> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const compartilhamentoModel = ensurePrismaModel<ICompartilhamentoRelatorioModel>(
        this.prisma,
        'compartilhamentoRelatorio',
      );

      // Verificar se o compartilhamento existe
      const compartilhamentoExistente = await this.findById(id);
      if (!compartilhamentoExistente) {
        throw new AppError('Compartilhamento de relatório não encontrado', 404);
      }

      // Preparar os dados para atualização
      const updateData = sanitizeForPrisma({
        permiteEdicao: data.permiteEdicao,
        permiteCompartilhamento: data.permiteCompartilhamento,
        mensagem: data.mensagem,
        atualizadoEm: new Date(),
      });

      // Atualizar o compartilhamento
      const compartilhamentoAtualizado = await compartilhamentoModel.update({
        where: { id },
        data: updateData,
        include: {
          relatorio: true,
          usuario: true,
        },
      });

      // Mapear para o domínio
      return this.mapToDomain(compartilhamentoAtualizado as IPrismaCompartilhamentoRelatorioData);
    } catch (error) {
      throw mapPrismaError(error, 'CompartilhamentoRelatorio');
    }
  }

  /**
   * Exclui um compartilhamento
   */
  async delete(id: string): Promise<void> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const compartilhamentoModel = ensurePrismaModel<ICompartilhamentoRelatorioModel>(
        this.prisma,
        'compartilhamentoRelatorio',
      );

      // Verificar se o compartilhamento existe
      const compartilhamentoExistente = await this.findById(id);
      if (!compartilhamentoExistente) {
        throw new AppError('Compartilhamento de relatório não encontrado', 404);
      }

      // Excluir o compartilhamento
      await compartilhamentoModel.delete({
        where: { id },
      });
    } catch (error) {
      throw mapPrismaError(error, 'CompartilhamentoRelatorio');
    }
  }

  /**
   * Busca um compartilhamento por ID (alias para findById)
   */
  async buscarPorId(id: string): Promise<CompartilhamentoRelatorio | null> {
    return this.findById(id);
  }

  /**
   * Lista todos os compartilhamentos de um relatório
   */
  async listarPorRelatorioId(relatorioId: string): Promise<CompartilhamentoRelatorio[]> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const compartilhamentoModel = ensurePrismaModel<ICompartilhamentoRelatorioModel>(
        this.prisma,
        'compartilhamentoRelatorio',
      );

      // Buscar os compartilhamentos pelo relatorioId
      const compartilhamentos = await compartilhamentoModel.findMany({
        where: { relatorioId },
        include: {
          relatorio: true,
          usuario: true,
        },
        orderBy: {
          compartilhadoEm: 'desc',
        },
      });

      // Mapear para o domínio
      return compartilhamentos.map((compartilhamento) =>
        this.mapToDomain(compartilhamento as IPrismaCompartilhamentoRelatorioData),
      );
    } catch (error) {
      throw mapPrismaError(error, 'CompartilhamentoRelatorio');
    }
  }

  /**
   * Lista compartilhamentos por relatório e usuários
   */
  async listarPorRelatorioIdEUsuariosIds(
    relatorioId: string,
    usuariosIds: string[],
  ): Promise<CompartilhamentoRelatorio[]> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const compartilhamentoModel = ensurePrismaModel<ICompartilhamentoRelatorioModel>(
        this.prisma,
        'compartilhamentoRelatorio',
      );

      // Buscar os compartilhamentos pelo relatorioId e usuariosIds
      const compartilhamentos = await compartilhamentoModel.findMany({
        where: {
          relatorioId,
          usuarioId: { in: usuariosIds },
        },
        include: {
          relatorio: true,
          usuario: true,
        },
        orderBy: {
          compartilhadoEm: 'desc',
        },
      });

      // Mapear para o domínio
      return compartilhamentos.map((compartilhamento) =>
        this.mapToDomain(compartilhamento as IPrismaCompartilhamentoRelatorioData),
      );
    } catch (error) {
      throw mapPrismaError(error, 'CompartilhamentoRelatorio');
    }
  }

  /**
   * Lista todos os compartilhamentos para um usuário
   */
  async listarPorUsuarioId(usuarioId: string): Promise<CompartilhamentoRelatorio[]> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const compartilhamentoModel = ensurePrismaModel<ICompartilhamentoRelatorioModel>(
        this.prisma,
        'compartilhamentoRelatorio',
      );

      // Buscar os compartilhamentos pelo usuarioId
      const compartilhamentos = await compartilhamentoModel.findMany({
        where: { usuarioId },
        include: {
          relatorio: true,
          usuario: true,
        },
        orderBy: {
          compartilhadoEm: 'desc',
        },
      });

      // Mapear para o domínio
      return compartilhamentos.map((compartilhamento) =>
        this.mapToDomain(compartilhamento as IPrismaCompartilhamentoRelatorioData),
      );
    } catch (error) {
      throw mapPrismaError(error, 'CompartilhamentoRelatorio');
    }
  }

  /**
   * Cria um novo compartilhamento (alias para create)
   */
  async criar(compartilhamento: CompartilhamentoRelatorio): Promise<CompartilhamentoRelatorio> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const compartilhamentoModel = ensurePrismaModel<ICompartilhamentoRelatorioModel>(
        this.prisma,
        'compartilhamentoRelatorio',
      );

      // Preparar os dados para criação
      const createData = sanitizeForPrisma({
        id: compartilhamento.id,
        relatorioId: compartilhamento.relatorioId,
        usuarioId: compartilhamento.usuarioId,
        permiteEdicao: compartilhamento.permiteEdicao,
        permiteCompartilhamento: compartilhamento.permiteCompartilhamento,
        mensagem: compartilhamento.mensagem,
        compartilhadoEm: compartilhamento.compartilhadoEm,
        atualizadoEm: compartilhamento.atualizadoEm,
      });

      // Criar o compartilhamento
      const novoCompartilhamento = await compartilhamentoModel.create({
        data: createData,
      });

      // Mapear para o domínio
      return this.mapToDomain(novoCompartilhamento as IPrismaCompartilhamentoRelatorioData);
    } catch (error) {
      throw mapPrismaError(error, 'CompartilhamentoRelatorio');
    }
  }

  /**
   * Remove um compartilhamento (alias para delete)
   */
  async remover(id: string): Promise<void> {
    return this.delete(id);
  }

  /**
   * Conta o número de compartilhamentos de um relatório
   */
  async contarPorRelatorioId(relatorioId: string): Promise<number> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const compartilhamentoModel = ensurePrismaModel<ICompartilhamentoRelatorioModel>(
        this.prisma,
        'compartilhamentoRelatorio',
      );

      // Contar os compartilhamentos
      const compartilhamentos = await compartilhamentoModel.findMany({
        where: { relatorioId },
      });

      return compartilhamentos.length;
    } catch (error) {
      throw mapPrismaError(error, 'CompartilhamentoRelatorio');
    }
  }

  /**
   * Remove todos os compartilhamentos de um relatório
   */
  async removerTodosPorRelatorioId(relatorioId: string): Promise<void> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const compartilhamentoModel = ensurePrismaModel<ICompartilhamentoRelatorioModel>(
        this.prisma,
        'compartilhamentoRelatorio',
      );

      // Excluir os compartilhamentos
      await compartilhamentoModel.deleteMany({
        where: { relatorioId },
      });
    } catch (error) {
      throw mapPrismaError(error, 'CompartilhamentoRelatorio');
    }
  }

  /**
   * Mapeia dados do Prisma para a entidade de domínio CompartilhamentoRelatorio
   */
  private mapToDomain(data: IPrismaCompartilhamentoRelatorioData): CompartilhamentoRelatorio {
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
}
