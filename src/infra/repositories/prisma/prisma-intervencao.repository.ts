import { inject, injectable } from 'tsyringe';
import {
  Intervencao,
  TipoIntervencao,
  CatalogoIntervencao,
} from '../../../domain/entities/intervencao.entity';
import {
  IIntervencaoRepository,
  ICatalogoIntervencaoRepository
} from '../../../domain/repositories/intervencao-repository.interface';
import {
  FiltrosIntervencaoDTO,
  CriarCatalogoIntervencaoDTO,
  AtualizarCatalogoIntervencaoDTO,
  CriarIntervencaoDTO,
  AtualizarIntervencaoDTO,
} from '../../../domain/dtos/intervencao.dto';
import { Status } from '../../../shared/enums';
import { mapStatusToPrisma, mapStatusFromPrisma } from '../../../shared/utils/enum-mappers';
import { AppError } from '../../../shared/errors/app-error';
import {
  // Importações centralizadas dos modelos e utilitários
  PrismaClientExtended,
  createPrismaQuery,
  sanitizeForPrisma,
  mapPrismaError,
  ensurePrismaModel,
  IIntervencaoModel,
  ICatalogoIntervencaoModel,
} from '../../../types/prisma-extended';
import {
  IPrismaCatalogoIntervencaoExtendido,
  IPrismaIntervencaoExtendido,
  IPrismaProgressoIntervencaoData,
} from '../../../types/prisma';

// Tipo para facilitar referência ao tipo de dados do catálogo
type PrismaCatalogoDataExtendido = IPrismaCatalogoIntervencaoExtendido;
// Tipo para facilitar referência ao tipo de dados da intervenção
type PrismaIntervencaoDataExtendido = IPrismaIntervencaoExtendido;

/**
 * Implementação do repositório de catálogo de intervenções usando Prisma
 */
@injectable()
export class PrismaCatalogoIntervencaoRepository implements ICatalogoIntervencaoRepository {
  /**
   * Mapeia dados do Prisma para a entidade de domínio CatalogoIntervencao
   */
  private mapToDomain(data: PrismaCatalogoDataExtendido): CatalogoIntervencao {
    // Extrair as dificuldades do relacionamento
    const dificuldadesAlvo = data.dificuldades?.map((d) => d.dificuldadeId) || [];

    return CatalogoIntervencao.restaurar({
      id: data.id,
      titulo: data.titulo,
      descricao: data.descricao,
      tipo: data.tipo as TipoIntervencao,
      dificuldadesAlvo,
      status: mapStatusFromPrisma(data.status),
      criadoEm: data.criadoEm,
      atualizadoEm: data.atualizadoEm,
    });
  }

  /**
   * Busca todas as intervenções do catálogo
   */
  async findAll(): Promise<CatalogoIntervencao[]> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const catalogoModel = ensurePrismaModel<ICatalogoIntervencaoModel>(
        this.prisma,
        'catalogoIntervencao',
      );

      // Buscar todas as intervenções do catálogo incluindo suas dificuldades relacionadas
      const catalogos = await catalogoModel.findMany({
        include: {
          dificuldades: true,
        },
      });

