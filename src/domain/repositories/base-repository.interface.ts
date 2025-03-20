/**
 * Interface base para todos os repositórios
 *
 * @template T Tipo da entidade
 * @template ID Tipo do identificador da entidade (default: string)
 */
export interface IBaseRepository<T, ID = string> {
  /**
   * Encontrar todas as entidades
   */
  findAll(): Promise<T[]>;

  /**
   * Encontrar uma entidade pelo ID
   */
  findById(id: ID): Promise<T | null>;

  /**
   * Criar uma nova entidade
   */
  create(data: Partial<Omit<T, 'id'>>): Promise<T>;

  /**
   * Atualizar uma entidade existente
   */
  update(id: ID, data: Partial<Omit<T, 'id'>>): Promise<T>;

  /**
   * Remover uma entidade
   */
  delete(id: ID): Promise<void>;
}
