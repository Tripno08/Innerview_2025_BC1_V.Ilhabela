import { DificuldadeAprendizagem as DificuldadeEntity } from '../../domain/entities/dificuldade-aprendizagem.entity';

/**
 * DTO para detalhar uma dificuldade de aprendizagem
 */
export interface DetalharDificuldadeDTO {
  /**
   * ID da dificuldade a ser detalhada
   */
  id: string;

  /**
   * ID do usuário que está realizando a operação
   */
  usuarioId: string;
}

/**
 * Representa os detalhes de uma dificuldade de aprendizagem
 */
export class DificuldadeAprendizagem {
  id: string;
  nome: string;
  descricao: string;
  sintomas: string;
  tipo: string;
  categoria: string;
  status: string;
  criadoEm: Date;
  atualizadoEm: Date;
  totalEstudantes?: number;

  /**
   * Criar uma representação detalhada a partir da entidade
   */
  static fromEntity(entity: DificuldadeEntity, totalEstudantes?: number): DificuldadeAprendizagem {
    const dto = new DificuldadeAprendizagem();
    dto.id = entity.id;
    dto.nome = entity.nome;
    dto.descricao = entity.descricao;
    dto.sintomas = entity.sintomas;
    dto.tipo = entity.tipo;
    dto.categoria = entity.categoria;
    dto.status = entity.status;
    dto.criadoEm = entity.criadoEm;
    dto.atualizadoEm = entity.atualizadoEm;
    if (totalEstudantes !== undefined) {
      dto.totalEstudantes = totalEstudantes;
    }
    return dto;
  }
}
