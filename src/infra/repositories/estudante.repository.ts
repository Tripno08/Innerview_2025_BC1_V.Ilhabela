import { injectable } from 'tsyringe';
import { Estudante, AvaliacaoProps } from '../../domain/entities/estudante.entity';
import { DificuldadeAprendizagem } from '../../domain/entities/dificuldade-aprendizagem.entity';
import { IEstudanteRepository } from '../../domain/repositories/estudante-repository.interface';
import { UnitOfWork } from '../../infrastructure/database/unit-of-work';
import { BaseRepository } from '../../infrastructure/repositories/base.repository';
import { Status } from '../../shared/enums';
import { AppError } from '../../shared/errors/app-error';
import { mapStatusToPrisma } from '../../shared/utils/enum-mappers';
import { mapearEstudanteDTO, mapearDificuldadeAprendizagemDTO } from '../../shared/utils/entity-mappers';
import {
  ICriarEstudanteDTO,
  IAtualizarEstudanteDTO,
  IFiltrosEstudanteDTO,
  // Aliases para compatibilidade
  CriarEstudanteDTO,
  AtualizarEstudanteDTO,
  FiltrosEstudanteDTO,
} from '../../domain/dtos/estudante.dto';
import {
  PrismaEstudanteData,
  PrismaDificuldadeAprendizagemData
} from '../../types/prisma';
import {
  EstudanteFindManyArgs,
  EstudanteCreateArgs,
  EstudanteUpdateArgs,
  EstudanteDificuldadeCreateArgs,
  AvaliacaoCreateArgs,
} from '../../types/prisma-extended';
import { createPrismaQuery, sanitizeForPrisma } from '../../shared/helpers/prisma-helper';

/**
 * Implementação do repositório de estudantes utilizando Prisma
 * Refatorado para utilizar os tipos estendidos do Prisma
 */
@injectable()
export class EstudanteRepository extends BaseRepository<Estudante> implements IEstudanteRepository {
  constructor(unitOfWork: UnitOfWork) {
    super(unitOfWork);
  }

