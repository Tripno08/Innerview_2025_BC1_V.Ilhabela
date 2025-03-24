import { Intervencao, TipoIntervencao, CatalogoIntervencao } from '../entities/intervencao.entity';
import { IBaseRepository } from './base-repository.interface';
import {
  ICriarIntervencaoDTO,
  IAtualizarIntervencaoDTO,
  IFiltrosIntervencaoDTO,
  ICriarCatalogoIntervencaoDTO,
  IAtualizarCatalogoIntervencaoDTO,
} from '../dtos/intervencao.dto';

/**
 * Interface para o repositório de catálogo de intervenções
 */
export interface ICatalogoIntervencaoRepository
  extends IBaseRepository<
    CatalogoIntervencao,
    ICriarCatalogoIntervencaoDTO,
    IAtualizarCatalogoIntervencaoDTO
  > {
  /**
   * Busca catálogos de intervenção por tipo
   * @param tipo Tipo da intervenção
   * @returns Array de catálogos do tipo especificado
   */
  findByTipo(tipo: TipoIntervencao): Promise<CatalogoIntervencao[]>;

  /**
   * Busca catálogos de intervenção por dificuldade
   * @param dificuldadeId ID da dificuldade
   * @returns Array de catálogos para a dificuldade especificada
   */
  findByDificuldade(dificuldadeId: string): Promise<CatalogoIntervencao[]>;

  /**
   * Busca catálogos de intervenção por filtros
   * @param filtros Opções de filtro
   * @returns Array de catálogos que correspondem aos filtros
   */
  findByFilter(filtros?: IFiltrosIntervencaoDTO): Promise<CatalogoIntervencao[]>;
}

/**
 * Interface para o repositório de intervenções
 */
export interface IIntervencaoRepository
  extends IBaseRepository<Intervencao, ICriarIntervencaoDTO, IAtualizarIntervencaoDTO> {
  /**
   * Busca intervenções por estudante
   * @param estudanteId ID do estudante
   * @returns Array de intervenções do estudante
   */
  findByEstudanteId(estudanteId: string): Promise<Intervencao[]>;

  /**
   * Busca intervenções com filtros
   * @param filtros Opções de filtro
   * @returns Array de intervenções que correspondem aos filtros
   */
  findByFilter(filtros?: IFiltrosIntervencaoDTO): Promise<Intervencao[]>;

  /**
   * Atualiza o progresso de uma intervenção
   * @param id ID da intervenção
   * @param progresso Valor do progresso (0-100)
   * @returns Intervenção atualizada
   */
  atualizarProgresso(id: string, progresso: number): Promise<Intervencao>;

  /**
   * Marca uma intervenção como concluída
   * @param id ID da intervenção
   * @returns Intervenção concluída
   */
  concluir(id: string): Promise<Intervencao>;

  /**
   * Cancela uma intervenção
   * @param id ID da intervenção
   * @returns Intervenção cancelada
   */
  cancelar(id: string): Promise<Intervencao>;

  /**
   * Obtém o repositório de catálogo de intervenções
   * @returns Repositório de catálogo de intervenções
   */
  getCatalogoRepository(): ICatalogoIntervencaoRepository;

  /**
   * Busca catálogos de intervenção por dificuldade
   * @param dificuldadeId ID da dificuldade
   * @returns Array de catálogos para a dificuldade especificada
   */
  findCatalogoByDificuldade(dificuldadeId: string): Promise<CatalogoIntervencao[]>;

  /**
   * Busca todos os catálogos de intervenção
   * @returns Array com todos os catálogos de intervenção
   */
  findAllCatalogo(): Promise<CatalogoIntervencao[]>;

  /**
   * Alias para findById - Busca uma intervenção por ID
   * @param id ID da intervenção
   * @returns Intervenção encontrada ou null
   */
  buscarPorId(id: string): Promise<Intervencao | null>;
  
  /**
   * Busca um catálogo de intervenção por ID
   * @param id ID do catálogo de intervenção
   * @returns Catálogo de intervenção encontrado ou null
   */
  buscarCatalogoPorId(id: string): Promise<CatalogoIntervencao | null>;
  
  /**
   * Busca um catálogo de intervenção por ID (alias para buscarCatalogoPorId)
   * @param id ID do catálogo de intervenção
   * @returns Catálogo de intervenção encontrado ou null
   */
  findCatalogoById(id: string): Promise<CatalogoIntervencao | null>;

  /**
   * Alias para create - Cria uma nova intervenção
   * @param data Dados para criação da intervenção
   * @returns Intervenção criada
   */
  criar(data: Intervencao): Promise<Intervencao>;

  /**
   * Alias para update - Atualiza uma intervenção existente
   * @param id ID da intervenção
   * @param data Dados para atualização da intervenção
   * @returns Intervenção atualizada
   */
  atualizar(id: string, data: Intervencao): Promise<Intervencao>;

  /**
   * Alias para delete - Exclui uma intervenção
   * @param id ID da intervenção
   * @returns Promise void
   */
  excluir(id: string): Promise<void>;

  /**
   * Cria um novo catálogo de intervenção
   * @param data Dados para criação do catálogo
   * @returns Catálogo criado
   */
  criarCatalogo(data: CatalogoIntervencao): Promise<CatalogoIntervencao>;
  
  /**
   * Cria um novo catálogo de intervenção (alias para criarCatalogo)
   * @param data Dados para criação do catálogo
   * @returns Catálogo criado
   */
  createCatalogo(data: ICriarCatalogoIntervencaoDTO): Promise<CatalogoIntervencao>;

  /**
   * Atualiza um catálogo de intervenção existente
   * @param id ID do catálogo
   * @param data Dados para atualização do catálogo
   * @returns Catálogo atualizado
   */
  atualizarCatalogo(id: string, data: CatalogoIntervencao): Promise<CatalogoIntervencao>;
  
  /**
   * Atualiza um catálogo de intervenção existente (alias para atualizarCatalogo)
   * @param id ID do catálogo
   * @param data Dados para atualização do catálogo
   * @returns Catálogo atualizado
   */
  updateCatalogo(id: string, data: IAtualizarCatalogoIntervencaoDTO): Promise<CatalogoIntervencao>;

  /**
   * Exclui um catálogo de intervenção
   * @param id ID do catálogo
   * @returns Promise void
   */
  excluirCatalogo(id: string): Promise<void>;
  
  /**
   * Exclui um catálogo de intervenção (alias para excluirCatalogo)
   * @param id ID do catálogo
   * @returns Promise void
   */
  deleteCatalogo(id: string): Promise<void>;
  
  /**
   * Busca catálogos de intervenção por tipo
   * @param tipo Tipo da intervenção
   * @returns Array de catálogos do tipo especificado
   */
  findCatalogoByTipo(tipo: TipoIntervencao): Promise<CatalogoIntervencao[]>;
}