      // Mapear para o domínio
      return catalogos.map((catalogo) => this.mapToDomain(catalogo as PrismaCatalogoDataExtendido));
    } catch (error) {
      throw mapPrismaError(error, 'CatalogoIntervencao');
    }
  }

  /**
   * Busca uma intervenção do catálogo pelo ID
   */
  async findById(id: string): Promise<CatalogoIntervencao | null> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const catalogoModel = ensurePrismaModel<ICatalogoIntervencaoModel>(
        this.prisma,
        'catalogoIntervencao',
      );

      // Buscar a intervenção do catálogo pelo ID incluindo suas dificuldades relacionadas
      const catalogo = await catalogoModel.findUnique({
        where: { id },
        include: {
          dificuldades: true,
        },
      });

      // Retornar null se não encontrar ou mapear para o domínio
      return handlePrismaResult(catalogo, (data) =>
        this.mapToDomain(data as PrismaCatalogoDataExtendido),
      );
    } catch (error) {
      throw mapPrismaError(error, 'CatalogoIntervencao');
    }
  }

  /**
   * Busca intervenções do catálogo pelo tipo
   */
  async findByTipo(tipo: TipoIntervencao): Promise<CatalogoIntervencao[]> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const catalogoModel = ensurePrismaModel<ICatalogoIntervencaoModel>(
        this.prisma,
        'catalogoIntervencao',
      );

      // Buscar intervenções do catálogo pelo tipo incluindo suas dificuldades relacionadas
      const catalogos = await catalogoModel.findMany({
        where: { tipo },
        include: {
          dificuldades: true,
        },
      });

      // Mapear para o domínio
      return catalogos.map((catalogo) => this.mapToDomain(catalogo as PrismaCatalogoDataExtendido));
    } catch (error) {
      throw mapPrismaError(error, 'CatalogoIntervencao');
    }
  }

  /**
   * Busca catálogos de intervenção por dificuldade
   */
  async findByDificuldade(dificuldadeId: string): Promise<CatalogoIntervencao[]> {
    try {
      const queryBuilder = createPrismaQuery()
        .addOrderBy('titulo', 'asc')
        .addFilter('status', { not: mapStatusToPrisma(Status.CANCELADO) })
        .addFilter('dificuldades', {
          some: { dificuldadeId },
        })
        .addInclude('dificuldades', { include: { dificuldade: true } });

      const catalogoModel = ensurePrismaModel<ICatalogoIntervencaoModel>(
        this.prisma,
        'catalogoIntervencao',
        'Modelo catalogoIntervencao não está disponível',
      );

      const catalogos = await catalogoModel.findMany(queryBuilder.build());

      return catalogos.map((catalogo) => this.mapToDomain(catalogo as PrismaCatalogoDataExtendido));
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao listar catálogos por dificuldade');
    }
  }

  /**
   * Cria um novo catálogo de intervenção
   */
  async create(data: CriarCatalogoIntervencaoDTO): Promise<CatalogoIntervencao> {
    try {
      const catalogoEntity = CatalogoIntervencao.criar(data);

      const prismaData = sanitizeForPrisma({
        titulo: catalogoEntity.titulo,
        descricao: catalogoEntity.descricao,
        tipo: catalogoEntity.tipo,
        duracao: catalogoEntity.duracao,
        publico: catalogoEntity.publico,
        recursos: catalogoEntity.recursos,
        status: mapStatusToPrisma(catalogoEntity.status),
        criadoEm: catalogoEntity.criadoEm,
        atualizadoEm: catalogoEntity.atualizadoEm,
      });

      const catalogoModel = ensurePrismaModel<ICatalogoIntervencaoModel>(
        this.prisma,
        'catalogoIntervencao',
        'Modelo catalogoIntervencao não está disponível',
      );

      const catalogo = await catalogoModel.create({
        data: prismaData,
      });

      // Se houver dificuldades alvo, criar as associações
      if (
        data.dificuldadesAlvo &&
        data.dificuldadesAlvo.length > 0 &&
        this.prisma.catalogoIntervencaoDificuldade
      ) {
        for (const dificuldadeId of data.dificuldadesAlvo) {
          await this.prisma.catalogoIntervencaoDificuldade.create({
            data: {
              catalogoId: catalogo.id,
              dificuldadeId,
            },
          });
        }
      }

      return this.findById(catalogo.id);
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao criar catálogo de intervenção');
    }
  }

  /**
   * Atualiza um catálogo de intervenção existente
   */
  async update(id: string, data: AtualizarCatalogoIntervencaoDTO): Promise<CatalogoIntervencao> {
    try {
      const existenteCatalogo = await this.findById(id);
      if (!existenteCatalogo) {
        throw new AppError('Catálogo de intervenção não encontrado', 404);
      }

      const catalogoEntity = existenteCatalogo.atualizar(data);

      const prismaData = sanitizeForPrisma({
        titulo: catalogoEntity.titulo,
        descricao: catalogoEntity.descricao,
        tipo: catalogoEntity.tipo,
        duracao: catalogoEntity.duracao,
        publico: catalogoEntity.publico,
        recursos: catalogoEntity.recursos,
        status: mapStatusToPrisma(catalogoEntity.status),
        atualizadoEm: catalogoEntity.atualizadoEm,
      });

      const catalogoModel = ensurePrismaModel<ICatalogoIntervencaoModel>(
        this.prisma,
        'catalogoIntervencao',
        'Modelo catalogoIntervencao não está disponível',
      );

      await catalogoModel.update({
        where: { id },
        data: prismaData,
      });

      // Se houver dificuldades alvo, atualizar as associações
      if (data.dificuldadesAlvo && data.dificuldadesAlvo.length >= 0) {
        // Primeiro remover todas as dificuldades
        await this.prisma.catalogoIntervencaoDificuldade.deleteMany({
          where: { catalogoId: id },
        });

        // Depois criar as novas dificuldades
        for (const dificuldadeId of data.dificuldadesAlvo) {
          await this.prisma.catalogoIntervencaoDificuldade.create({
            data: {
              catalogoId: id,
              dificuldadeId,
            },
          });
        }
      }

      return this.findById(id);
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao atualizar catálogo de intervenção');
    }
  }

  /**
   * Remove um catálogo de intervenção
   */
  async delete(id: string): Promise<void> {
    try {
      const existenteCatalogo = await this.findById(id);
      if (!existenteCatalogo) {
        throw new AppError('Catálogo de intervenção não encontrado', 404);
      }

      const catalogoModel = ensurePrismaModel<ICatalogoIntervencaoModel>(
        this.prisma,
        'catalogoIntervencao',
        'Modelo catalogoIntervencao não está disponível',
      );

      await catalogoModel.delete({
        where: { id },
      });
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao excluir catálogo de intervenção');
    }
  }

  // Implementação do método findByFilter adicionado
  async findByFilter(filtros?: FiltrosIntervencaoDTO): Promise<CatalogoIntervencao[]> {
    try {
      const catalogoModel = ensurePrismaModel<ICatalogoIntervencaoModel>(
        this.prisma,
        'catalogoIntervencao',
        'Modelo catalogoIntervencao não está disponível',
      );

      const where: any = {
        status: mapStatusToPrisma(Status.ATIVO),
      };

      if (filtros) {
        if (filtros.tipo) {
          where.tipo = filtros.tipo.toString();
        }
        if (filtros.status) {
          where.status = mapStatusToPrisma(filtros.status);
        }
      }

      const catalogos = await catalogoModel.findMany({ where });

      return catalogos.map((catalogo) => this.mapToDomain(catalogo as PrismaCatalogoDataExtendido));
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao buscar catálogos com filtros');
    }
  }
}