  /**
   * Encontrar todos os estudantes
   */
  async findAll(): Promise<Estudante[]> {
    try {
      const estudantes = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.estudante.findMany({
          include: this.getEstudanteIncludes(),
          orderBy: {
            nome: 'asc',
          },
        }),
      );

      return estudantes.map((e) => mapearEstudanteDTO(e as unknown as PrismaEstudanteData));
    } catch (error) {
      this.handlePrismaError(error, 'Estudante');
    }
  }

  /**
   * Encontrar estudantes com filtros
   */
  async findByFilter(filtros: FiltrosEstudanteDTO = {}): Promise<Estudante[]> {
    try {
      const {
        nome,
        matricula,
        serie,
        status,
        instituicaoId,
        dificuldadeIds,
        equipeId,
        responsavelId,
      } = filtros;

      // Usar o builder para construir a query
      const queryBuilder = createPrismaQuery<Estudante>();

      // Adicionar filtros básicos
      if (nome) {
        queryBuilder.addLikeFilter('nome', nome);
      }
      if (matricula) {
        queryBuilder.addLikeFilter('matricula', matricula);
      }
      if (serie) {
        queryBuilder.addFilter('serie', serie);
      }
      if (status) {
        queryBuilder.addFilter('status', mapStatusToPrisma(status));
      }
      if (instituicaoId) {
        queryBuilder.addFilter('instituicaoId', instituicaoId);
      }

      // Filtrar por dificuldades de aprendizagem
      if (dificuldadeIds && dificuldadeIds.length > 0) {
        queryBuilder.addFilter('dificuldades', {
          some: {
            dificuldadeId: {
              in: dificuldadeIds,
            },
          },
        });
      }

      // Filtrar por equipe
      if (equipeId) {
        queryBuilder.addFilter('equipes', {
          some: {
            equipeId,
          },
        });
      }

      // Filtrar por responsável
      if (responsavelId) {
        queryBuilder.addFilter('responsaveis', {
          some: {
            usuarioId: responsavelId,
          },
        });
      }

      // Adicionar ordenação e includes
      queryBuilder.addOrderBy('nome', 'asc');
      queryBuilder.addInclude('dificuldades', { include: { dificuldade: true } });
      queryBuilder.addInclude('avaliacoes', true);
      queryBuilder.addInclude('equipes', { include: { equipe: true } });
      queryBuilder.addInclude('responsaveis', { include: { usuario: true } });
      queryBuilder.addInclude('instituicao', true);

      // Construir a query
      const query = queryBuilder.build() as EstudanteFindManyArgs;

      // Executar a consulta
      const estudantes = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.estudante.findMany(query),
      );

      return estudantes.map((e) => mapearEstudanteDTO(e as unknown as PrismaEstudanteData));
    } catch (error) {
      this.handlePrismaError(error, 'Estudante');
    }
  }

  /**
   * Encontrar estudantes por ID de usuário (responsável)
   */
  async findByUsuarioId(usuarioId: string): Promise<Estudante[]> {
    try {
      const estudantes = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.estudante.findMany({
          where: {
            responsaveis: {
              some: {
                usuarioId,
              },
            },
          },
          include: this.getEstudanteIncludes(),
          orderBy: {
            nome: 'asc',
          },
        }),
      );

      return estudantes.map((e) => mapearEstudanteDTO(e as unknown as PrismaEstudanteData));
    } catch (error) {
      this.handlePrismaError(error, 'Estudante');
    }
  }

  /**
   * Encontrar estudante por ID
   */
  async findById(id: string): Promise<Estudante | null> {
    try {
      const estudante = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.estudante.findUnique({
          where: { id },
          include: this.getEstudanteIncludes(),
        }),
      );

      if (!estudante) {
        return null;
      }

      return mapearEstudanteDTO(estudante as unknown as PrismaEstudanteData);
    } catch (error) {
      this.handlePrismaError(error, 'Estudante');
    }
  }

  /**
   * Obter estudante por ID (implementação da interface IEstudanteRepository)
   */
  async obterPorId(id: string): Promise<Estudante | null> {
    return this.findById(id);
  }

  /**
   * Criar um novo estudante
   */
  async create(data: CriarEstudanteDTO): Promise<Estudante> {
    try {
      // Sanitizar os dados para evitar undefined
      const sanitizedData = sanitizeForPrisma(data);

      const createArgs: EstudanteCreateArgs = {
        data: {
          nome: sanitizedData.nome,
          matricula: sanitizedData.matricula,
          dataNascimento: sanitizedData.dataNascimento,
          serie: sanitizedData.serie,
          observacoes: sanitizedData.observacoes,
          status: mapStatusToPrisma(sanitizedData.status || Status.ATIVO),
          instituicaoId: sanitizedData.instituicaoId,
        },
        include: this.getEstudanteIncludes(),
      };

      const estudante = await this.unitOfWork.withTransaction(async (prisma) =>
        prisma.estudante.create(createArgs),
      );

      return mapearEstudanteDTO(estudante as unknown as PrismaEstudanteData);
    } catch (error) {
      this.handlePrismaError(error, 'Estudante');
    }
  }

  /**
   * Atualizar um estudante existente
   */
  async update(id: string, data: AtualizarEstudanteDTO): Promise<Estudante> {
    try {
      // Verificar se o estudante existe
      const estudanteExistente = await this.findById(id);
      if (!estudanteExistente) {
        throw new AppError('Estudante não encontrado', 404);
      }

      // Sanitizar os dados para evitar undefined
      const sanitizedData = sanitizeForPrisma(data);

      // Preparar dados da atualização
      const updateArgs: EstudanteUpdateArgs = {
        where: { id },
        data: {},
        include: this.getEstudanteIncludes(),
      };

      // Adicionar apenas campos que foram fornecidos
      if (sanitizedData.nome !== undefined) {
        updateArgs.data.nome = sanitizedData.nome;
      }
      if (sanitizedData.matricula !== undefined) {
        updateArgs.data.matricula = sanitizedData.matricula;
      }
      if (sanitizedData.dataNascimento !== undefined) {
        updateArgs.data.dataNascimento = sanitizedData.dataNascimento;
      }
      if (sanitizedData.serie !== undefined) {
        updateArgs.data.serie = sanitizedData.serie;
      }
      if (sanitizedData.observacoes !== undefined) {
        updateArgs.data.observacoes = sanitizedData.observacoes;
      }
      if (sanitizedData.status !== undefined) {
        updateArgs.data.status = mapStatusToPrisma(sanitizedData.status);
      }
      if (sanitizedData.instituicaoId !== undefined) {
        updateArgs.data.instituicaoId = sanitizedData.instituicaoId;
      }

      const estudante = await this.unitOfWork.withTransaction(async (prisma) =>
        prisma.estudante.update(updateArgs),
      );

      return mapearEstudanteDTO(estudante as unknown as PrismaEstudanteData);
    } catch (error) {
      this.handlePrismaError(error, 'Estudante');
    }
  }

  /**
   * Remover um estudante
   */
  async delete(id: string): Promise<void> {
    try {
      await this.unitOfWork.withTransaction(async (prisma) => {
        // Verificar se o estudante existe
        const estudante = await prisma.estudante.findUnique({
          where: { id },
        });

        if (!estudante) {
          throw new AppError('Estudante não encontrado', 404);
        }

        // Remover relacionamentos
        await prisma.estudanteDificuldadeAprendizagem.deleteMany({
          where: { estudanteId: id },
        });

        await prisma.avaliacao.deleteMany({
          where: { estudanteId: id },
        });

        await prisma.estudanteEquipe.deleteMany({
          where: { estudanteId: id },
        });

        await prisma.estudanteResponsavel.deleteMany({
          where: { estudanteId: id },
        });

        // Remover o estudante
        await prisma.estudante.delete({
          where: { id },
        });
      });
    } catch (error) {
      this.handlePrismaError(error, 'Estudante');
    }
  }

  /**
   * Adicionar uma dificuldade de aprendizagem ao estudante
   */
  async adicionarDificuldade(
    estudanteId: string,
    dificuldadeId: string,
    dadosAdicionais?: { tipo?: string; observacoes?: string },
  ): Promise<Estudante> {
    try {
      // Verificar se o estudante existe
      const estudante = await this.findById(estudanteId);
      if (!estudante) {
        throw new AppError('Estudante não encontrado', 404);
      }

      // Verificar se a dificuldade existe
      const dificuldade = await this.findDificuldadeById(dificuldadeId);
      if (!dificuldade) {
        throw new AppError('Dificuldade de aprendizagem não encontrada', 404);
      }

      // Verificar se a relação já existe
      const relacaoExistente = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.estudanteDificuldadeAprendizagem.findUnique({
          where: {
            estudanteId_dificuldadeId: {
              estudanteId,
              dificuldadeId,
            },
          },
        }),
      );

      if (relacaoExistente) {
        throw new AppError('Esta dificuldade já está associada ao estudante', 400);
      }

      // Preparar dados para criar a relação
      const createArgs: EstudanteDificuldadeCreateArgs = {
        data: {
          estudanteId,
          dificuldadeId,
          tipo: dadosAdicionais?.tipo,
          observacoes: dadosAdicionais?.observacoes,
        },
      };

      // Criar a relação
      await this.unitOfWork.withTransaction(async (prisma) =>
        prisma.estudanteDificuldadeAprendizagem.create(createArgs),
      );

      // Retornar o estudante atualizado
      return this.findById(estudanteId) as Promise<Estudante>;
    } catch (error) {
      this.handlePrismaError(error, 'Estudante');
    }
  }

  /**
   * Remover uma dificuldade de aprendizagem do estudante
   */
  async removerDificuldade(estudanteId: string, dificuldadeId: string): Promise<Estudante> {
    try {
      // Verificar se o estudante existe
      const estudante = await this.findById(estudanteId);
      if (!estudante) {
        throw new AppError('Estudante não encontrado', 404);
      }

      // Verificar se a relação existe
      const relacaoExistente = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.estudanteDificuldadeAprendizagem.findUnique({
          where: {
            estudanteId_dificuldadeId: {
              estudanteId,
              dificuldadeId,
            },
          },
        }),
      );

      if (!relacaoExistente) {
        throw new AppError('Esta dificuldade não está associada ao estudante', 400);
      }

      // Remover a relação
      await this.unitOfWork.withTransaction(async (prisma) =>
        prisma.estudanteDificuldadeAprendizagem.delete({
          where: {
            estudanteId_dificuldadeId: {
              estudanteId,
              dificuldadeId,
            },
          },
        }),
      );

      // Retornar o estudante atualizado
      return this.findById(estudanteId) as Promise<Estudante>;
    } catch (error) {
      this.handlePrismaError(error, 'Estudante');
    }
  }

  /**
   * Adicionar uma avaliação ao estudante
   */
  async adicionarAvaliacao(estudanteId: string, avaliacaoData: AvaliacaoProps): Promise<Estudante> {
    try {
      // Verificar se o estudante existe
      const estudante = await this.findById(estudanteId);
      if (!estudante) {
        throw new AppError('Estudante não encontrado', 404);
      }

      // Preparar dados para criar a avaliação
      const sanitizedData = sanitizeForPrisma(avaliacaoData);
      const createArgs: AvaliacaoCreateArgs = {
        data: {
          estudanteId,
          data: sanitizedData.data,
          tipo: sanitizedData.tipo,
          pontuacao: sanitizedData.pontuacao,
          observacoes: sanitizedData.observacoes,
          avaliadorId: sanitizedData.avaliadorId,
          disciplina: sanitizedData.disciplina,
          conteudo: sanitizedData.conteudo,
        },
      };

      // Criar a avaliação
      await this.unitOfWork.withTransaction(async (prisma) => prisma.avaliacao.create(createArgs));

      // Retornar o estudante atualizado
      return this.findById(estudanteId) as Promise<Estudante>;
    } catch (error) {
      this.handlePrismaError(error, 'Estudante');
    }
  }

  /**
   * Buscar estudantes com necessidades similares
   */
  async buscarEstudantesComNecessidadesSimilares(dificuldadeIds: string[]): Promise<Estudante[]> {
    if (!dificuldadeIds.length) {
      return [];
    }

    try {
      const estudantes = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.estudante.findMany({
          where: {
            dificuldades: {
              some: {
                dificuldadeId: {
                  in: dificuldadeIds,
                },
              },
            },
          },
          include: this.getEstudanteIncludes(),
          orderBy: {
            nome: 'asc',
          },
        }),
      );

      return estudantes.map((e) => mapearEstudanteDTO(e as unknown as PrismaEstudanteData));
    } catch (error) {
      this.handlePrismaError(error, 'Estudante');
    }
  }

  /**
   * Buscar uma dificuldade de aprendizagem pelo ID
   */
  async findDificuldadeById(id: string): Promise<DificuldadeAprendizagem | null> {
    try {
      const dificuldade = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.dificuldadeAprendizagem.findUnique({
          where: { id },
        }),
      );

      if (!dificuldade) {
        return null;
      }

      return mapearDificuldadeAprendizagemDTO(
        dificuldade as unknown as PrismaDificuldadeAprendizagemData,
      );
    } catch (error) {
      this.handlePrismaError(error, 'DificuldadeAprendizagem');
    }
  }

  /**
   * Obter configuração de includes para consultas de estudante
   */
  private getEstudanteIncludes() {
    return {
      dificuldades: {
        include: {
          dificuldade: true,
        },
      },
      avaliacoes: true,
      equipes: {
        include: {
          equipe: true,
        },
      },
      responsaveis: {
        include: {
          usuario: true,
        },
      },
      instituicao: true,
    };
  }
}
