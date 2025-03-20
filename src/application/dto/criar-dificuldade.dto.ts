import {
  DificuldadeAprendizagem as DificuldadeEntity,
  TipoDificuldade,
  CategoriaDificuldade,
} from '../../domain/entities/dificuldade-aprendizagem.entity';

/**
 * DTO para criar uma dificuldade de aprendizagem
 */
export interface CriarDificuldadeDTO {
  /**
   * Nome da dificuldade
   */
  nome: string;

  /**
   * Descrição da dificuldade
   */
  descricao: string;

  /**
   * Sintomas associados à dificuldade
   */
  sintomas: string;

  /**
   * Tipo de dificuldade
   */
  tipo: TipoDificuldade;

  /**
   * Categoria de dificuldade
   */
  categoria: CategoriaDificuldade;

  /**
   * ID do usuário que está realizando a operação
   */
  usuarioId: string;
}

/**
 * Representa uma dificuldade de aprendizagem retornada após criação
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

  /**
   * Criar uma representação a partir da entidade
   */
  static fromEntity(entity: DificuldadeEntity): DificuldadeAprendizagem {
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
    return dto;
  }
}
