import { Equipe } from '@domain/entities/equipe.entity';
import { IBaseRepository } from './base-repository.interface';
export interface MembroEquipe {
    id: string;
    usuarioId: string;
    equipeId: string;
    cargo: string;
    funcao?: string;
    dataEntrada: Date;
    dataSaida?: Date;
    usuario?: {
        id: string;
        nome: string;
        email: string;
        cargo: string;
    };
}
export interface EstudanteEquipe {
    id: string;
    estudanteId: string;
    equipeId: string;
    dataEntrada: Date;
    dataSaida?: Date;
    estudante?: {
        id: string;
        nome: string;
        serie: string;
        idade?: number;
    };
}
export interface IEquipeRepository extends IBaseRepository<Equipe> {
    findByUsuarioId(usuarioId: string): Promise<Equipe[]>;
    adicionarMembro(equipeId: string, usuarioId: string, funcao?: string): Promise<void>;
    removerMembro(equipeId: string, usuarioId: string): Promise<void>;
    listarMembros(equipeId: string): Promise<MembroEquipe[]>;
    adicionarEstudante(equipeId: string, estudanteId: string): Promise<void>;
    removerEstudante(equipeId: string, estudanteId: string): Promise<void>;
    listarEstudantes(equipeId: string): Promise<EstudanteEquipe[]>;
}
