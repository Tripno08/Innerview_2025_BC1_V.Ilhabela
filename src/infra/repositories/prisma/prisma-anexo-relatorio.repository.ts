import { injectable } from 'tsyringe';
import { AnexoRelatorio } from '../../../domain/entities/relatorio.entity';
import { IAnexoRelatorioRepository } from '../../../domain/repositories/anexo-relatorio-repository.interface';
import { IAdicionarAnexoRelatorioDTO } from '../../../domain/dtos/relatorio.dto';
import { AppError } from '../../../shared/errors/app-error';
import {
  // Importações centralizadas
  ensurePrismaModel,
  handlePrismaResult,
  IAnexoRelatorioModel,
  IPrismaAnexoRelatorioData,
  sanitizeForPrisma,
  mapPrismaError,
} from '../../repositories/index';

/**
 * DTO para atualizar um anexo de relatório
 */
interface IAtualizarAnexoRelatorioDTO {
  relatorioId?: string;
  nomeArquivo?: string;
  urlArquivo?: string;
  tipoArquivo?: string;
  tamanhoArquivo?: number;
  descricao?: string;
}

/**
 * @deprecated Use IAtualizarAnexoRelatorioDTO instead. Este alias será removido em versões futuras.
 */
type AtualizarAnexoRelatorioDTO = IAtualizarAnexoRelatorioDTO;

/**
 * Implementação do repositório de anexos de relatório usando Prisma
 */
@injectable()
export class PrismaAnexoRelatorioRepository implements IAnexoRelatorioRepository {
  /**
   * Busca todos os anexos
   */
  async findAll(): Promise<AnexoRelatorio[]> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const anexoModel = ensurePrismaModel<IAnexoRelatorioModel>(this.prisma, 'anexoRelatorio');

      // Buscar todos os anexos
      const anexos = await anexoModel.findMany({
        include: {
          relatorio: true,
        },
      });

