import { IDificuldadeRepository } from '@domain/repositories/dificuldade-repository.interface';
import { DificuldadeAprendizagem, TipoDificuldade } from '@domain/entities/dificuldade-aprendizagem.entity';
import { BaseRepository } from './base.repository';
import { UnitOfWork } from '../database/unit-of-work';
export declare class DificuldadeRepository extends BaseRepository<DificuldadeAprendizagem> implements IDificuldadeRepository {
    constructor(unitOfWork: UnitOfWork);
    findAll(): Promise<DificuldadeAprendizagem[]>;
    findById(id: string): Promise<DificuldadeAprendizagem | null>;
    findByTipo(tipo: TipoDificuldade): Promise<DificuldadeAprendizagem[]>;
    findByEstudanteId(estudanteId: string): Promise<DificuldadeAprendizagem[]>;
    create(data: Record<string, unknown>): Promise<DificuldadeAprendizagem>;
    update(id: string, data: Record<string, unknown>): Promise<DificuldadeAprendizagem>;
    delete(id: string): Promise<void>;
    private mapToDificuldade;
    private parseDate;
}
