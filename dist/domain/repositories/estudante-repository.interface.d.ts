import { Estudante } from '@domain/entities/estudante.entity';
import { IBaseRepository } from './base-repository.interface';
export interface IEstudanteRepository extends IBaseRepository<Estudante> {
    findByUsuarioId(usuarioId: string): Promise<Estudante[]>;
    adicionarDificuldade(estudanteId: string, dificuldadeId: string): Promise<Estudante>;
    removerDificuldade(estudanteId: string, dificuldadeId: string): Promise<Estudante>;
    adicionarAvaliacao(estudanteId: string, avaliacaoData: any): Promise<Estudante>;
    buscarEstudantesComNecessidadesSimilares(dificuldadeIds: string[]): Promise<Estudante[]>;
}
