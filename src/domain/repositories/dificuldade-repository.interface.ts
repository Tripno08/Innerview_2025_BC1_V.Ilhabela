import {
  DificuldadeAprendizagem,
  TipoDificuldade,
} from '@domain/entities/dificuldade-aprendizagem.entity';
import { IBaseRepository } from './base-repository.interface';

/**
 * Interface para repositório de dificuldades de aprendizagem
 */
export interface IDificuldadeRepository extends IBaseRepository<DificuldadeAprendizagem> {
  /**
   * Encontrar por tipo
   */
  findByTipo(tipo: TipoDificuldade): Promise<DificuldadeAprendizagem[]>;

  /**
   * Encontrar dificuldades associadas a um estudante
   */
  findByEstudanteId(estudanteId: string): Promise<DificuldadeAprendizagem[]>;
}
