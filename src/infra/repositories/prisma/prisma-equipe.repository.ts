import { injectable } from 'tsyringe';
import { Equipe, MembroEquipe, EstudanteEquipe } from '../../../domain/entities/equipe.entity';
import { IEquipeRepository } from '../../../domain/repositories/equipe-repository.interface';
import {
  IMembroEquipeDTO,
  IEstudanteEquipeDTO,
  IFiltroEquipeDTO,
  IEstudanteEquipeDetalheDTO,
  ICriarEquipeDTO,
  IAtualizarEquipeDTO,
  // Aliases para compatibilidade
  MembroEquipeDTO,
  EstudanteEquipeDTO,
  FiltroEquipeDTO,
  EstudanteEquipeDetalheDTO,
  CriarEquipeDTO,
} from '../../../domain/dtos/equipe.dto';
import { AppError } from '../../../shared/errors/app-error';
import {
  // Importações centralizadas
  IPrismaEquipeData,
  IPrismaMembroEquipeData,
  IPrismaEstudanteEquipeData,
  createPrismaQuery,
  sanitizeForPrisma,
  mapPrismaError,
  mapStatusToPrisma,
  Status,
  mapearEquipeDTO,
  mapearMembroEquipeDTO,
  mapearEstudanteEquipeDTO,
} from '../../repositories/index/index';

// Tipo temporário para facilitar migração gradual
type PrismaEquipeRecord = Record<string, unknown> & Partial<IPrismaEquipeData>;

@injectable()
export class PrismaEquipeRepository implements IEquipeRepository {
  async findAll(): Promise<Equipe[]> {
    try {
      const equipes = await this.prisma.equipe.findMany({
        where: {
          status: { not: mapStatusToPrisma(Status.CANCELADO) },
        },
        include: {
          membros: true,
          estudantes: {
            include: {
              estudante: true,
            },
          },
        },
        orderBy: {
          nome: 'asc',
        },
      });

      return equipes.map((equipe) => this.mapToDomain(equipe as PrismaEquipeRecord));
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao listar equipes');
    }
  }

  async findById(id: string): Promise<Equipe | null> {
    try {
      const equipe = await this.prisma.equipe.findUnique({
        where: { id },
        include: {
          membros: true,
          estudantes: {
            include: {
              estudante: true,
            },
          },
        },
      });

      if (!equipe) {
        return null;
      }

      return this.mapToDomain(equipe as PrismaEquipeRecord);
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao buscar equipe');
    }
  }

  async create(data: ICriarEquipeDTO): Promise<Equipe> {
    try {
      const createData: EquipeCreate = {
        nome: data.nome,
        descricao: data.descricao,
        statusEquipe: String(mapStatusToPrisma(data.status || Status.ATIVO)),
        tipo: data.tipo,
        instituicaoId: data.instituicaoId,
      };

      // @ts-expect-error - Ignorar erros de tipo do Prisma
      const equipe = await this.prisma.equipe.create({
        data: createData,
        include: { membros: true, estudantes: true },
      });

      return this.mapToDomain(equipe as PrismaEquipeRecord);
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao criar equipe');
    }
  }

