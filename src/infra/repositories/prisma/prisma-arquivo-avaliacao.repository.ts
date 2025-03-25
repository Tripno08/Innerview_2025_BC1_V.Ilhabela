import { injectable } from 'tsyringe';
import { ArquivoAvaliacao } from '../../../domain/entities/arquivo-avaliacao.entity';
import { IArquivoAvaliacaoRepository } from '../../../domain/repositories/avaliacao-repository.interface';
import { AppError } from '../../../shared/errors/app-error';
import { IAdicionarArquivoAvaliacaoDTO } from '../../../domain/dtos/avaliacao.dto';
import {
  // Importações centralizadas
  IPrismaArquivoAvaliacaoData,
  mapPrismaError,
} from '../../repositories/index/index';

/**
 * DTO para criar um arquivo de avaliação
 */
interface ICriarArquivoAvaliacaoDTO {
  avaliacaoId: string;
  nomeArquivo: string;
  urlArquivo: string;
  tipoArquivo: string;
  tamanhoArquivo: number;
}

/**
 * @deprecated Use ICriarArquivoAvaliacaoDTO instead. Este alias será removido em versões futuras.
 */
type CriarArquivoAvaliacaoDTO = ICriarArquivoAvaliacaoDTO;

/**
 * DTO para atualizar um arquivo de avaliação
 */
interface IAtualizarArquivoAvaliacaoDTO {
  avaliacaoId?: string;
  nomeArquivo?: string;
  urlArquivo?: string;
  tipoArquivo?: string;
  tamanhoArquivo?: number;
}

/**
 * @deprecated Use IAtualizarArquivoAvaliacaoDTO instead. Este alias será removido em versões futuras.
 */
type AtualizarArquivoAvaliacaoDTO = IAtualizarArquivoAvaliacaoDTO;

/**
 * Implementação do repositório de arquivos de avaliação usando Prisma
 */
@injectable()
export class PrismaArquivoAvaliacaoRepository implements IArquivoAvaliacaoRepository {
  async findAll(): Promise<ArquivoAvaliacao[]> {
    try {
      const arquivos = await this.prisma.arquivoAvaliacao.findMany();
      return arquivos.map((arquivo) => this.mapToDomain(arquivo as IPrismaArquivoAvaliacaoData));
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao listar arquivos de avaliação');
    }
  }

  async findById(id: string): Promise<ArquivoAvaliacao | null> {
    try {
      const arquivo = await this.prisma.arquivoAvaliacao.findUnique({
        where: { id },
      });

      if (!arquivo) {
        return null;
      }

      return this.mapToDomain(arquivo as IPrismaArquivoAvaliacaoData);
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao buscar arquivo de avaliação');
    }
  }

  async create(data: IAdicionarArquivoAvaliacaoDTO): Promise<ArquivoAvaliacao> {
    try {
      const arquivoEntity = ArquivoAvaliacao.criar({
        avaliacaoId: data.avaliacaoId,
        nomeArquivo: data.nomeArquivo,
        urlArquivo: data.urlArquivo,
        tipoArquivo: data.tipoArquivo,
        tamanhoArquivo: data.tamanhoArquivo,
      });

      const prismaData = {
        id: arquivoEntity.id,
        avaliacaoId: arquivoEntity.avaliacaoId,
        nomeArquivo: arquivoEntity.nomeArquivo,
        urlArquivo: arquivoEntity.urlArquivo,
        tipoArquivo: arquivoEntity.tipoArquivo,
        tamanhoArquivo: arquivoEntity.tamanhoArquivo,
        criadoEm: arquivoEntity.criadoEm,
        atualizadoEm: arquivoEntity.atualizadoEm,
      };

      const created = await this.prisma.arquivoAvaliacao.create({
        data: prismaData,
      });

      return this.mapToDomain(created as IPrismaArquivoAvaliacaoData);
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao criar arquivo de avaliação');
    }
  }

  async update(id: string, data: IAtualizarArquivoAvaliacaoDTO): Promise<ArquivoAvaliacao> {
    try {
      const existingArquivo = await this.prisma.arquivoAvaliacao.findUnique({
        where: { id },
      });

      if (!existingArquivo) {
        throw new AppError('Arquivo de avaliação não encontrado', 404);
      }

      const arquivoAtualizado = {
        avaliacaoId:
          data.avaliacaoId !== undefined ? data.avaliacaoId : existingArquivo.avaliacaoId,
        nomeArquivo:
          data.nomeArquivo !== undefined ? data.nomeArquivo : existingArquivo.nomeArquivo,
        urlArquivo: data.urlArquivo !== undefined ? data.urlArquivo : existingArquivo.urlArquivo,
        tipoArquivo:
          data.tipoArquivo !== undefined ? data.tipoArquivo : existingArquivo.tipoArquivo,
        tamanhoArquivo:
          data.tamanhoArquivo !== undefined ? data.tamanhoArquivo : existingArquivo.tamanhoArquivo,
        atualizadoEm: new Date(),
      };

      const updated = await this.prisma.arquivoAvaliacao.update({
        where: { id },
        data: arquivoAtualizado,
      });

      return this.mapToDomain(updated as IPrismaArquivoAvaliacaoData);
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao atualizar arquivo de avaliação');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.arquivoAvaliacao.delete({
        where: { id },
      });
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao excluir arquivo de avaliação');
    }
  }

  async buscarPorId(id: string): Promise<ArquivoAvaliacao | null> {
    return this.findById(id);
  }

  async listarPorAvaliacaoId(avaliacaoId: string): Promise<ArquivoAvaliacao[]> {
    try {
      const arquivos = await this.prisma.arquivoAvaliacao.findMany({
        where: { avaliacaoId },
      });

      return arquivos.map((arquivo) => this.mapToDomain(arquivo as IPrismaArquivoAvaliacaoData));
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao listar arquivos por avaliação');
    }
  }

  async criar(arquivo: ArquivoAvaliacao): Promise<ArquivoAvaliacao> {
    const data: IAdicionarArquivoAvaliacaoDTO = {
      avaliacaoId: arquivo.avaliacaoId,
      nomeArquivo: arquivo.nomeArquivo,
      urlArquivo: arquivo.urlArquivo,
      tipoArquivo: arquivo.tipoArquivo,
      tamanhoArquivo: arquivo.tamanhoArquivo,
    };

    return this.create(data);
  }

  async remover(id: string): Promise<void> {
    return this.delete(id);
  }

  async contarPorAvaliacaoId(avaliacaoId: string): Promise<number> {
    try {
      const count = await this.prisma.arquivoAvaliacao.count({
        where: { avaliacaoId },
      });

      return count;
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao contar arquivos por avaliação');
    }
  }

  async removerTodosPorAvaliacaoId(avaliacaoId: string): Promise<void> {
    try {
      await this.prisma.arquivoAvaliacao.deleteMany({
        where: { avaliacaoId },
      });
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao remover todos os arquivos da avaliação');
    }
  }

  private mapToDomain(data: IPrismaArquivoAvaliacaoData): ArquivoAvaliacao {
    return ArquivoAvaliacao.restaurar({
      id: data.id,
      avaliacaoId: data.avaliacaoId,
      nomeArquivo: data.nomeArquivo,
      urlArquivo: data.urlArquivo,
      tipoArquivo: data.tipoArquivo,
      tamanhoArquivo: data.tamanhoArquivo,
      criadoEm: data.criadoEm,
      atualizadoEm: data.atualizadoEm,
    });
  }
}