/**
 * Implementação do repositório de intervenções usando Prisma
 */
@injectable()
export class PrismaIntervencaoRepository implements IIntervencaoRepository {
  private catalogoRepository: ICatalogoIntervencaoRepository;

  constructor(
    @inject('PrismaClient')
    private prisma: PrismaClientExtended,
  ) {
    this.catalogoRepository = new PrismaCatalogoIntervencaoRepository(this.prisma);
  }

  /**
   * Mapeia dados do Prisma para a entidade de domínio Intervencao
   */
  private mapToDomain(data: PrismaIntervencaoDataExtendido): Intervencao {
    // Calcular progresso baseado nos registros de progresso
    let progresso = data.progresso || 0;

    // Se progressos for um array, calcular a média ou pegar o último valor
    if (data.progressos && data.progressos.length > 0) {
      const ultimoProgresso = data.progressos[data.progressos.length - 1];
      progresso = ultimoProgresso.valorKpi || 0;
    }

    return Intervencao.restaurar({
      id: data.id,
      titulo: data.titulo,
      descricao: data.descricao || undefined,
      tipo: data.tipo as TipoIntervencao,
      estudanteId: data.estudanteId,
      intervencaoBaseId: data.intervencaoBaseId || undefined,
      dataInicio: data.dataInicio,
      dataFim: data.dataFim || undefined,
      observacoes: data.observacoes || undefined,
      status: mapStatusFromPrisma(data.status),
      progresso,
      criadoEm: data.criadoEm,
      atualizadoEm: data.atualizadoEm,
    });
  }

  /**
   * Retorna o repositório de catálogo de intervenções
   */
  getCatalogoRepository(): ICatalogoIntervencaoRepository {
    return this.catalogoRepository;
  }

  /**
   * Busca todos os catálogos de intervenção
   */
  async findAllCatalogo(): Promise<CatalogoIntervencao[]> {
    return this.catalogoRepository.findAll();
  }

  /**
   * Busca um catálogo pelo ID
   */
  async findCatalogoById(id: string): Promise<CatalogoIntervencao | null> {
    return this.catalogoRepository.findById(id);
  }

