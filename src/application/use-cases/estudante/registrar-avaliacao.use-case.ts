import {
  IEstudanteRepository,
  AvaliacaoEstudante,
} from '../../../domain/repositories/estudante-repository.interface';
import { Estudante, Avaliacao } from '../../../domain/entities/estudante.entity';
import { AppError } from '../../../shared/errors/app-error';

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
      avaliadorId: data.avaliadorId,
      disciplina: data.disciplina,
      conteudo: data.conteudo,
    };

    // Adicionar a avaliação
    const estudanteAtualizado = await this.estudanteRepository.adicionarAvaliacao(
      data.estudanteId,
      avaliacaoData,
    );

    // Obter a avaliação recém-adicionada (última na lista)
    const avaliacao = estudanteAtualizado.avaliacoes[estudanteAtualizado.avaliacoes.length - 1];

    // Retornar o resultado
    return {
      estudante: estudanteAtualizado,
      avaliacao,
    };
  }

  /**
   * Validar os dados da avaliação
   */
  private validarAvaliacao(data: RegistrarAvaliacaoDTO): void {
    // Validar tipo da avaliação
    const tiposValidos = ['PROVA', 'EXERCICIO', 'TRABALHO', 'PARTICIPACAO', 'OUTRO'];
    if (!tiposValidos.includes(data.tipo)) {
      throw new AppError(
        `Tipo de avaliação inválido. Valores válidos: ${tiposValidos.join(', ')}`,
        400,
        'INVALID_EVALUATION_TYPE',
      );
    }

    // Validar pontuação (de 0 a 10)
    if (data.pontuacao < 0 || data.pontuacao > 10) {
      throw new AppError('A pontuação deve estar entre 0 e 10', 400, 'INVALID_EVALUATION_SCORE');
    }

    // Validar a data (não pode ser futura)
    const dataAvaliacao = new Date(data.data);
    const hoje = new Date();
    if (dataAvaliacao > hoje) {
      throw new AppError('A data da avaliação não pode ser futura', 400, 'INVALID_EVALUATION_DATE');
    }
  }
}
