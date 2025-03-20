import {
  IEstudanteRepository,
  AvaliacaoEstudante,
} from '@domain/repositories/estudante-repository.interface';
import { Estudante, Avaliacao } from '@domain/entities/estudante.entity';
import { AppError } from '@shared/errors/app-error';

interface RegistrarAvaliacaoDTO {
  estudanteId: string;
  avaliadorId: string;
  data: Date;
  tipo: string;
  pontuacao: number;
  observacoes?: string;
  disciplina?: string;
  conteudo?: string;
}

interface RegistrarAvaliacaoResultado {
  estudante: Estudante;
  avaliacao: Avaliacao;
}

/**
 * Caso de uso para registrar uma avaliação para um estudante
 */
export class RegistrarAvaliacaoUseCase {
  constructor(private readonly estudanteRepository: IEstudanteRepository) {}

  /**
   * Executa o caso de uso
   */
  async execute(data: RegistrarAvaliacaoDTO): Promise<RegistrarAvaliacaoResultado> {
    // Verificar se o estudante existe
    const estudante = await this.estudanteRepository.findById(data.estudanteId);

    if (!estudante) {
      throw new AppError('Estudante não encontrado', 404, 'STUDENT_NOT_FOUND');
    }

    // Validar dados da avaliação
    this.validarAvaliacao(data);

    // Preparar dados da avaliação
    const avaliacaoData: AvaliacaoEstudante = {
      data: new Date(data.data),
      tipo: data.tipo,
      pontuacao: data.pontuacao,
      observacoes: data.observacoes,
      avaliadorId: data.avaliadorId || 'sistema',
      disciplina: data.disciplina,
      conteudo: data.conteudo,
    };

    try {
      // Adicionar a avaliação ao estudante
      const estudanteAtualizado = await this.estudanteRepository.adicionarAvaliacao(
        data.estudanteId,
        avaliacaoData,
      );

      // Obter a avaliação recém-adicionada (última na lista)
      const avaliacaoAdicionada =
        estudanteAtualizado.avaliacoes[estudanteAtualizado.avaliacoes.length - 1];

      return {
        estudante: estudanteAtualizado,
        avaliacao: avaliacaoAdicionada,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new AppError(
          `Erro ao registrar avaliação: ${error.message}`,
          400,
          'ASSESSMENT_CREATION_ERROR',
        );
      }
      throw error;
    }
  }

  /**
   * Validar dados da avaliação
   */
  private validarAvaliacao(data: RegistrarAvaliacaoDTO): void {
    // Validar data
    const dataAvaliacao = new Date(data.data);
    const hoje = new Date();

    if (dataAvaliacao > hoje) {
      throw new AppError('Data da avaliação não pode ser futura', 400, 'INVALID_ASSESSMENT_DATE');
    }

    // Validar tipo
    if (!data.tipo || data.tipo.trim() === '') {
      throw new AppError('Tipo de avaliação é obrigatório', 400, 'INVALID_ASSESSMENT_TYPE');
    }

    // Validar pontuação
    if (data.pontuacao < 0 || data.pontuacao > 10) {
      throw new AppError('Pontuação deve estar entre 0 e 10', 400, 'INVALID_ASSESSMENT_SCORE');
    }

    // Validar avaliador
    if (!data.avaliadorId) {
      throw new AppError('ID do avaliador é obrigatório', 400, 'INVALID_ASSESSOR_ID');
    }
  }
}
