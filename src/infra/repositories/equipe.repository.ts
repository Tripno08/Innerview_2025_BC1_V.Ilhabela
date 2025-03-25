import { injectable } from 'tsyringe';
import { Equipe, MembroEquipe, EstudanteEquipe, PapelMembro } from '@domain/entities/equipe.entity';
import { IEquipeRepository, FiltroEquipe } from '@domain/repositories/equipe-repository.interface';
import { UnitOfWork } from '../database/unit-of-work';
import { BaseRepository } from './base.repository';
import { Status, CargoEquipe } from '@shared/enums';
import { AppError } from '@shared/errors/app-error';
import { mapStatusToPrisma, mapCargoEquipeToPrisma } from '@shared/utils/enum-mappers';
import {
  mapearEquipeDTO,
  mapearMembroEquipeDTO,
  mapearEstudanteEquipeDTO,
} from '@shared/utils/entity-mappers';
import {
  CriarEquipeDTO,
  AtualizarEquipeDTO,
  EstudanteEquipeDetalheDTO,
} from '@domain/dtos/equipe.dto';
import {
  PrismaEquipeData,
  PrismaMembroEquipeData,
  PrismaEstudanteEquipeData,
  PrismaEstudanteData,
  MembroEquipeWhereUniqueInput,
  EstudanteEquipeWhereUniqueInput,
} from '@types/prisma';
import {
  IEquipeFindManyArgs,
  IEquipeCreateArgs,
  IEquipeUpdateArgs,
  IMembroEquipeCreateArgs,
  IEstudanteEquipeCreateArgs,
} from '@types/prisma-extended';