  /**
   * Busca todas as intervenções
   */
  async findAll(): Promise<Intervencao[]> {
    try {
      const queryBuilder = createPrismaQuery()
        .addOrderBy('dataInicio', 'desc')
        .addFilter('status', { not: mapStatusToPrisma(Status.CANCELADO) });

      const intervencaoModel = ensurePrismaModel<IIntervencaoModel>(
        this.prisma,
        'intervencao',
        'Modelo intervencao não está disponível',
      );

      const intervencoes = await intervencaoModel.findMany(queryBuilder.build());

      return intervencoes.map((intervencao) =>
        this.mapToDomain(intervencao as unknown as PrismaIntervencaoDataExtendido),
      );
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao listar intervenções');
    }
  }

  /**
   * Busca uma intervenção pelo ID
   */
  async findById(id: string): Promise<Intervencao | null> {
    try {
      const intervencaoModel = ensurePrismaModel<IIntervencaoModel>(
        this.prisma,
        'intervencao',
        'Modelo intervencao não está disponível',
      );

      const intervencao = await intervencaoModel.findUnique({
        where: { id },
        include: {
          progressos: true,
        },
      });

      // Usar o helper para tratar resultado potencialmente undefined
      const result = handlePrismaResult(intervencao, null);
      if (!result) {
        return null;
      }

      return this.mapToDomain(result as unknown as PrismaIntervencaoDataExtendido);
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao buscar intervenção');
    }
  }

  /**
   * Busca intervenções por estudante
   */
  async findByEstudanteId(estudanteId: string): Promise<Intervencao[]> {
    try {
      const queryBuilder = createPrismaQuery()
        .addOrderBy('dataInicio', 'desc')
        .addFilter('estudanteId', estudanteId)
        .addFilter('status', { not: mapStatusToPrisma(Status.CANCELADO) });

      const intervencaoModel = ensurePrismaModel<IIntervencaoModel>(
        this.prisma,
        'intervencao',
        'Modelo intervencao não está disponível',
      );

      const intervencoes = await intervencaoModel.findMany(queryBuilder.build());

      return intervencoes.map((intervencao) =>
        this.mapToDomain(intervencao as unknown as PrismaIntervencaoDataExtendido),
      );
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao listar intervenções por estudante');
    }
  }

  /**
   * Busca intervenções com filtros
   */
  async findByFilter(filtros?: FiltrosIntervencaoDTO): Promise<Intervencao[]> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const intervencaoModel = ensurePrismaModel<IIntervencaoModel>(this.prisma, 'intervencao');

      // Construir o filtro com base nos parâmetros recebidos
      const where: any = {};

      if (filtros?.estudanteId) {
        where.estudanteId = filtros.estudanteId;
      }

      if (filtros?.catalogoId) {
        where.catalogoId = filtros.catalogoId;
      }

      if (filtros?.status) {
        where.status = mapStatusToPrisma(filtros.status);
      }

      // Buscar as intervenções aplicando os filtros
      const intervencoes = await intervencaoModel.findMany({
        where,
        include: {
          catalogo: true,
          estudante: true,
          progressos: true,
        },
        orderBy: {
          criadoEm: 'desc',
        },
      });

