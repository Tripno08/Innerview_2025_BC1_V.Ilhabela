import { IEstudanteRepository } from '@domain/repositories/estudante-repository.interface';
import { Estudante } from '@domain/entities/estudante.entity';
import { BaseRepository } from './base.repository';
export declare class EstudanteRepository extends BaseRepository<Estudante> implements IEstudanteRepository {
    findAll(): Promise<Estudante[]>;
    findByUsuarioId(usuarioId: string): Promise<Estudante[]>;
    findById(id: string): Promise<Estudante | null>;
    create(data: any): Promise<Estudante>;
    update(id: string, data: any): Promise<Estudante>;
    delete(id: string): Promise<void>;
    adicionarDificuldade(estudanteId: string, dificuldadeId: string): Promise<Estudante>;
    removerDificuldade(estudanteId: string, dificuldadeId: string): Promise<Estudante>;
    adicionarAvaliacao(estudanteId: string, avaliacaoData: any): Promise<Estudante>;
    buscarEstudantesComNecessidadesSimilares(dificuldadeIds: string[]): Promise<Estudante[]>;
    private getEstudanteIncludes;
    private mapToEstudante;
}
