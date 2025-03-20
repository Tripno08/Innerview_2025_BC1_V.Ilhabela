import { Estudante } from '@domain/entities/estudante.entity';
import { IBaseRepository } from './base-repository.interface';
export interface AvaliacaoEstudante {
    data: Date;
    tipo: string;
    pontuacao?: number;
    observacoes?: string;
    avaliadorId: string;
    disciplina?: string;
    conteudo?: string;
}
export interface IEstudanteRepository extends IBaseRepository<Estudante> {
    findByUsuarioId(usuarioId: string): Promise<Estudante[]>;
    adicionarDificuldade(estudanteId: string, dificuldadeId: string, dadosAdicionais?: {
        tipo: string;
        observacoes?: string;
    }): Promise<Estudante>;
    removerDificuldade(estudanteId: string, dificuldadeId: string): Promise<Estudante>;
    adicionarAvaliacao(estudanteId: string, avaliacaoData: AvaliacaoEstudante): Promise<Estudante>;
    buscarEstudantesComNecessidadesSimilares(dificuldadeIds: string[]): Promise<Estudante[]>;
}
