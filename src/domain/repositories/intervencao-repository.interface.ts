import {
  Intervencao,
  TipoIntervencao,
  CatalogoIntervencao,
} from '../entities/intervencao.entity';

/**
 * Interface para repositório de intervenções
 */
export interface IIntervencaoRepository {
  /**
   * Encontrar todas as intervenções do catálogo (modelos)
   */
  findAllCatalogo(): Promise<CatalogoIntervencao[]>;

  /**
   * Encontrar um modelo de intervenção do catálogo por ID
   */
  findCatalogoById(id: string): Promise<CatalogoIntervencao | null>;

  /**
   * Encontrar modelos de intervenção por tipo
   */
  findCatalogoByTipo(tipo: TipoIntervencao): Promise<CatalogoIntervencao[]>;

  /**
   * Encontrar modelos de intervenção para um tipo de dificuldade
   */
  findCatalogoByDificuldade(dificuldadeId: string): Promise<CatalogoIntervencao[]>;

  /**
   * Criar um novo modelo de intervenção no catálogo
   */
  createCatalogo(data: Record<string, unknown>): Promise<CatalogoIntervencao>;

  /**
   * Atualizar um modelo de intervenção
   */
  updateCatalogo(id: string, data: Record<string, unknown>): Promise<CatalogoIntervencao>;

  /**
   * Remover um modelo de intervenção
   */
  deleteCatalogo(id: string): Promise<void>;

  /**
   * Encontrar todas as instâncias de intervenção de um estudante
   */
  findByEstudanteId(estudanteId: string): Promise<Intervencao[]>;

  /**
   * Encontrar uma instância de intervenção por ID
   */
  findById(id: string): Promise<Intervencao | null>;

  /**
   * Criar uma nova instância de intervenção para um estudante
   */
  create(data: Record<string, unknown>): Promise<Intervencao>;

  /**
   * Atualizar uma instância de intervenção
   */
  update(id: string, data: Record<string, unknown>): Promise<Intervencao>;

  /**
   * Atualizar o progresso de uma intervenção
   */
  atualizarProgresso(id: string, progresso: number): Promise<Intervencao>;

  /**
   * Concluir uma intervenção
   */
  concluir(id: string): Promise<Intervencao>;

  /**
   * Cancelar uma intervenção
   */
  cancelar(id: string): Promise<Intervencao>;
}
