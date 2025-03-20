import { IRuniaoRepository } from '@domain/repositories/reuniao-repository.interface';
import {
  Reuniao,
  ParticipanteReuniao,
  EncaminhamentoReuniao,
} from '@domain/entities/reuniao.entity';
import { AppError } from '@shared/errors/app-error';

/**
 * Interface para resposta de detalhes da reunião
 */
interface ReuniaoDetalhesResponse {
  reuniao: Reuniao;
  participantes: ParticipanteReuniao[];
  encaminhamentos: EncaminhamentoReuniao[];
}

/**
 * Caso de uso para obter detalhes completos de uma reunião
 */
export class ObterDetalhesReuniaoUseCase {
  constructor(private reuniaoRepository: IRuniaoRepository) {}

  /**
   * Executa o caso de uso
   */
  async execute(reuniaoId: string): Promise<ReuniaoDetalhesResponse> {
    // Obter dados da reunião
    const reuniao = await this.reuniaoRepository.findById(reuniaoId);

    if (!reuniao) {
      throw new AppError('Reunião não encontrada', 404, 'MEETING_NOT_FOUND');
    }

    // Obter participantes da reunião
    const participantes = await this.reuniaoRepository.listarParticipantes(reuniaoId);

    // Obter encaminhamentos da reunião
    const encaminhamentos = await this.reuniaoRepository.listarEncaminhamentos(reuniaoId);

    return {
      reuniao,
      participantes,
      encaminhamentos,
    };
  }
}
