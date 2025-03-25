import { injectable } from 'tsyringe';
import { Avaliacao } from '../../../domain/entities/avaliacao.entity';
import { IAvaliacaoRepository } from '../../../domain/repositories/avaliacao-repository.interface';
import {
  IFiltrosAvaliacaoDTO,
  ICriarAvaliacaoDTO,
  IAtualizarAvaliacaoDTO,
} from '../../../domain/dtos/avaliacao.dto';
import { AppError } from '../../../shared/errors/app-error';
import {
  // Importações centralizadas
  IPrismaAvaliacaoData,
  mapPrismaError,
  mapStatusFromPrisma,
  mapStatusToPrisma,
  Status,
  TipoAvaliacao,
} from '../../repositories/index/index';

/**
 * Implementação do repositório de avaliações usando Prisma
 */
@injectable()
export class PrismaAvaliacaoRepository implements IAvaliacaoRepository {
  async findAll(): Promise<Avaliacao[]> {
    try {
      const avaliacoes = await this.prisma.$queryRaw`
        SELECT a.*, e.nome as estudante_nome, u.nome as responsavel_nome
        FROM "Avaliacao" a
        LEFT JOIN "Estudante" e ON a."estudanteId" = e.id
        LEFT JOIN "Usuario" u ON a."responsavelId" = u.id
        WHERE a.status != ${mapStatusToPrisma(Status.CANCELADO)}
        ORDER BY a."criadoEm" DESC
      `;

      return (avaliacoes as IPrismaAvaliacaoData[]).map((avaliacao) => this.mapToDomain(avaliacao));
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao listar avaliações');
    }
  }

  async findById(id: string): Promise<Avaliacao | null> {
    try {
      const avaliacao = await this.prisma.$queryRaw`
        SELECT a.*, e.nome as estudante_nome, u.nome as responsavel_nome
        FROM "Avaliacao" a
        LEFT JOIN "Estudante" e ON a."estudanteId" = e.id
        LEFT JOIN "Usuario" u ON a."responsavelId" = u.id
        WHERE a.id = ${id}
      `;

      if (!avaliacao || (avaliacao as any[]).length === 0) {
        return null;
      }

      return this.mapToDomain(avaliacao[0] as IPrismaAvaliacaoData);
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao buscar avaliação');
    }
  }

  async create(data: ICriarAvaliacaoDTO): Promise<Avaliacao> {
    try {
      const avaliacaoEntity = Avaliacao.criar({
        titulo: data.titulo,
        descricao: data.descricao,
        tipo: data.tipo,
        dataRealizacao: data.dataRealizacao,
        estudanteId: data.estudanteId,
        intervencaoId: data.intervencaoId,
        responsavelId: data.responsavelId,
        resultado: data.resultado,
        observacoes: data.observacoes,
        status: Status.ATIVO,
      });

      const prismaData = {
        id: avaliacaoEntity.id,
        titulo: avaliacaoEntity.titulo,
        descricao: avaliacaoEntity.descricao,
        tipo: avaliacaoEntity.tipo,
        dataRealizacao: avaliacaoEntity.dataRealizacao,
        estudanteId: avaliacaoEntity.estudanteId,
        intervencaoId: avaliacaoEntity.intervencaoId,
        responsavelId: avaliacaoEntity.responsavelId,
        resultado: avaliacaoEntity.resultado,
        observacoes: avaliacaoEntity.observacoes,
        status: mapStatusToPrisma(avaliacaoEntity.status),
        criadoEm: avaliacaoEntity.criadoEm,
        atualizadoEm: avaliacaoEntity.atualizadoEm,
      };

      const created = await this.prisma.avaliacao.create({
        data: prismaData,
      });

      return this.mapToDomain(created as IPrismaAvaliacaoData);
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao criar avaliação');
    }
  }

  async update(id: string, data: IAtualizarAvaliacaoDTO): Promise<Avaliacao> {
    try {
      const existingAvaliacao = await this.prisma.avaliacao.findUnique({
        where: { id },
      });

      if (!existingAvaliacao) {
        throw new AppError('Avaliação não encontrada', 404);
      }

      const avaliacaoAtualizada = {
        titulo: data.titulo !== undefined ? data.titulo : existingAvaliacao.titulo,
        descricao: data.descricao !== undefined ? data.descricao : existingAvaliacao.descricao,
        tipo: data.tipo !== undefined ? data.tipo : existingAvaliacao.tipo,
        dataRealizacao:
          data.dataRealizacao !== undefined
            ? data.dataRealizacao
            : existingAvaliacao.dataRealizacao,
        estudanteId:
          data.estudanteId !== undefined ? data.estudanteId : existingAvaliacao.estudanteId,
        intervencaoId:
          data.intervencaoId !== undefined ? data.intervencaoId : existingAvaliacao.intervencaoId,
        responsavelId:
          data.responsavelId !== undefined ? data.responsavelId : existingAvaliacao.responsavelId,
        resultado: data.resultado !== undefined ? data.resultado : existingAvaliacao.resultado,
        observacoes:
          data.observacoes !== undefined ? data.observacoes : existingAvaliacao.observacoes,
        status:
          data.status !== undefined ? mapStatusToPrisma(data.status) : existingAvaliacao.status,
        atualizadoEm: new Date(),
      };

      const updated = await this.prisma.avaliacao.update({
        where: { id },
        data: avaliacaoAtualizada,
      });

      return this.mapToDomain(updated as IPrismaAvaliacaoData);
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao atualizar avaliação');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const existingAvaliacao = await this.prisma.avaliacao.findUnique({
        where: { id },
      });

      if (!existingAvaliacao) {
        throw new AppError('Avaliação não encontrada', 404);
      }

