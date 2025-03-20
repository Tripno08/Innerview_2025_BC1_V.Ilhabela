import { Estudante } from '../../domain/entities/estudante.entity';
import { DificuldadeAprendizagem } from '../../domain/entities/dificuldade-aprendizagem.entity';

/**
 * DTO para associar uma dificuldade de aprendizagem a um estudante
 */
export interface AssociarDificuldadeEstudanteDTO {
  /**
   * ID do estudante
   */
  estudanteId: string;

  /**
   * ID da dificuldade
   */
  dificuldadeId: string;

  /**
   * Observações sobre a associação (opcional)
   */
  observacoes?: string;

  /**
   * Data de identificação da dificuldade (opcional)
   */
  dataIdentificacao?: Date;

  /**
   * ID do usuário que está realizando a operação
   */
  usuarioId: string;
}

/**
 * Representa a associação entre estudante e dificuldade de aprendizagem
 */
export class EstudanteDificuldade {
  id: string;
  estudanteId: string;
  dificuldadeId: string;
  dataIdentificacao: Date;
  observacoes?: string;
  criadoEm: Date;
  estudante?: {
    id: string;
    nome: string;
  };
  dificuldade?: {
    id: string;
    nome: string;
    tipo: string;
    categoria: string;
  };

  /**
   * Criar uma representação a partir das entidades
   */
  static fromEntities(
    estudanteId: string,
    dificuldadeId: string,
    dataIdentificacao: Date,
    observacoes?: string,
    estudante?: Estudante,
    dificuldade?: DificuldadeAprendizagem,
  ): EstudanteDificuldade {
    const dto = new EstudanteDificuldade();
    dto.estudanteId = estudanteId;
    dto.dificuldadeId = dificuldadeId;
    dto.dataIdentificacao = dataIdentificacao;
    dto.observacoes = observacoes;
    dto.criadoEm = new Date();

    if (estudante) {
      dto.estudante = {
        id: estudante.id,
        nome: estudante.nome,
      };
    }

    if (dificuldade) {
      dto.dificuldade = {
        id: dificuldade.id,
        nome: dificuldade.nome,
        tipo: dificuldade.tipo,
        categoria: dificuldade.categoria,
      };
    }

    return dto;
  }
}
