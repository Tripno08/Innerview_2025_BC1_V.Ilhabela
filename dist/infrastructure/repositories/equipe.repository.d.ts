import { IEquipeRepository } from '@domain/repositories/equipe-repository.interface';
import { Equipe } from '@domain/entities/equipe.entity';
import { BaseRepository } from './base.repository';
export declare class EquipeRepository extends BaseRepository<Equipe> implements IEquipeRepository {
    findAll(): Promise<Equipe[]>;
    findByUsuarioId(usuarioId: string): Promise<Equipe[]>;
    findById(id: string): Promise<Equipe | null>;
    create(data: any): Promise<Equipe>;
    update(id: string, data: any): Promise<Equipe>;
    delete(id: string): Promise<void>;
    adicionarMembro(equipeId: string, usuarioId: string, funcao?: string): Promise<void>;
    removerMembro(equipeId: string, usuarioId: string): Promise<void>;
    listarMembros(equipeId: string): Promise<any[]>;
    adicionarEstudante(equipeId: string, estudanteId: string): Promise<void>;
    removerEstudante(equipeId: string, estudanteId: string): Promise<void>;
    listarEstudantes(equipeId: string): Promise<any[]>;
    private getEquipeIncludes;
    private mapToEquipe;
}
