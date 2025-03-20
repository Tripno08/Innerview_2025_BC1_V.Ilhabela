import { DificuldadeAprendizagem as DificuldadeEntity } from '../../domain/entities/dificuldade-aprendizagem.entity';

/**
 * DTO para listar dificuldades de aprendizagem
 */
export interface ListarDificuldadesDTO {
  /**
   * ID da instituição para filtrar
   */
  instituicaoId?: string;

  /**
   * Tipo de dificuldade para filtrar
   */
  tipo?: string;

  /**
   * Categoria de dificuldade para filtrar
   */
  categoria?: string;

  /**
   * Status para filtrar (ATIVO, INATIVO)
   */
  status?: string;

  /**
   * ID do usuário que está realizando a operação
   */
  usuarioId: string;
}

/**
 * Representa uma dificuldade de aprendizagem retornada pela listagem
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
   * Criar uma representação simples a partir da entidade
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
