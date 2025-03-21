import { injectable } from 'tsyringe';
import { AppError } from '../../shared/errors/app-error';
import { IIntervencaoRepository } from '../../domain/repositories/intervencao-repository.interface';
import { Intervencao, TipoIntervencao } from '../../domain/entities/intervencao.entity';
import { BaseRepository } from './base.repository';
import { Status } from '../../shared/enums';
import { mapStatusToPrisma, mapStatusFromPrisma } from '../../shared/utils/enum-mappers';
import { UnitOfWork } from '../database/unit-of-work';

/**
 * Tipagem para dados do catálogo de intervenções
 */
interface CatalogoIntervencaoData {
  id: string;
  titulo: string;
  descricao: string;
  tipo: string;
  status: string;
  duracao?: number;
  dificuldadesAlvo?: string[];
  publico?: string[];
  recursos?: string[];
  criadoEm: Date;
  atualizadoEm: Date;
}

/**
 * Tipagem para dados da intervenção
 */
interface IntervencaoData {
  id: string;
  tipo: string;
  descricao: string;
  dataInicio: Date;
  dataFim?: Date | null;
  estudanteId: string;
  intervencaoBaseId?: string | null;
  status: string;
  observacoes?: string | null;
  progresso: number;
  criadoEm: Date;
  atualizadoEm: Date;
  estudante?: any;
  intervencaoBase?: any;
}

/**
 * Implementação do repositório de intervenções utilizando Prisma
 */
