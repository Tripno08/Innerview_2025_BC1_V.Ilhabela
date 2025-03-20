/**
 * DTO para remover a associação de uma dificuldade de aprendizagem a um estudante
 */
export interface RemoverDificuldadeEstudanteDTO {
  /**
   * ID do estudante
   */
  estudanteId: string;

  /**
   * ID da dificuldade
   */
  dificuldadeId: string;

  /**
   * Motivo da remoção (opcional)
   */
  motivo?: string;

  /**
   * ID do usuário que está realizando a operação
   */
  usuarioId: string;
}
