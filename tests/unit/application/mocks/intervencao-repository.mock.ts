import { Intervencao, TipoIntervencao, CatalogoIntervencao } from '../../../../src/domain/entities/intervencao.entity';
import { Status } from '../../../../src/shared/enums';
import { IIntervencaoRepositoryMock } from '../../domain/repositories/intervencao-repository.mock.interface';
import { CatalogoRepositoryMock } from './catalogo-repository.mock';

/**
 * Mock para o repositório de intervenções
 */
export class IntervencaoRepositoryMock implements IIntervencaoRepositoryMock {
  // Propriedades para armazenar dados
  private intervencoes: Map<string, Intervencao> = new Map();
  private catalogoRepositoryMock: CatalogoRepositoryMock;

  constructor() {
    this.catalogoRepositoryMock = new CatalogoRepositoryMock();
  }

  // Implementação dos métodos da interface IBaseRepository
  async findAll(): Promise<Intervencao[]> {
    return Array.from(this.intervencoes.values());
  }

  async findById(id: string): Promise<Intervencao | null> {
    return this.intervencoes.get(id) || null;
  }

  async create(data: any): Promise<Intervencao> {
    const id = data.id || `intervencao-${Date.now()}`;
    const intervencao = { ...data, id };
    this.intervencoes.set(id, intervencao as Intervencao);
    return intervencao as Intervencao;
  }

  async update(id: string, data: any): Promise<Intervencao> {
    const intervencao = this.intervencoes.get(id);
    if (!intervencao) {
      return null;
    }

    const updated = { ...intervencao, ...data };
    this.intervencoes.set(id, updated as Intervencao);
    return updated as Intervencao;
  }

  async delete(id: string): Promise<void> {
    this.intervencoes.delete(id);
  }

  // Implementação dos métodos específicos da interface IIntervencaoRepository
  async findByEstudanteId(estudanteId: string): Promise<Intervencao[]> {
    return Array.from(this.intervencoes.values()).filter(
      (i) => i.estudanteId === estudanteId
    );
  }

  async findByFilter(filtros?: any): Promise<Intervencao[]> {
    let result = Array.from(this.intervencoes.values());

    if (!filtros) {
      return result;
    }

    if (filtros.estudanteId) {
      result = result.filter((i) => i.estudanteId === filtros.estudanteId);
    }

    if (filtros.tipo) {
      result = result.filter((i) => i.tipo === filtros.tipo);
    }

    if (filtros.status) {
      result = result.filter((i) => i.status === filtros.status);
    }

    return result;
  }

  async atualizarProgresso(id: string, progresso: number): Promise<Intervencao> {
    const intervencao = this.intervencoes.get(id);
    if (!intervencao) {
      return null;
    }

    const updated = { ...intervencao, progresso };
    this.intervencoes.set(id, updated as Intervencao);
    return updated as Intervencao;
  }

  async concluir(id: string): Promise<Intervencao> {
    const intervencao = this.intervencoes.get(id);
    if (!intervencao) {
      return null;
    }

    const updated = {
      ...intervencao,
      status: Status.CONCLUIDO,
      progresso: 100,
    };
    this.intervencoes.set(id, updated as Intervencao);
    return updated as Intervencao;
  }

  async cancelar(id: string): Promise<Intervencao> {
    const intervencao = this.intervencoes.get(id);
    if (!intervencao) {
      return null;
    }

    const updated = { ...intervencao, status: Status.CANCELADO };
    this.intervencoes.set(id, updated as Intervencao);
    return updated as Intervencao;
  }

  // Implementação de métodos de acesso ao catálogo
  getCatalogoRepository(): CatalogoRepositoryMock {
    return this.catalogoRepositoryMock;
  }

  async findCatalogoByDificuldade(dificuldadeId: string): Promise<any[]> {
    return this.catalogoRepositoryMock.findByDificuldade(dificuldadeId);
  }

  async findAllCatalogo(): Promise<any[]> {
    return this.catalogoRepositoryMock.findAll();
  }

  // Implementação dos métodos adicionais usados pelo caso de uso
  async buscarPorId(id: string): Promise<Intervencao | null> {
    return this.findById(id);
  }

  async buscarCatalogoPorId(id: string): Promise<any | null> {
    return this.catalogoRepositoryMock.findById(id);
  }

  async criar(data: any): Promise<Intervencao> {
    return this.create(data);
  }

  async atualizar(id: string, data: any): Promise<Intervencao> {
    return this.update(id, data);
  }

  async excluir(id: string): Promise<void> {
    return this.delete(id);
  }

  async criarCatalogo(data: any): Promise<any> {
    return this.catalogoRepositoryMock.create(data);
  }

  async atualizarCatalogo(id: string, data: any): Promise<any> {
    return this.catalogoRepositoryMock.update(id, data);
  }

  async excluirCatalogo(id: string): Promise<void> {
    return this.catalogoRepositoryMock.delete(id);
  }

  async findCatalogoById(id: string): Promise<CatalogoIntervencao | null> {
    return this.buscarCatalogoPorId(id);
  }

  async createCatalogo(data: any): Promise<CatalogoIntervencao> {
    return this.criarCatalogo(data);
  }

  async updateCatalogo(id: string, data: any): Promise<CatalogoIntervencao> {
    return this.atualizarCatalogo(id, data);
  }

  async deleteCatalogo(id: string): Promise<void> {
    return this.excluirCatalogo(id);
  }

  async findCatalogoByTipo(tipo: TipoIntervencao): Promise<CatalogoIntervencao[]> {
    return this.catalogoRepositoryMock.findByTipo(tipo);
  }

  // Métodos utilitários para testes
  mockIntervencao(intervencao: Intervencao): void {
    this.intervencoes.set(intervencao.id, intervencao);
  }

  reset(): void {
    this.intervencoes.clear();
    this.catalogoRepositoryMock.reset();
  }
} 