      // Mapear para o domínio
      return anexos.map((anexo) => this.mapToDomain(anexo as IPrismaAnexoRelatorioData));
    } catch (error) {
      throw mapPrismaError(error, 'AnexoRelatorio');
    }
  }

  /**
   * Busca um anexo por ID
   */
  async findById(id: string): Promise<AnexoRelatorio | null> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const anexoModel = ensurePrismaModel<IAnexoRelatorioModel>(this.prisma, 'anexoRelatorio');

      // Buscar o anexo pelo ID
      const anexo = await anexoModel.findMany({
        where: { id },
        include: {
          relatorio: true,
        },
      });

      // Retornar null se não encontrar ou mapear para o domínio
      return handlePrismaResult(anexo.length > 0 ? anexo[0] : null, (data) =>
        this.mapToDomain(data as IPrismaAnexoRelatorioData),
      );
    } catch (error) {
      throw mapPrismaError(error, 'AnexoRelatorio');
    }
  }

  /**
   * Cria um novo anexo
   */
  async create(data: IAdicionarAnexoRelatorioDTO): Promise<AnexoRelatorio> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const anexoModel = ensurePrismaModel<IAnexoRelatorioModel>(this.prisma, 'anexoRelatorio');

      // Criar instância da entidade
      const anexo = AnexoRelatorio.criar({
        relatorioId: data.relatorioId,
        nomeArquivo: data.nomeArquivo,
        urlArquivo: data.urlArquivo,
        tipoArquivo: data.tipoArquivo,
        tamanhoArquivo: data.tamanhoArquivo,
        descricao: data.descricao,
      });

      // Preparar os dados para criação
      const createData = sanitizeForPrisma({
        id: anexo.id,
        relatorioId: anexo.relatorioId,
        nomeArquivo: anexo.nomeArquivo,
        urlArquivo: anexo.urlArquivo,
        tipoArquivo: anexo.tipoArquivo,
        tamanhoArquivo: anexo.tamanhoArquivo,
        descricao: anexo.descricao,
        criadoEm: anexo.criadoEm,
        atualizadoEm: anexo.atualizadoEm,
      });

      // Criar o anexo no banco
      const novoAnexo = await anexoModel.create({
        data: createData,
      });

      // Mapear para o domínio
      return this.mapToDomain(novoAnexo as IPrismaAnexoRelatorioData);
    } catch (error) {
      throw mapPrismaError(error, 'AnexoRelatorio');
    }
  }

  /**
   * Atualiza um anexo existente
   */
  async update(id: string, data: IAtualizarAnexoRelatorioDTO): Promise<AnexoRelatorio> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const anexoModel = ensurePrismaModel<IAnexoRelatorioModel>(this.prisma, 'anexoRelatorio');

      // Verificar se o anexo existe
      const anexoExistente = await this.findById(id);
      if (!anexoExistente) {
        throw new AppError('Anexo de relatório não encontrado', 404);
      }

      // Preparar os dados para atualização
      const updateData = sanitizeForPrisma({
        relatorioId: data.relatorioId,
        nomeArquivo: data.nomeArquivo,
        urlArquivo: data.urlArquivo,
        tipoArquivo: data.tipoArquivo,
        tamanhoArquivo: data.tamanhoArquivo,
        descricao: data.descricao,
        atualizadoEm: new Date(),
      });

      // Atualizar o anexo
      const anexoAtualizado = await anexoModel.update({
        where: { id },
        data: updateData,
        include: {
          relatorio: true,
        },
      });

      // Mapear para o domínio
      return this.mapToDomain(anexoAtualizado as IPrismaAnexoRelatorioData);
    } catch (error) {
      throw mapPrismaError(error, 'AnexoRelatorio');
    }
  }

  /**
   * Exclui um anexo
   */
  async delete(id: string): Promise<void> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const anexoModel = ensurePrismaModel<IAnexoRelatorioModel>(this.prisma, 'anexoRelatorio');

      // Verificar se o anexo existe
      const anexoExistente = await this.findById(id);
      if (!anexoExistente) {
        throw new AppError('Anexo de relatório não encontrado', 404);
      }

      // Excluir o anexo
      await anexoModel.delete({
        where: { id },
      });
    } catch (error) {
      throw mapPrismaError(error, 'AnexoRelatorio');
    }
  }

  /**
   * Busca um anexo por ID (alias para findById)
   */
  async buscarPorId(id: string): Promise<AnexoRelatorio | null> {
    return this.findById(id);
  }

  /**
   * Lista todos os anexos de um relatório
   */
  async listarPorRelatorioId(relatorioId: string): Promise<AnexoRelatorio[]> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const anexoModel = ensurePrismaModel<IAnexoRelatorioModel>(this.prisma, 'anexoRelatorio');

      // Buscar os anexos pelo relatorioId
      const anexos = await anexoModel.findMany({
        where: { relatorioId },
        include: {
          relatorio: true,
        },
        orderBy: {
          criadoEm: 'desc',
        },
      });

      // Mapear para o domínio
      return anexos.map((anexo) => this.mapToDomain(anexo as IPrismaAnexoRelatorioData));
    } catch (error) {
      throw mapPrismaError(error, 'AnexoRelatorio');
    }
  }

  /**
   * Cria um novo anexo (alias para create)
   */
  async criar(anexo: AnexoRelatorio): Promise<AnexoRelatorio> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const anexoModel = ensurePrismaModel<IAnexoRelatorioModel>(this.prisma, 'anexoRelatorio');

      // Preparar os dados para criação
      const createData = sanitizeForPrisma({
        id: anexo.id,
        relatorioId: anexo.relatorioId,
        nomeArquivo: anexo.nomeArquivo,
        urlArquivo: anexo.urlArquivo,
        tipoArquivo: anexo.tipoArquivo,
        tamanhoArquivo: anexo.tamanhoArquivo,
        descricao: anexo.descricao,
        criadoEm: anexo.criadoEm,
        atualizadoEm: anexo.atualizadoEm,
      });

      // Criar o anexo
      const novoAnexo = await anexoModel.create({
        data: createData,
      });

      // Mapear para o domínio
      return this.mapToDomain(novoAnexo as IPrismaAnexoRelatorioData);
    } catch (error) {
      throw mapPrismaError(error, 'AnexoRelatorio');
    }
  }

  /**
   * Remove um anexo (alias para delete)
   */
  async remover(id: string): Promise<void> {
    return this.delete(id);
  }

  /**
   * Conta o número de anexos de um relatório
   */
  async contarPorRelatorioId(relatorioId: string): Promise<number> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const anexoModel = ensurePrismaModel<IAnexoRelatorioModel>(this.prisma, 'anexoRelatorio');

      // Contar os anexos
      const anexos = await anexoModel.findMany({
        where: { relatorioId },
      });

      return anexos.length;
    } catch (error) {
      throw mapPrismaError(error, 'AnexoRelatorio');
    }
  }

  /**
   * Remove todos os anexos de um relatório
   */
  async removerTodosPorRelatorioId(relatorioId: string): Promise<void> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const anexoModel = ensurePrismaModel<IAnexoRelatorioModel>(this.prisma, 'anexoRelatorio');

      // Excluir os anexos
      await anexoModel.deleteMany({
        where: { relatorioId },
      });
    } catch (error) {
      throw mapPrismaError(error, 'AnexoRelatorio');
    }
  }

  /**
   * Mapeia dados do Prisma para a entidade de domínio AnexoRelatorio
   */
  private mapToDomain(data: IPrismaAnexoRelatorioData): AnexoRelatorio {
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
}
