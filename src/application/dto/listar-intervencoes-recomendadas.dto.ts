/**
 * DTO para listar intervenções recomendadas para uma dificuldade de aprendizagem
 */
export interface ListarIntervencoesRecomendadasDTO {
  /**
   * ID da dificuldade
   */
  dificuldadeId: string;

  /**
   * ID do estudante (opcional)
   */
  estudanteId?: string;

  /**
   * Limitar a quantidade de resultados (opcional)
   */
  limite?: number;

  /**
   * ID do usuário que está realizando a operação
   */
  usuarioId: string;
}

/**
 * Representa os dados brutos de uma intervenção
 */
export interface IntervencaoData {
  id: string;
  titulo: string;
  descricao: string;
  tipo: string;
  objetivos: string;
  estrategias: string;
  recursos?: string;
  duracaoEstimada?: number;
  nivelEficacia?: number;
  totalUsos?: number;
  criadoEm: Date;
}

/**
 * Representa uma intervenção recomendada para uma dificuldade
 */
export class CatalogoIntervencao {
  id: string;
  titulo: string;
  descricao: string;
  tipo: string;
  objetivos: string;
  estrategias: string;
  recursos?: string;
  duracaoEstimada?: number;
  nivelEficacia?: number;
  totalUsos: number;
  criadoEm: Date;

  /**
   * Criar uma representação simples a partir dos dados
   */
  static fromData(data: IntervencaoData): CatalogoIntervencao {
    const dto = new CatalogoIntervencao();
    dto.id = data.id;
    dto.titulo = data.titulo;
    dto.descricao = data.descricao;
    dto.tipo = data.tipo;
    dto.objetivos = data.objetivos;
    dto.estrategias = data.estrategias;
    dto.recursos = data.recursos;
    dto.duracaoEstimada = data.duracaoEstimada;
    dto.nivelEficacia = data.nivelEficacia;
    dto.totalUsos = data.totalUsos || 0;
    dto.criadoEm = data.criadoEm;
    return dto;
  }
}
