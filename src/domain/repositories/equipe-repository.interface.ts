import { Equipe } from '@domain/entities/equipe.entity';
import { IBaseRepository } from './base-repository.interface';

/**
 * Interface para membros de equipe
 */
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

/**
 * Interface para estudantes de equipe
 */
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

/**
 * Interface para repositório de equipes
 */
export interface IEquipeRepository extends IBaseRepository<Equipe> {
  /**
   * Encontrar equipes por usuário
   */
  findByUsuarioId(usuarioId: string): Promise<Equipe[]>;

  /**
   * Adicionar um membro à equipe
   */
  adicionarMembro(equipeId: string, usuarioId: string, funcao?: string): Promise<void>;

  /**
   * Remover um membro da equipe
   */
  removerMembro(equipeId: string, usuarioId: string): Promise<void>;

  /**
   * Listar membros de uma equipe
   */
  listarMembros(equipeId: string): Promise<MembroEquipe[]>;

  /**
   * Adicionar estudante à equipe
   */
  adicionarEstudante(equipeId: string, estudanteId: string): Promise<void>;

  /**
   * Remover estudante da equipe
   */
  removerEstudante(equipeId: string, estudanteId: string): Promise<void>;

  /**
   * Listar estudantes de uma equipe
   */
  listarEstudantes(equipeId: string): Promise<EstudanteEquipe[]>;
}