  async update(id: string, data: IAtualizarEquipeDTO): Promise<Equipe> {
    try {
      // Verificar se a equipe existe
      const equipe = await this.prisma.equipe.findUnique({
        where: { id },
      });

      if (!equipe) {
        throw new AppError('Equipe não encontrada', 404);
      }

      const updateData: EquipeUpdate = {
        nome: data.nome,
        descricao: data.descricao,
        statusEquipe: data.status ? String(mapStatusToPrisma(data.status)) : undefined,
        tipo: data.tipo,
        instituicaoId: data.instituicaoId,
      };

      const equipeAtualizada = await this.prisma.equipe.update({
        where: { id },
        data: updateData,
        include: { membros: true, estudantes: true },
      });

      return this.mapToDomain(equipeAtualizada as PrismaEquipeRecord);
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao atualizar equipe');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.equipe.delete({
        where: { id },
      });
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao excluir equipe');
    }
  }

  async findByFilter(filtro?: IFiltroEquipeDTO): Promise<Equipe[]> {
    try {
      const where: any = {};

      if (filtro) {
        if (filtro.nome) {
          where.nome = {
            contains: filtro.nome,
            mode: 'insensitive',
          };
        }

        if (filtro.status) {
          where.statusEquipe = mapStatusToPrisma(filtro.status);
        }

        if (filtro.tipo) {
          where.tipo = filtro.tipo;
        }

        if (filtro.instituicaoId) {
          where.instituicaoId = filtro.instituicaoId;
        }

        if (filtro.usuarioId) {
          where.membros = {
            some: {
              usuarioId: filtro.usuarioId,
              ativo: true,
            },
          };
        }
      }

      const equipes = await this.prisma.equipe.findMany({
        where,
        include: {
          membros: {
            include: {
              usuario: true,
            },
          },
          estudantes: {
            include: {
              estudante: true,
            },
          },
        },
      });

      return equipes.map((equipe) => this.mapToDomain(equipe as PrismaEquipeRecord));
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao buscar equipes com filtro');
    }
  }

  async verificarAcessoUsuario(equipeId: string, usuarioId: string): Promise<boolean> {
    try {
      const membro = await this.prisma.membroEquipe.findFirst({
        where: {
          equipeId,
          usuarioId,
          ativo: true,
        },
      });

      return !!membro;
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao verificar acesso do usuário à equipe');
    }
  }

  async adicionarMembro(dados: IMembroEquipeDTO): Promise<MembroEquipe> {
    try {
      const membro = await this.prisma.membroEquipe.create({
        data: {
          equipeId: dados.equipeId,
          usuarioId: dados.usuarioId,
          papelMembro: String(dados.cargo),
          ativo: dados.ativo ?? true,
        },
        include: {
          usuario: true,
        },
      });

      return this.mapMembroToDomain(membro as IPrismaMembroEquipeData);
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao adicionar membro à equipe');
    }
  }

  async removerMembro(equipeId: string, membroId: string): Promise<void> {
    try {
      await this.prisma.membroEquipe.deleteMany({
        where: {
          id: membroId,
          equipeId,
        },
      });
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao remover membro da equipe');
    }
  }

  async adicionarEstudante(dados: IEstudanteEquipeDTO): Promise<EstudanteEquipe> {
    try {
      const estudanteEquipe = await this.prisma.estudanteEquipe.create({
        data: {
          equipeId: dados.equipeId,
          estudanteId: dados.estudanteId,
          dataEntrada: dados.dataEntrada,
          ativo: dados.ativo ?? true,
        },
        include: {
          estudante: true,
        },
      });

      return this.mapEstudanteToDomain(estudanteEquipe as IPrismaEstudanteEquipeData);
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao adicionar estudante à equipe');
    }
  }

  async removerEstudante(equipeId: string, estudanteId: string): Promise<void> {
    try {
      await this.prisma.estudanteEquipe.deleteMany({
        where: {
          equipeId,
          estudanteId,
        },
      });
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao remover estudante da equipe');
    }
  }

  async listarEstudantes(equipeId: string): Promise<IEstudanteEquipeDetalheDTO[]> {
    try {
      const estudantes = await this.prisma.estudanteEquipe.findMany({
        where: {
          equipeId,
          ativo: true,
        },
        include: {
          estudante: true,
        },
      });

      return estudantes.map((item) => {
        const estudante = isEstudantePrisma(item.estudante)
          ? item.estudante
          : { id: item.estudanteId, nome: 'Estudante não encontrado', dataNascimento: null };

        return {
          id: item.id,
          estudanteId: item.estudanteId,
          equipeId: item.equipeId,
          nome: estudante.nome,
          matricula: estudante.matricula,
          serie: estudante.serie,
          idade: this.calcularIdade(estudante.dataNascimento),
          dataEntrada: item.dataEntrada,
          criadoEm: item.criadoEm,
        };
      });
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao listar estudantes da equipe');
    }
  }

  private mapToDomain(data: PrismaEquipeRecord): Equipe {
    return mapearEquipeDTO(data);
  }

  private mapMembroToDomain(data: Partial<IPrismaMembroEquipeData>): MembroEquipe {
    return mapearMembroEquipeDTO(data);
  }

  private mapEstudanteToDomain(data: Partial<IPrismaEstudanteEquipeData>): EstudanteEquipe {
    return mapearEstudanteEquipeDTO(data);
  }

  private calcularIdade(dataNascimento?: Date): number {
    if (!dataNascimento) {
      return 0;
    }

    const hoje = new Date();
    const nascimento = new Date(dataNascimento);

    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();

    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }

    return idade;
  }

  async obterPorId(id: string): Promise<Equipe | null> {
    return this.findById(id);
  }

  async criar(dados: ICriarEquipeDTO): Promise<Equipe> {
    return this.create(dados);
  }

  async atualizar(id: string, dados: IAtualizarEquipeDTO): Promise<Equipe> {
    try {
      const equipeAtual = await this.findById(id);
      if (!equipeAtual) {
        throw new AppError('Equipe não encontrada', 404);
      }

      return this.update(id, dados);
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao atualizar equipe');
    }
  }

  async excluir(id: string): Promise<void> {
    await this.delete(id);
  }
}
