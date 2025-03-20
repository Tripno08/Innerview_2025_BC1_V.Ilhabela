import { IEstudanteRepository } from '@domain/repositories/estudante-repository.interface';
import { IDificuldadeRepository } from '@domain/repositories/dificuldade-repository.interface';
import { Estudante } from '@domain/entities/estudante.entity';
import { AppError } from '@shared/errors/app-error';

interface AssociarDificuldadeDTO {
  estudanteId: string;
  dificuldadeId: string;
}

interface AssociarDificuldadeResultado {
  estudante: Estudante;
}

/**
 * Caso de uso para associar uma dificuldade de aprendizagem a um estudante
 */
export class AssociarDificuldadeUseCase {
  constructor(
    private readonly estudanteRepository: IEstudanteRepository,
    private readonly dificuldadeRepository: IDificuldadeRepository,
  ) {}

  /**
   * Executa o caso de uso
   */
  async execute(data: AssociarDificuldadeDTO): Promise<AssociarDificuldadeResultado> {
    // Verificar se o estudante existe
    const estudante = await this.estudanteRepository.findById(data.estudanteId);

    if (!estudante) {
      throw new AppError('Estudante não encontrado', 404, 'STUDENT_NOT_FOUND');
    }

    // Verificar se a dificuldade existe
    const dificuldade = await this.dificuldadeRepository.findById(data.dificuldadeId);

    if (!dificuldade) {
      throw new AppError('Dificuldade de aprendizagem não encontrada', 404, 'DIFFICULTY_NOT_FOUND');
    }

    // Verificar se a dificuldade está ativa
    if (!dificuldade.estaAtiva()) {
      throw new AppError(
        'Dificuldade de aprendizagem inativa não pode ser associada',
        400,
        'INACTIVE_DIFFICULTY',
      );
    }

    // Verificar se a dificuldade já está associada ao estudante
    const dificuldadesAtuais = await this.dificuldadeRepository.findByEstudanteId(data.estudanteId);

    if (dificuldadesAtuais.some((d) => d.id === data.dificuldadeId)) {
      throw new AppError(
        'Dificuldade já está associada a este estudante',
        409,
        'DIFFICULTY_ALREADY_ASSOCIATED',
      );
    }

    // Associar a dificuldade ao estudante
    const estudanteAtualizado = await this.estudanteRepository.adicionarDificuldade(
      data.estudanteId,
      data.dificuldadeId,
    );

    return { estudante: estudanteAtualizado };
  }
}
