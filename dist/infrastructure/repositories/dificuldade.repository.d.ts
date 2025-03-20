import { IDificuldadeRepository } from '@domain/repositories/dificuldade-repository.interface';
import { DificuldadeAprendizagem, TipoDificuldade } from '@domain/entities/dificuldade-aprendizagem.entity';
import { BaseRepository } from './base.repository';
export declare class DificuldadeRepository extends BaseRepository<DificuldadeAprendizagem> implements IDificuldadeRepository {
    findAll(): Promise<DificuldadeAprendizagem[]>;
    findById(id: string): Promise<DificuldadeAprendizagem | null>;
    findByTipo(tipo: TipoDificuldade): Promise<DificuldadeAprendizagem[]>;
    findByEstudanteId(estudanteId: string): Promise<DificuldadeAprendizagem[]>;
    create(data: any): Promise<DificuldadeAprendizagem>;
    update(id: string, data: any): Promise<DificuldadeAprendizagem>;
    delete(id: string): Promise<void>;
    private mapToDificuldade;
}