/**
 * Implementação do repositório de equipes utilizando Prisma
 * Refatorado para utilizar os tipos estendidos do Prisma
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

      return equipes.map((e) => mapearEquipeDTO(e as unknown as PrismaEquipeData));
    } catch (error) {
      this.handlePrismaError(error, 'Equipe');
    }
  }

  /**
   * Listar equipes com filtros
   */
  async listarEquipes(filtro: FiltroEquipe): Promise<Equipe[]> {
    try {
      const { instituicaoId, usuarioId, tipo, status } = filtro;

      const where: IEquipeFindManyArgs['where'] = {};

      if (instituicaoId) {
        where.instituicaoId = instituicaoId;
      }

      if (usuarioId) {
        where.membros = { some: { usuarioId } };
      }

      if (tipo) {
        where.tipo = tipo;
      }

      if (status) {
        where.status = mapStatusToPrisma(status);
      }

      const equipes = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.equipe.findMany({
          where,
          include: this.getEquipeIncludes(),
          orderBy: {
            nome: 'asc',
          },
        }),
      );

      return equipes.map((e) => mapearEquipeDTO(e as unknown as PrismaEquipeData));
    } catch (error) {
      this.handlePrismaError(error, 'Equipe');
    }
  }

  /**
   * Encontrar equipes por filtro
   */
  async findByFilter(filtro: FiltroEquipe): Promise<Equipe[]> {
    return this.listarEquipes(filtro);
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

      return equipes.map((e) => mapearEquipeDTO(e as unknown as PrismaEquipeData));
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

      return mapearEquipeDTO(equipe as unknown as PrismaEquipeData);
    } catch (error) {
      this.handlePrismaError(error, 'Equipe');
    }
  }

  /**
   * Obter equipe por ID (implementação da interface IEquipeRepository)
   */
  async obterPorId(id: string): Promise<Equipe | null> {
    return this.findById(id);
  }

  /**
   * Verificar se um usuário tem acesso a uma equipe
   */
  async verificarAcessoUsuario(equipeId: string, usuarioId: string): Promise<boolean> {
    try {
      const membroEquipe = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.membroEquipe.findFirst({
          where: {
            equipeId,
            usuarioId,
          },
        }),
      );

      return membroEquipe !== null;
    } catch (error) {
      this.handlePrismaError(error, 'MembroEquipe');
    }
  }

  /**
   * Criar uma nova equipe
   */
  async create(data: CriarEquipeDTO): Promise<Equipe> {
    try {
      const equipe = await this.unitOfWork.withTransaction(async (prisma) => {
        // Extrair dados básicos
        const { nome, descricao, status: statusInput, ativo, tipo, instituicaoId } = data;

        // Preparar objeto de criação com tipagem correta
        const createArgs: IEquipeCreateArgs = {
          data: {
            nome,
            descricao,
            status: mapStatusToPrisma(statusInput || Status.ATIVO),
            ativo: ativo !== undefined ? ativo : true,
            tipo,
            instituicaoId,
          },
          include: this.getEquipeIncludes(),
        };

        return prisma.equipe.create(createArgs);
      });

      return mapearEquipeDTO(equipe as unknown as PrismaEquipeData);
    } catch (error) {
      this.handlePrismaError(error, 'Equipe');
    }
  }

  /**
   * Criar equipe (implementação da interface IEquipeRepository)
   */
  async criar(dados: CriarEquipeDTO): Promise<Equipe> {
    return this.create(dados);
  }

  /**
   * Atualizar uma equipe existente
   */
  async update(id: string, data: AtualizarEquipeDTO): Promise<Equipe> {
    try {
      const equipe = await this.unitOfWork.withTransaction(async (prisma) => {
        // Extrair dados básicos
        const { nome, descricao, status: statusInput, ativo, tipo, instituicaoId } = data;

        // Preparar dados da atualização
        const updateArgs: IEquipeUpdateArgs = {
          where: { id },
          data: {},
          include: this.getEquipeIncludes(),
        };

        // Adicionar apenas campos que foram fornecidos
        if (nome !== undefined) {
          updateArgs.data.nome = nome;
        }
        if (descricao !== undefined) {
          updateArgs.data.descricao = descricao;
        }
        if (statusInput !== undefined) {
          updateArgs.data.status = mapStatusToPrisma(statusInput);
        }
        if (ativo !== undefined) {
          updateArgs.data.ativo = ativo;
        }
        if (tipo !== undefined) {
          updateArgs.data.tipo = tipo;
        }
        if (instituicaoId !== undefined) {
          updateArgs.data.instituicaoId = instituicaoId;
        }

        return prisma.equipe.update(updateArgs);
      });

      return mapearEquipeDTO(equipe as unknown as PrismaEquipeData);
    } catch (error) {
      this.handlePrismaError(error, 'Equipe');
    }
  }

  /**
   * Atualizar equipe (implementação da interface IEquipeRepository)
   */
  async atualizar(id: string, dados: AtualizarEquipeDTO): Promise<Equipe> {
    return this.update(id, dados);
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

        // Finalmente, remover a equipe
        await prisma.equipe.delete({
          where: { id },
        });
      });
    } catch (error) {
      this.handlePrismaError(error, 'Equipe');
    }
  }

  /**
   * Excluir equipe (implementação da interface IEquipeRepository)
   */
  async excluir(id: string): Promise<void> {
    return this.delete(id);
  }

  /**
   * Verificar se um membro já existe na equipe
   */
  private async verificarMembroEquipe(equipeId: string, usuarioId: string) {
    try {
      const membroExistente = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.membroEquipe.findFirst({
          where: {
            equipeId,
            usuarioId,
          },
        }),
      );

      return membroExistente;
    } catch (error) {
      this.handlePrismaError(error, 'MembroEquipe');
    }
  }

  /**
   * Adicionar um membro à equipe
   */
  async adicionarMembro(dados: {
    equipeId: string;
    usuarioId: string;
    cargo?: string;
    papelMembro?: PapelMembro;
  }): Promise<MembroEquipe> {
    try {
      const { equipeId, usuarioId, cargo, papelMembro } = dados;

      // Verificar se o membro já existe na equipe
      const membroExistente = await this.verificarMembroEquipe(equipeId, usuarioId);
      if (membroExistente) {
        throw new AppError('Usuário já é membro desta equipe', 400);
      }

      // Verificar se a equipe existe
      const equipe = await this.findById(equipeId);
      if (!equipe) {
        throw new AppError('Equipe não encontrada', 404);
      }

      // Obter o cargo do usuário se não for fornecido
      let cargoEquipe = cargo;
      if (!cargoEquipe && papelMembro) {
        cargoEquipe = mapCargoEquipeToPrisma(papelMembro);
      }

      // Adicionar membro à equipe
      const membro = await this.unitOfWork.withTransaction(async (prisma) => {
        const createArgs: IMembroEquipeCreateArgs = {
          data: {
            equipeId,
            usuarioId,
            cargo: cargoEquipe || mapCargoEquipeToPrisma(CargoEquipe.MEMBRO),
            dataEntrada: new Date(),
          },
          include: {
            usuario: true,
          },
        };

        return prisma.membroEquipe.create(createArgs);
      });

      return mapearMembroEquipeDTO(membro as unknown as PrismaMembroEquipeData);
    } catch (error) {
      this.handlePrismaError(error, 'MembroEquipe');
    }
  }

  /**
   * Remover um membro da equipe
   */
  async removerMembro(equipeId: string, usuarioId: string): Promise<void> {
    try {
      // Verificar se o membro existe na equipe
      const membroExistente = await this.verificarMembroEquipe(equipeId, usuarioId);
      if (!membroExistente) {
        throw new AppError('Usuário não é membro desta equipe', 400);
      }

      // Verificar se a equipe existe
      const equipe = await this.findById(equipeId);
      if (!equipe) {
        throw new AppError('Equipe não encontrada', 404);
      }

      // Remover membro da equipe
      await this.unitOfWork.withTransaction(async (prisma) => {
        const where: MembroEquipeWhereUniqueInput = {
          equipeId_usuarioId: {
            equipeId,
            usuarioId,
          },
        };

        await prisma.membroEquipe.delete({
          where: where as any, // Type casting necessário devido à limitação do Prisma
        });
      });
    } catch (error) {
      this.handlePrismaError(error, 'MembroEquipe');
    }
  }

  /**
   * Listar membros de uma equipe
   */
  async listarMembros(equipeId: string): Promise<MembroEquipe[]> {
    try {
      // Verificar se a equipe existe
      const equipe = await this.findById(equipeId);
      if (!equipe) {
        throw new AppError('Equipe não encontrada', 404);
      }

      // Obter membros da equipe
      const membros = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.membroEquipe.findMany({
          where: {
            equipeId,
          },
          include: {
            usuario: true,
          },
          orderBy: {
            dataEntrada: 'desc',
          },
        }),
      );

      return membros.map((m) => mapearMembroEquipeDTO(m as unknown as PrismaMembroEquipeData));
    } catch (error) {
      this.handlePrismaError(error, 'MembroEquipe');
    }
  }

  /**
   * Verificar se um estudante já existe na equipe
   */
  private async verificarEstudanteEquipe(equipeId: string, estudanteId: string) {
    try {
      const estudanteExistente = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.estudanteEquipe.findFirst({
          where: {
            equipeId,
            estudanteId,
          },
        }),
      );

      return estudanteExistente;
    } catch (error) {
      this.handlePrismaError(error, 'EstudanteEquipe');
    }
  }

  /**
   * Adicionar um estudante à equipe
   */
  async adicionarEstudante(dados: {
    equipeId: string;
    estudanteId: string;
  }): Promise<EstudanteEquipe> {
    try {
      const { equipeId, estudanteId } = dados;

      // Verificar se o estudante já existe na equipe
      const estudanteExistente = await this.verificarEstudanteEquipe(equipeId, estudanteId);
      if (estudanteExistente) {
        throw new AppError('Estudante já está nesta equipe', 400);
      }

      // Verificar se a equipe existe
      const equipe = await this.findById(equipeId);
      if (!equipe) {
        throw new AppError('Equipe não encontrada', 404);
      }

      // Adicionar estudante à equipe
      const estudanteEquipe = await this.unitOfWork.withTransaction(async (prisma) => {
        const createArgs: IEstudanteEquipeCreateArgs = {
          data: {
            equipeId,
            estudanteId,
            dataEntrada: new Date(),
          },
          include: {
            estudante: true,
          },
        };

        return prisma.estudanteEquipe.create(createArgs);
      });

      return mapearEstudanteEquipeDTO(estudanteEquipe as unknown as PrismaEstudanteEquipeData);
    } catch (error) {
      this.handlePrismaError(error, 'EstudanteEquipe');
    }
  }

  /**
   * Remover um estudante da equipe
   */
  async removerEstudante(equipeId: string, estudanteId: string): Promise<void> {
    try {
      // Verificar se o estudante existe na equipe
      const estudanteExistente = await this.verificarEstudanteEquipe(equipeId, estudanteId);
      if (!estudanteExistente) {
        throw new AppError('Estudante não está nesta equipe', 400);
      }

      // Verificar se a equipe existe
      const equipe = await this.findById(equipeId);
      if (!equipe) {
        throw new AppError('Equipe não encontrada', 404);
      }

      // Remover estudante da equipe
      await this.unitOfWork.withTransaction(async (prisma) => {
        const where: EstudanteEquipeWhereUniqueInput = {
          equipeId_estudanteId: {
            equipeId,
            estudanteId,
          },
        };

        await prisma.estudanteEquipe.delete({
          where: where as any, // Type casting necessário devido à limitação do Prisma
        });
      });
    } catch (error) {
      this.handlePrismaError(error, 'EstudanteEquipe');
    }
  }

  /**
   * Listar estudantes de uma equipe
   */
  async listarEstudantes(equipeId: string): Promise<EstudanteEquipeDetalheDTO[]> {
    try {
      // Verificar se a equipe existe
      const equipe = await this.findById(equipeId);
      if (!equipe) {
        throw new AppError('Equipe não encontrada', 404);
      }

      // Obter estudantes da equipe
      const estudantes = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.estudanteEquipe.findMany({
          where: {
            equipeId,
          },
          include: {
            estudante: true,
          },
          orderBy: {
            dataEntrada: 'desc',
          },
        }),
      );

      return estudantes.map((e) => {
        const estudanteData = e.estudante as PrismaEstudanteData;
        const idade = this.calcularIdade(estudanteData.dataNascimento);

        return {
          id: e.id,
          equipeId: e.equipeId,
          estudanteId: e.estudanteId,
          dataEntrada: e.dataEntrada,
          dataSaida: e.dataSaida,
          estudante: {
            id: estudanteData.id,
            nome: estudanteData.nome,
            serie: estudanteData.serie,
            dataNascimento: estudanteData.dataNascimento,
            idade,
          },
        };
      });
    } catch (error) {
      this.handlePrismaError(error, 'EstudanteEquipe');
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
   * Obter configuração de includes para consultas de equipe
   */
  private getEquipeIncludes() {
    return {
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
    };
  }
}