@injectable()
export class IntervencaoRepository
  extends BaseRepository<Intervencao>
  implements IIntervencaoRepository
{
  constructor(unitOfWork: UnitOfWork) {
    super(unitOfWork);
  }

  /**
   * Encontrar todas as intervenções
   */
  async findAll(): Promise<Intervencao[]> {
    try {
      const intervencoes = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.intervencao.findMany({
          include: this.getIntervencaoIncludes(),
          orderBy: {
            dataInicio: 'desc',
          },
        }),
      );

      return intervencoes.map((i) => this.mapToIntervencao(i as unknown as IntervencaoData));
    } catch (error) {
      this.handlePrismaError(error, 'Intervenção');
    }
  }

  /**
   * Encontrar todas as intervenções do catálogo (modelos)
   */
  async findAllCatalogo(): Promise<any[]> {
    try {
      const modelos = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.catalogoIntervencao.findMany({
          include: this.getCatalogoIncludes(),
          orderBy: {
            titulo: 'asc',
          },
        }),
      );

      return modelos.map((m) => this.mapToCatalogo(m as unknown as CatalogoIntervencaoData));
    } catch (error) {
      this.handlePrismaError(error, 'Catálogo de Intervenção');
    }
  }

  /**
   * Encontrar um modelo de intervenção do catálogo por ID
   */
  async findCatalogoById(id: string): Promise<any | null> {
    try {
      const modelo = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.catalogoIntervencao.findUnique({
          where: { id },
          include: this.getCatalogoIncludes(),
        }),
      );

      if (!modelo) {
        return null;
      }

      return this.mapToCatalogo(modelo as unknown as CatalogoIntervencaoData);
    } catch (error) {
      this.handlePrismaError(error, 'Catálogo de Intervenção');
    }
  }

  /**
   * Encontrar modelos de intervenção por tipo
   */
  async findCatalogoByTipo(tipo: TipoIntervencao): Promise<any[]> {
    try {
      const modelos = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.catalogoIntervencao.findMany({
          where: {
            tipo: tipo.toString(),
          },
          include: this.getCatalogoIncludes(),
        }),
      );

      return modelos.map((m) => this.mapToCatalogo(m as unknown as CatalogoIntervencaoData));
    } catch (error) {
      this.handlePrismaError(error, 'Catálogo de Intervenção');
    }
  }

  /**
   * Encontrar modelos de intervenção para um tipo de dificuldade
   */
  async findCatalogoByDificuldade(dificuldadeId: string): Promise<any[]> {
    try {
      const modelos = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.catalogoIntervencao.findMany({
          where: {
            titulo: { contains: dificuldadeId },
          },
          include: this.getCatalogoIncludes(),
        }),
      );

      return modelos.map((m) => this.mapToCatalogo(m as unknown as CatalogoIntervencaoData));
    } catch (error) {
      this.handlePrismaError(error, 'Catálogo de Intervenção');
    }
  }

  /**
   * Criar um novo modelo de intervenção no catálogo
   */
  async createCatalogo(data: Record<string, unknown>): Promise<any> {
    try {
      const tipoData = data.tipo as string;
      const tituloData = data.titulo as string;
      const descricaoData = data.descricao as string;
      const duracaoData = data.duracao as number | undefined;
      const dificuldadesAlvoData = data.dificuldadesAlvo as string[] | undefined;
      const publicoData = data.publico as string[] | undefined;
      const recursosData = data.recursos as string[] | undefined;

      const modelo = await this.unitOfWork.withTransaction(async (prisma) => {
        return await prisma.catalogoIntervencao.create({
          data: {
            titulo: tituloData,
            descricao: descricaoData,
            tipo: tipoData.toString(),
            status: mapStatusToPrisma(Status.ATIVO),
            duracao: duracaoData,
            dificuldadesAlvo: dificuldadesAlvoData,
            publico: publicoData,
            recursos: recursosData,
          },
          include: this.getCatalogoIncludes(),
        });
      });

      return this.mapToCatalogo(modelo as unknown as CatalogoIntervencaoData);
    } catch (error) {
      this.handlePrismaError(error, 'Catálogo de Intervenção');
    }
  }

  /**
   * Atualizar um modelo de intervenção
   */
  async updateCatalogo(id: string, data: Record<string, unknown>): Promise<any> {
    try {
      const tipoData = data.tipo as string | undefined;
      const tituloData = data.titulo as string | undefined;
      const descricaoData = data.descricao as string | undefined;
      const duracaoData = data.duracao as number | undefined;
      const dificuldadesAlvoData = data.dificuldadesAlvo as string[] | undefined;
      const publicoData = data.publico as string[] | undefined;
      const recursosData = data.recursos as string[] | undefined;

      const modelo = await this.unitOfWork.withTransaction(async (prisma) => {
        return await prisma.catalogoIntervencao.update({
          where: { id },
          data: {
            ...(tituloData && { titulo: tituloData }),
            ...(descricaoData && { descricao: descricaoData }),
            ...(tipoData && { tipo: tipoData.toString() }),
            ...(duracaoData !== undefined && { duracao: duracaoData }),
            ...(dificuldadesAlvoData && { dificuldadesAlvo: dificuldadesAlvoData }),
            ...(publicoData && { publico: publicoData }),
            ...(recursosData && { recursos: recursosData }),
          },
          include: this.getCatalogoIncludes(),
        });
      });

      return this.mapToCatalogo(modelo as unknown as CatalogoIntervencaoData);
    } catch (error) {
      this.handlePrismaError(error, 'Catálogo de Intervenção');
    }
  }

  /**
   * Remover um modelo de intervenção
   */
  async deleteCatalogo(id: string): Promise<void> {
    try {
      await this.unitOfWork.withTransaction(async (prisma) => {
        await prisma.catalogoIntervencao.delete({
          where: { id },
        });
      });
    } catch (error) {
      this.handlePrismaError(error, 'Catálogo de Intervenção');
    }
  }

  /**
   * Encontrar todas as instâncias de intervenção
   */
  async findByEstudanteId(estudanteId: string): Promise<Intervencao[]> {
    return this.findByEstudante(estudanteId);
  }

  /**
   * Encontrar todas as instâncias de intervenção de um estudante
   */
  async findByEstudante(estudanteId: string): Promise<Intervencao[]> {
    try {
      const intervencoes = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.intervencao.findMany({
          where: {
            estudanteId,
          },
          include: this.getIntervencaoIncludes(),
          orderBy: {
            dataInicio: 'desc',
          },
        }),
      );

      return intervencoes.map((i) => this.mapToIntervencao(i as unknown as IntervencaoData));
    } catch (error) {
      this.handlePrismaError(error, 'Intervenção');
    }
  }

  /**
   * Encontrar uma instância de intervenção por ID
   */
  async findById(id: string): Promise<Intervencao | null> {
    try {
      const intervencao = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.intervencao.findUnique({
          where: { id },
          include: this.getIntervencaoIncludes(),
        }),
      );

      if (!intervencao) {
        return null;
      }

      return this.mapToIntervencao(intervencao as unknown as IntervencaoData);
    } catch (error) {
      this.handlePrismaError(error, 'Intervenção');
    }
  }

  /**
   * Criar uma nova instância de intervenção
   */
  async create(data: Partial<Omit<Intervencao, 'id'>>): Promise<Intervencao> {
    try {
      // Buscar informações do catálogo se for baseado em uma intervenção do catálogo
      let catalogoIntervencao: any | null = null;
      if (data.intervencaoBaseId) {
        catalogoIntervencao = await this.findCatalogoById(data.intervencaoBaseId);
      }

      const intervencao = await this.unitOfWork.withTransaction(async (prisma) => {
        // Criar objeto com propriedades necessárias para o Prisma
        const createData: any = {
          tipo: data.tipo?.toString() || (catalogoIntervencao?.tipo as string) || 'PEDAGOGICA',
          descricao: data.descricao || catalogoIntervencao?.descricao || '',
          estudanteId: data.estudanteId,
          dataInicio: data.dataInicio || new Date(),
          dataFim: data.dataFim || null,
          status: mapStatusToPrisma(data.status || Status.EM_ANDAMENTO),
          intervencaoBaseId: data.intervencaoBaseId || null,
          observacoes: data.observacoes || null,
          progresso: data.progresso || 0, // Manter campo progresso para compatibilidade
          // Usar progressos como array de objetos se o esquema do banco suportar
          progressos: {
            create: [
              {
                valor: data.progresso || 0,
                data: new Date(),
                observacao: 'Progresso inicial',
              },
            ],
          },
        };

        return await prisma.intervencao.create({
          data: createData,
          include: this.getIntervencaoIncludes(),
        });
      });

      return this.mapToIntervencao(intervencao as unknown as IntervencaoData);
    } catch (error) {
      this.handlePrismaError(error, 'Intervenção');
    }
  }

  /**
   * Atualizar uma instância de intervenção
   */
  async update(id: string, data: Partial<Omit<Intervencao, 'id'>>): Promise<Intervencao> {
    try {
      const intervencao = await this.unitOfWork.withTransaction(async (prisma) => {
        return await prisma.intervencao.update({
          where: { id },
          data: {
            ...(data.tipo && { tipo: data.tipo.toString() }),
            ...(data.descricao && { descricao: data.descricao }),
            ...(data.dataInicio && { dataInicio: data.dataInicio }),
            ...(data.dataFim !== undefined && { dataFim: data.dataFim }),
            ...(data.status && { status: mapStatusToPrisma(data.status) }),
            ...(data.intervencaoBaseId !== undefined && {
              intervencaoBaseId: data.intervencaoBaseId,
            }),
            ...(data.observacoes !== undefined && { observacoes: data.observacoes }),
            ...(data.progresso !== undefined && { progresso: data.progresso }),
          },
          include: this.getIntervencaoIncludes(),
        });
      });

      return this.mapToIntervencao(intervencao as unknown as IntervencaoData);
    } catch (error) {
      this.handlePrismaError(error, 'Intervenção');
    }
  }

  /**
   * Implementação do método delete
   */
  async delete(id: string): Promise<void> {
    try {
      await this.unitOfWork.withTransaction(async (prisma) => {
        await prisma.intervencao.delete({
          where: { id },
        });
      });
    } catch (error) {
      this.handlePrismaError(error, 'Intervenção');
    }
  }

  /**
   * Atualizar o progresso de uma intervenção
   */
  async atualizarProgresso(id: string, progresso: number): Promise<Intervencao> {
    // Redirecionar para o novo método registrarProgresso
    return this.registrarProgresso(id, progresso);
  }

  /**
   * Registrar progresso de uma intervenção
   */
  async registrarProgresso(id: string, valor: number, observacao?: string): Promise<Intervencao> {
    try {
      if (valor < 0 || valor > 100) {
        throw new AppError('Valor de progresso deve estar entre 0 e 100', 400);
      }

      // Obter intervenção atual
      const intervencaoAtual = await this.findById(id);
      if (!intervencaoAtual) {
        throw new AppError('Intervenção não encontrada', 404);
      }

      // Calcular status baseado no progresso
      let status = intervencaoAtual.status;
      if (valor === 100) {
        status = Status.CONCLUIDO;
      } else if (valor > 0) {
        status = Status.EM_ANDAMENTO;
      }

      const intervencao = await this.unitOfWork.withTransaction(async (prisma) => {
        // Criar novo registro de progresso
        await prisma.progressoIntervencao.create({
          data: {
            intervencaoId: id,
            valor: valor,
            data: new Date(),
            observacao: observacao || null,
          } as any,
        });

        // Atualizar status da intervenção
        return await prisma.intervencao.update({
          where: { id },
          data: {
            status: mapStatusToPrisma(status),
            ...(valor === 100 && { dataFim: new Date() }),
          },
          include: this.getIntervencaoIncludes(),
        });
      });

      // Criar objeto de retorno com o progresso atualizado
      const result = this.mapToIntervencao(intervencao as unknown as IntervencaoData);
      // Usar Object.assign para definir o progresso (evita erro de propriedade somente leitura)
      return Object.assign({}, result, { progresso: valor });
    } catch (error) {
      this.handlePrismaError(error, 'Intervenção');
    }
  }

  /**
   * Concluir uma intervenção
   */
  async concluir(id: string): Promise<Intervencao> {
    try {
      const intervencao = await this.unitOfWork.withTransaction(async (prisma) => {
        // Criar registro de progresso 100%
        await prisma.progressoIntervencao.create({
          data: {
            intervencaoId: id,
            valor: 100,
            data: new Date(),
            observacao: 'Intervenção concluída',
          } as any,
        });

        // Atualizar intervenção
        return await prisma.intervencao.update({
          where: { id },
          data: {
            status: mapStatusToPrisma(Status.CONCLUIDO),
            dataFim: new Date(),
          },
          include: this.getIntervencaoIncludes(),
        });
      });

      // Retornar com progresso atualizado
      const result = this.mapToIntervencao(intervencao as unknown as IntervencaoData);
      // Adicionar o valor de progresso 100% ao objeto retornado
      return Object.assign({}, result, { progresso: 100 });
    } catch (error) {
      this.handlePrismaError(error, 'Intervenção');
    }
  }

  /**
   * Cancelar uma intervenção
   */
  async cancelar(id: string): Promise<Intervencao> {
    try {
      const intervencao = await this.unitOfWork.withTransaction(async (prisma) => {
        return await prisma.intervencao.update({
          where: { id },
          data: {
            status: mapStatusToPrisma(Status.CANCELADO),
            dataFim: new Date(),
          },
          include: this.getIntervencaoIncludes(),
        });
      });

      return this.mapToIntervencao(intervencao as unknown as IntervencaoData);
    } catch (error) {
      this.handlePrismaError(error, 'Intervenção');
    }
  }

  /**
   * Configurar as relações incluídas nas consultas do catálogo
   */
  private getCatalogoIncludes() {
    return {};
  }

  /**
   * Configurar as relações incluídas nas consultas de intervenções
   */
  private getIntervencaoIncludes() {
    return {
      estudante: {
        select: {
          id: true,
          nome: true,
          serie: true,
        },
      },
      intervencaoBase: true,
    };
  }

  /**
   * Mapear dados do Prisma para entidade CatalogoIntervencao
   */
  private mapToCatalogo(modeloPrisma: CatalogoIntervencaoData): any {
    return {
      id: modeloPrisma.id,
      titulo: modeloPrisma.titulo,
      descricao: modeloPrisma.descricao,
      tipo: modeloPrisma.tipo as TipoIntervencao,
      status: mapStatusFromPrisma(modeloPrisma.status),
      duracao: modeloPrisma.duracao,
      dificuldadesAlvo: modeloPrisma.dificuldadesAlvo || [],
      publico: modeloPrisma.publico || [],
      recursos: modeloPrisma.recursos || [],
      criadoEm: modeloPrisma.criadoEm,
      atualizadoEm: modeloPrisma.atualizadoEm,
    };
  }

  /**
   * Mapear dados do Prisma para entidade Intervencao
   */
  private mapToIntervencao(intervencaoPrisma: IntervencaoData): Intervencao {
    // Extrair dados da entidade
    const {
      id,
      tipo,
      descricao,
      status: statusString,
      dataInicio,
      dataFim,
      estudanteId,
      intervencaoBaseId,
      observacoes,
      progresso,
      criadoEm,
      atualizadoEm,
    } = intervencaoPrisma;

    // Criar propriedades necessárias para restaurar a entidade
    const props: any = {
      id,
      titulo: descricao.substring(0, 50), // Usar parte da descrição como título, limitado a 50 caracteres
      tipo: tipo as TipoIntervencao,
      descricao,
      status: mapStatusFromPrisma(statusString),
      dataInicio,
      dataFim,
      estudanteId,
      intervencaoBaseId,
      observacoes,
      progresso: progresso || 0,
      criadoEm,
      atualizadoEm,
    };

    // Usar o método restaurar da entidade para criar uma instância válida
    return Intervencao.restaurar(props);
  }
}
