import {
  DificuldadeAprendizagem as DificuldadeEntity,
  TipoDificuldade,
  CategoriaDificuldade,
} from '../../domain/entities/dificuldade-aprendizagem.entity';
import { Status } from '../../shared/enums';

/**
 * DTO para atualizar uma dificuldade de aprendizagem
 */
export interface AtualizarDificuldadeDTO {
  /**
   * ID da dificuldade a ser atualizada
   */
  id: string;

  /**
   * Nome da dificuldade (opcional)
   */
  nome?: string;

  /**
   * Descrição da dificuldade (opcional)
   */
  descricao?: string;

  /**
   * Sintomas associados à dificuldade (opcional)
   */
  sintomas?: string;

  /**
   * Tipo de dificuldade (opcional)
   */
  tipo?: TipoDificuldade;

  /**
   * Categoria de dificuldade (opcional)
   */
  categoria?: CategoriaDificuldade;

  /**
   * Status da dificuldade (opcional)
   */
  status?: Status;

  /**
   * ID do usuário que está realizando a operação
   */
  usuarioId: string;
}

/**
 * Representa uma dificuldade de aprendizagem retornada após atualização
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
