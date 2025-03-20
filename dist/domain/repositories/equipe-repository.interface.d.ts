import { Equipe } from '@domain/entities/equipe.entity';
import { IBaseRepository } from './base-repository.interface';
export interface IEquipeRepository extends IBaseRepository<Equipe> {
    findByUsuarioId(usuarioId: string): Promise<Equipe[]>;
    adicionarMembro(equipeId: string, usuarioId: string, funcao?: string): Promise<void>;
    removerMembro(equipeId: string, usuarioId: string): Promise<void>;
    listarMembros(equipeId: string): Promise<any[]>;
    adicionarEstudante(equipeId: string, estudanteId: string): Promise<void>;
    removerEstudante(equipeId: string, estudanteId: string): Promise<void>;
    listarEstudantes(equipeId: string): Promise<any[]>;
}
