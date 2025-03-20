/**
 * DTO para excluir uma dificuldade de aprendizagem
 */
export interface ExcluirDificuldadeDTO {
  /**
   * ID da dificuldade a ser excluída
   */
  id: string;

  /**
   * ID do usuário que está realizando a operação
   */
  usuarioId: string;
}
