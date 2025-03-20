import { IEquipeRepository, MembroEquipe, EstudanteEquipe } from '@domain/repositories/equipe-repository.interface';
import { Equipe } from '@domain/entities/equipe.entity';
import { BaseRepository } from './base.repository';
import { UnitOfWork } from '../database/unit-of-work';
export declare class EquipeRepository extends BaseRepository<Equipe> implements IEquipeRepository {
    constructor(unitOfWork: UnitOfWork);
    findAll(): Promise<Equipe[]>;
    findByUsuarioId(usuarioId: string): Promise<Equipe[]>;
    findById(id: string): Promise<Equipe | null>;
    create(data: Record<string, unknown>): Promise<Equipe>;
    update(id: string, data: Record<string, unknown>): Promise<Equipe>;
    delete(id: string): Promise<void>;
    private verificarMembroEquipe;
    adicionarMembro(equipeId: string, usuarioId: string, funcao?: string): Promise<void>;
    removerMembro(equipeId: string, usuarioId: string): Promise<void>;
    listarMembros(equipeId: string): Promise<MembroEquipe[]>;
    private verificarEstudanteEquipe;
    adicionarEstudante(equipeId: string, estudanteId: string): Promise<void>;
    removerEstudante(equipeId: string, estudanteId: string): Promise<void>;
    listarEstudantes(equipeId: string): Promise<EstudanteEquipe[]>;
    private calcularIdade;
    private getEquipeIncludes;
    private mapCargoUsuarioToCargoEquipe;
    private mapToEquipe;
    private mapCargoPapel;
    private parseDate;
    private mapToMembro;
}
