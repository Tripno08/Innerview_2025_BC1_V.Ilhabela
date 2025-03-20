import { IEstudanteRepository } from '@domain/repositories/estudante-repository.interface';
import { IUsuarioRepository } from '@domain/repositories/usuario-repository.interface';
import { Estudante } from '@domain/entities/estudante.entity';
import { AppError } from '@shared/errors/app-error';

interface CadastrarEstudanteDTO {
  nome: string;
  serie: string;
  dataNascimento: Date;
  usuarioId: string; // ID do professor responsável
}

interface CadastrarEstudanteResultado {
  estudante: Estudante;
}

/**
 * Caso de uso para cadastrar um novo estudante
 */
export class CadastrarEstudanteUseCase {
  constructor(
    private readonly estudanteRepository: IEstudanteRepository,
    private readonly usuarioRepository: IUsuarioRepository,
  ) {}

  /**
   * Executa o caso de uso
   */
  async execute(data: CadastrarEstudanteDTO): Promise<CadastrarEstudanteResultado> {
    // Verificar se o usuário (professor) existe
    const usuario = await this.usuarioRepository.findById(data.usuarioId);

    if (!usuario) {
      throw new AppError('Professor não encontrado', 404, 'TEACHER_NOT_FOUND');
    }

    // Validar data de nascimento
    const dataNascimento = new Date(data.dataNascimento);
    const hoje = new Date();

    if (dataNascimento > hoje) {
      throw new AppError('Data de nascimento não pode ser futura', 400, 'INVALID_BIRTH_DATE');
    }

    // Validar série
    if (!data.serie || data.serie.trim() === '') {
      throw new AppError('Série é obrigatória', 400, 'INVALID_GRADE');
    }

    // Criar o estudante
    try {
      const estudante = await this.estudanteRepository.create({
        nome: data.nome,
        serie: data.serie,
        dataNascimento,
        usuarioId: data.usuarioId,
      });

      return { estudante };
    } catch (error) {
      if (error instanceof Error) {
        throw new AppError(
          `Erro ao cadastrar estudante: ${error.message}`,
          400,
          'STUDENT_CREATION_ERROR',
        );
      }
      throw error;
    }
  }
}
