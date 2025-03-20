import { IEstudanteRepository, AvaliacaoEstudante } from '@domain/repositories/estudante-repository.interface';
import { Estudante } from '@domain/entities/estudante.entity';
import { BaseRepository } from './base.repository';
import { UnitOfWork } from '../database/unit-of-work';
export declare class EstudanteRepository extends BaseRepository<Estudante> implements IEstudanteRepository {
    constructor(unitOfWork: UnitOfWork);
    findAll(): Promise<Estudante[]>;
    findByUsuarioId(usuarioId: string): Promise<Estudante[]>;
    findById(id: string): Promise<Estudante | null>;
    private adaptToPrismaCreate;
    private adaptToPrismaUpdate;
    create(data: Partial<Estudante>): Promise<Estudante>;
    update(id: string, data: Partial<Omit<Estudante, 'id'>>): Promise<Estudante>;
    delete(id: string): Promise<void>;
    adicionarDificuldade(estudanteId: string, dificuldadeId: string, dadosAdicionais?: {
        tipo: string;
        observacoes?: string;
    }): Promise<Estudante>;
    removerDificuldade(estudanteId: string, dificuldadeId: string): Promise<Estudante>;
    adicionarAvaliacao(estudanteId: string, avaliacaoData: AvaliacaoEstudante): Promise<Estudante>;
    buscarEstudantesComNecessidadesSimilares(dificuldadeIds: string[]): Promise<Estudante[]>;
    private getEstudanteIncludes;
    private mapToEstudante;
}