      // Mapear para o domínio
      return intervencoes.map((intervencao) =>
        this.mapToDomain(intervencao as PrismaIntervencaoDataExtendido),
      );
    } catch (error) {
      throw mapPrismaError(error, 'Intervencao');
    }
  }

  /**
   * Cria uma nova intervenção
   */
  async create(data: CriarIntervencaoDTO): Promise<Intervencao> {
    try {
      // Buscar informações do catálogo se especificado
      let intervencaoBase: CatalogoIntervencao | null = null;
      if (data.intervencaoBaseId) {
        intervencaoBase = await this.catalogoRepository.findById(data.intervencaoBaseId);
        if (!intervencaoBase) {
          throw new AppError('Intervenção base não encontrada', 404);
        }
      }

      // Criar entidade de domínio
      const intervencaoEntity = Intervencao.criar({
        ...data,
        titulo: data.titulo || (intervencaoBase ? intervencaoBase.titulo : ''),
        descricao: data.descricao || (intervencaoBase ? intervencaoBase.descricao : ''),
        tipo: data.tipo || (intervencaoBase ? intervencaoBase.tipo : TipoIntervencao.OUTRA),
      });

      const prismaData = sanitizeForPrisma({
        titulo: intervencaoEntity.titulo,
        descricao: intervencaoEntity.descricao,
        tipo: intervencaoEntity.tipo,
        dataInicio: intervencaoEntity.dataInicio,
        dataFim: intervencaoEntity.dataFim,
        observacoes: intervencaoEntity.observacoes,
        estudanteId: intervencaoEntity.estudanteId,
        intervencaoBaseId: intervencaoEntity.intervencaoBaseId,
        status: mapStatusToPrisma(intervencaoEntity.status),
        progresso: intervencaoEntity.progresso,
        criadoEm: intervencaoEntity.criadoEm,
        atualizadoEm: intervencaoEntity.atualizadoEm,
      });

      const intervencaoModel = ensurePrismaModel<IIntervencaoModel>(
        this.prisma,
        'intervencao',
        'Modelo intervencao não está disponível',
      );

      const intervencao = await intervencaoModel.create({
        data: prismaData,
      });

      return this.findById(intervencao.id);
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao criar intervenção');
    }
  }

  /**
   * Atualiza uma intervenção existente
   */
  async update(id: string, data: AtualizarIntervencaoDTO): Promise<Intervencao> {
    try {
      const existenteIntervencao = await this.findById(id);
      if (!existenteIntervencao) {
        throw new AppError('Intervenção não encontrada', 404);
      }

      const intervencaoEntity = existenteIntervencao.atualizar(data);

      const prismaData = sanitizeForPrisma({
        titulo: intervencaoEntity.titulo,
        descricao: intervencaoEntity.descricao,
        tipo: intervencaoEntity.tipo,
        dataInicio: intervencaoEntity.dataInicio,
        dataFim: intervencaoEntity.dataFim,
        observacoes: intervencaoEntity.observacoes,
        status: mapStatusToPrisma(intervencaoEntity.status),
        progresso: intervencaoEntity.progresso,
        atualizadoEm: intervencaoEntity.atualizadoEm,
      });

      const intervencaoModel = ensurePrismaModel<IIntervencaoModel>(
        this.prisma,
        'intervencao',
        'Modelo intervencao não está disponível',
      );

      await intervencaoModel.update({
        where: { id },
        data: prismaData,
      });

      return this.findById(id);
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao atualizar intervenção');
    }
  }

  /**
   * Remove uma intervenção
   */
  async delete(id: string): Promise<void> {
    try {
      const existenteIntervencao = await this.findById(id);
      if (!existenteIntervencao) {
        throw new AppError('Intervenção não encontrada', 404);
      }

      const intervencaoModel = ensurePrismaModel<IIntervencaoModel>(
        this.prisma,
        'intervencao',
        'Modelo intervencao não está disponível',
      );

      await intervencaoModel.delete({
        where: { id },
      });
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao excluir intervenção');
    }
  }

  /**
   * Atualiza o progresso de uma intervenção
   */
  async atualizarProgresso(id: string, progresso: number): Promise<Intervencao> {
    try {
      const existenteIntervencao = await this.findById(id);
      if (!existenteIntervencao) {
        throw new AppError('Intervenção não encontrada', 404);
      }

      const intervencaoAtualizada = existenteIntervencao.atualizarProgresso(progresso);

      const intervencaoModel = ensurePrismaModel<IIntervencaoModel>(
        this.prisma,
        'intervencao',
        'Modelo intervencao não está disponível',
      );

      await intervencaoModel.update({
        where: { id },
        data: {
          progresso: intervencaoAtualizada.progresso,
          atualizadoEm: intervencaoAtualizada.atualizadoEm,
        },
      });

      return this.findById(id);
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao atualizar progresso da intervenção');
    }
  }

  /**
   * Marca uma intervenção como concluída
   */
  async concluir(id: string): Promise<Intervencao> {
    try {
      const existenteIntervencao = await this.findById(id);
      if (!existenteIntervencao) {
        throw new AppError('Intervenção não encontrada', 404);
      }

      const intervencaoConcluida = existenteIntervencao.concluir();

      const intervencaoModel = ensurePrismaModel<IIntervencaoModel>(
        this.prisma,
        'intervencao',
        'Modelo intervencao não está disponível',
      );

      await intervencaoModel.update({
        where: { id },
        data: {
          status: mapStatusToPrisma(intervencaoConcluida.status),
          progresso: 100,
          dataFim: new Date(),
          atualizadoEm: intervencaoConcluida.atualizadoEm,
        },
      });

      return this.findById(id);
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao concluir intervenção');
    }
  }

  /**
   * Cancela uma intervenção
   */
  async cancelar(id: string): Promise<Intervencao> {
    try {
      const existenteIntervencao = await this.findById(id);
      if (!existenteIntervencao) {
        throw new AppError('Intervenção não encontrada', 404);
      }

      const intervencaoCancelada = existenteIntervencao.cancelar();

      const intervencaoModel = ensurePrismaModel<IIntervencaoModel>(
        this.prisma,
        'intervencao',
        'Modelo intervencao não está disponível',
      );

      await intervencaoModel.update({
        where: { id },
        data: {
          status: mapStatusToPrisma(intervencaoCancelada.status),
          atualizadoEm: intervencaoCancelada.atualizadoEm,
        },
      });

      return this.findById(id);
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao cancelar intervenção');
    }
  }

  /**
   * Adiciona um registro de progresso a uma intervenção
   */
  async adicionarProgresso(
    id: string,
    data: { valor: number; observacoes?: string; data?: Date },
  ): Promise<Intervencao> {
    try {
      const intervencao = await this.findById(id);
      if (!intervencao) {
        throw new AppError('Intervenção não encontrada', 404);
      }

      // Criar registro de progresso
      await this.prisma.progressoIntervencao.create({
        data: {
          intervencaoId: id,
          valorKpi: data.valor,
          data: data.data || new Date(),
          observacoes: data.observacoes || '',
          criadoEm: new Date(),
          atualizadoEm: new Date(),
          kpiId: '1', // Valor temporário
        },
      });

      // Atualizar progresso da intervenção
      return this.atualizarProgresso(id, data.valor);
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao adicionar progresso à intervenção');
    }
  }

  /**
   * Busca os registros de progresso de uma intervenção
   */
  async buscarProgressos(id: string): Promise<IPrismaProgressoIntervencaoData[]> {
    try {
      const progressos = await this.prisma.progressoIntervencao.findMany({
        where: { intervencaoId: id },
        orderBy: { data: 'asc' },
      });

      return progressos as IPrismaProgressoIntervencaoData[];
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao buscar progressos da intervenção');
    }
  }

  /**
   * Alias para findById - Busca uma intervenção por ID
   */
  async buscarPorId(id: string): Promise<Intervencao | null> {
    return this.findById(id);
  }

  /**
   * Alias para findCatalogoById - Busca um catálogo de intervenção por ID
   */
  async buscarCatalogoPorId(id: string): Promise<CatalogoIntervencao | null> {
    return this.findCatalogoById(id);
  }

  /**
   * Alias para create - Cria uma nova intervenção
   */
  async criar(data: Intervencao): Promise<Intervencao> {
    return this.create(data as unknown as CriarIntervencaoDTO);
  }

  /**
   * Alias para update - Atualiza uma intervenção existente
   */
  async atualizar(id: string, data: Intervencao): Promise<Intervencao> {
    return this.update(id, data as unknown as AtualizarIntervencaoDTO);
  }

  /**
   * Alias para delete - Exclui uma intervenção
   */
  async excluir(id: string): Promise<void> {
    return this.delete(id);
  }

  /**
   * Alias para catalogoRepository.create - Cria um novo catálogo de intervenção
   */
  async criarCatalogo(data: CatalogoIntervencao): Promise<CatalogoIntervencao> {
    return this.catalogoRepository.create(data as unknown as CriarCatalogoIntervencaoDTO);
  }

  /**
   * Alias para catalogoRepository.update - Atualiza um catálogo de intervenção existente
   */
  async atualizarCatalogo(id: string, data: CatalogoIntervencao): Promise<CatalogoIntervencao> {
    return this.catalogoRepository.update(id, data as unknown as AtualizarCatalogoIntervencaoDTO);
  }

  /**
   * Alias para catalogoRepository.delete - Exclui um catálogo de intervenção
   */
  async excluirCatalogo(id: string): Promise<void> {
    return this.catalogoRepository.delete(id);
  }
}
