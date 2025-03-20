import { IIntervencaoRepository } from '@domain/repositories/intervencao-repository.interface';
import { Intervencao, TipoIntervencao } from '@domain/entities/intervencao.entity';
import { BaseRepository } from './base.repository';
import { UnitOfWork } from '../database/unit-of-work';
export declare class IntervencaoRepository extends BaseRepository<Intervencao> implements IIntervencaoRepository {
    constructor(unitOfWork: UnitOfWork);
    findAll(): Promise<Intervencao[]>;
    findAllCatalogo(): Promise<any[]>;
    findCatalogoById(id: string): Promise<any | null>;
    findCatalogoByTipo(tipo: TipoIntervencao): Promise<any[]>;
    findCatalogoByDificuldade(dificuldadeId: string): Promise<any[]>;
    createCatalogo(data: Record<string, unknown>): Promise<any>;
    updateCatalogo(id: string, data: Record<string, unknown>): Promise<any>;
    deleteCatalogo(id: string): Promise<void>;
    findByEstudanteId(estudanteId: string): Promise<Intervencao[]>;
    findByEstudante(estudanteId: string): Promise<Intervencao[]>;
    findById(id: string): Promise<Intervencao | null>;
    create(data: Partial<Omit<Intervencao, 'id'>>): Promise<Intervencao>;
    update(id: string, data: Partial<Omit<Intervencao, 'id'>>): Promise<Intervencao>;
    delete(id: string): Promise<void>;
    atualizarProgresso(id: string, progresso: number): Promise<Intervencao>;
    registrarProgresso(id: string, valor: number, observacao?: string): Promise<Intervencao>;
    concluir(id: string): Promise<Intervencao>;
    cancelar(id: string): Promise<Intervencao>;
    private getCatalogoIncludes;
    private getIntervencaoIncludes;
    private mapToCatalogo;
    private mapToIntervencao;
}