      await this.prisma.avaliacao.update({
        where: { id },
        data: {
          status: mapStatusToPrisma(Status.CANCELADO),
          atualizadoEm: new Date(),
        },
      });
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao excluir avaliação');
    }
  }

  async buscarPorId(id: string): Promise<Avaliacao | null> {
    return this.findById(id);
  }

  async listar(filtros?: IFiltrosAvaliacaoDTO): Promise<Avaliacao[]> {
    try {
      let whereClause = `WHERE a.status != 'CANCELADO'`;

      if (filtros) {
        if (filtros.titulo) {
          whereClause += ` AND a.titulo ILIKE '%${filtros.titulo}%'`;
        }

        if (filtros.tipo) {
          whereClause += ` AND a.tipo = '${filtros.tipo}'`;
        }

        if (filtros.estudanteId) {
          whereClause += ` AND a."estudanteId" = '${filtros.estudanteId}'`;
        }

        if (filtros.responsavelId) {
          whereClause += ` AND a."responsavelId" = '${filtros.responsavelId}'`;
        }

        if (filtros.intervencaoId) {
          whereClause += ` AND a."intervencaoId" = '${filtros.intervencaoId}'`;
        }

        if (filtros.dataInicio && filtros.dataFim) {
          whereClause += ` AND a."dataRealizacao" BETWEEN '${filtros.dataInicio.toISOString()}' AND '${filtros.dataFim.toISOString()}'`;
        } else if (filtros.dataInicio) {
          whereClause += ` AND a."dataRealizacao" >= '${filtros.dataInicio.toISOString()}'`;
        } else if (filtros.dataFim) {
          whereClause += ` AND a."dataRealizacao" <= '${filtros.dataFim.toISOString()}'`;
        }

        if (filtros.status) {
          whereClause += ` AND a.status = '${mapStatusToPrisma(filtros.status)}'`;
        }
      }

      const query = `
        SELECT a.*, e.nome as estudante_nome, u.nome as responsavel_nome
        FROM "Avaliacao" a
        LEFT JOIN "Estudante" e ON a."estudanteId" = e.id
        LEFT JOIN "Usuario" u ON a."responsavelId" = u.id
        ${whereClause}
        ORDER BY a."dataRealizacao" DESC
      `;

      const avaliacoes = await this.prisma.$queryRawUnsafe(query);

      return (avaliacoes as IPrismaAvaliacaoData[]).map((avaliacao) => this.mapToDomain(avaliacao));
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao listar avaliações');
    }
  }

  async criar(avaliacao: Avaliacao): Promise<Avaliacao> {
    const data: ICriarAvaliacaoDTO = {
      titulo: avaliacao.titulo,
      descricao: avaliacao.descricao,
      tipo: avaliacao.tipo,
      dataRealizacao: avaliacao.dataRealizacao,
      estudanteId: avaliacao.estudanteId,
      intervencaoId: avaliacao.intervencaoId,
      responsavelId: avaliacao.responsavelId,
      resultado: avaliacao.resultado,
      observacoes: avaliacao.observacoes,
    };

    return this.create(data);
  }

  async atualizar(id: string, avaliacao: Avaliacao): Promise<Avaliacao> {
    const data: IAtualizarAvaliacaoDTO = {
      titulo: avaliacao.titulo,
      descricao: avaliacao.descricao,
      tipo: avaliacao.tipo,
      dataRealizacao: avaliacao.dataRealizacao,
      estudanteId: avaliacao.estudanteId,
      intervencaoId: avaliacao.intervencaoId,
      responsavelId: avaliacao.responsavelId,
      resultado: avaliacao.resultado,
      observacoes: avaliacao.observacoes,
      status: avaliacao.status,
    };

    return this.update(id, data);
  }

  async listarPorEstudanteId(estudanteId: string): Promise<Avaliacao[]> {
    return this.listar({ estudanteId });
  }

  async listarPorIntervencaoId(intervencaoId: string): Promise<Avaliacao[]> {
    return this.listar({ intervencaoId });
  }

  async listarPorResponsavelId(responsavelId: string): Promise<Avaliacao[]> {
    return this.listar({ responsavelId });
  }

  async contarPorEstudanteId(estudanteId: string): Promise<number> {
    try {
      const result = await this.prisma.$queryRaw`
        SELECT COUNT(*) as total
        FROM "Avaliacao"
        WHERE "estudanteId" = ${estudanteId}
        AND status != 'CANCELADO'
      `;

      return Number(result[0].total);
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao contar avaliações do estudante');
    }
  }

  async contarPorTipo(tipo: TipoAvaliacao): Promise<number> {
    try {
      const result = await this.prisma.$queryRaw`
        SELECT COUNT(*) as total
        FROM "Avaliacao"
        WHERE tipo = ${tipo}
        AND status != 'CANCELADO'
      `;

      return Number(result[0].total);
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao contar avaliações por tipo');
    }
  }

  private mapToDomain(data: IPrismaAvaliacaoData): Avaliacao {
    return Avaliacao.restaurar({
      id: data.id,
      titulo: data.titulo,
      descricao: data.descricao || '',
      tipo: data.tipo,
      dataRealizacao: data.dataRealizacao,
      estudanteId: data.estudanteId,
      estudanteNome: data.estudante_nome || '',
      intervencaoId: data.intervencaoId || undefined,
      intervencaoTitulo: data.intervencao_titulo || '',
      responsavelId: data.responsavelId,
      responsavelNome: data.responsavel_nome || '',
      resultado: data.resultado || '',
      observacoes: data.observacoes || '',
      status: mapStatusFromPrisma(data.status),
      criadoEm: data.criadoEm,
      atualizadoEm: data.atualizadoEm,
    });
  }
}
