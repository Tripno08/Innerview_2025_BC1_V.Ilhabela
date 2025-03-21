import { Estudante } from '../entities/estudante.entity';
import { IBaseRepository } from './base-repository.interface';

/**
 * Interface para dados de avaliação de estudante
 */
export interface AvaliacaoEstudante {
  data: Date;
  tipo: string;
  pontuacao?: number;
  observacoes?: string;
  avaliadorId: string;
  disciplina?: string;
  conteudo?: string;
}

/**
 * Interface para repositório de estudantes
 *
 * Define as operações disponíveis para manipulação de dados de estudantes
 */
export interface IEstudanteRepository extends IBaseRepository<Estudante> {
  /**
   * Encontrar estudantes por ID de usuário (professor)
   */
  findByUsuarioId(usuarioId: string): Promise<Estudante[]>;

  /**
   * Adicionar uma dificuldade de aprendizagem a um estudante
   */
  adicionarDificuldade(
    estudanteId: string,
    dificuldadeId: string,
    dadosAdicionais?: {
      tipo: string;
      observacoes?: string;
    },
  ): Promise<Estudante>;

  /**
   * Remover uma dificuldade de aprendizagem de um estudante
   */
  removerDificuldade(estudanteId: string, dificuldadeId: string): Promise<Estudante>;

  /**
   * Adicionar uma avaliação a um estudante
   */
  adicionarAvaliacao(estudanteId: string, avaliacaoData: AvaliacaoEstudante): Promise<Estudante>;

  /**
   * Buscar estudantes com necessidades similares
   */
  buscarEstudantesComNecessidadesSimilares(dificuldadeIds: string[]): Promise<Estudante[]>;
}
