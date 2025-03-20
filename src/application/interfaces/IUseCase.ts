/**
 * Interface genérica para todos os casos de uso
 *
 * @template TInput - Tipo de dados de entrada (DTO)
 * @template TOutput - Tipo de dados de saída
 */
export interface IUseCase<TInput, TOutput> {
  /**
   * Executa o caso de uso
   *
   * @param data - Dados de entrada
   * @returns Promise com o resultado da execução
   */
  execute(data: TInput): Promise<TOutput>;
}
