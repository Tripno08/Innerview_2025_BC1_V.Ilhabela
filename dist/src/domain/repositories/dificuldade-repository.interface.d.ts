import { DificuldadeAprendizagem, TipoDificuldade } from '@domain/entities/dificuldade-aprendizagem.entity';
import { IBaseRepository } from './base-repository.interface';
export interface IDificuldadeRepository extends IBaseRepository<DificuldadeAprendizagem> {
    findByTipo(tipo: TipoDificuldade): Promise<DificuldadeAprendizagem[]>;
    findByEstudanteId(estudanteId: string): Promise<DificuldadeAprendizagem[]>;
}
