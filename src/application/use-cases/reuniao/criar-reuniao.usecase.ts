import { IRuniaoRepository } from '@domain/repositories/reuniao-repository.interface';
import { Reuniao } from '@domain/entities/reuniao.entity';
import { AppError } from '@shared/errors/app-error';

/**
 * DTO para criação de reunião
 */
export interface CriarReuniaoDTO {
  titulo: string;
  data: Date;
  local?: string;
  equipeId: string;
  observacoes?: string;
  status?: string;
  participantes?: string[]; // IDs dos usuários a serem adicionados como participantes
}

/**
 * Caso de uso para criar uma nova reunião
 */
export class CriarReuniaoUseCase {
  constructor(private reuniaoRepository: IRuniaoRepository) {}

  /**
   * Executa o caso de uso
   */
  async execute(dados: CriarReuniaoDTO): Promise<Reuniao> {
    // Validações básicas
    if (!dados.titulo) {
      throw new AppError('Título da reunião é obrigatório', 400, 'INVALID_INPUT');
    }

    if (!dados.data) {
      throw new AppError('Data da reunião é obrigatória', 400, 'INVALID_INPUT');
    }

    if (!dados.equipeId) {
      throw new AppError('ID da equipe é obrigatório', 400, 'INVALID_INPUT');
    }

    // Criar a reunião
    const reuniao = await this.reuniaoRepository.create({
      titulo: dados.titulo,
      data: dados.data,
      local: dados.local,
      equipeId: dados.equipeId,
      observacoes: dados.observacoes,
      status: dados.status || 'AGENDADO',
    });

    // Adicionar participantes, se fornecidos
    if (dados.participantes && dados.participantes.length > 0) {
      for (const usuarioId of dados.participantes) {
        try {
          await this.reuniaoRepository.adicionarParticipante(reuniao.id, usuarioId);
        } catch (error) {
          console.error(
            `Erro ao adicionar participante ${usuarioId} à reunião ${reuniao.id}:`,
            error,
          );
          // Continua adicionando outros participantes mesmo se um falhar
        }
      }
    }

    return reuniao;
  }
}
