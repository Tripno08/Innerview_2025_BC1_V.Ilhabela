import { IRuniaoRepository } from '@domain/repositories/reuniao-repository.interface';
import { Reuniao } from '@domain/entities/reuniao.entity';

/**
 * Caso de uso para listar todas as reuniões
 */
export class ListarReunioesUseCase {
  constructor(private reuniaoRepository: IRuniaoRepository) {}

  /**
   * Executa o caso de uso
   */
  async execute(): Promise<Reuniao[]> {
    return await this.reuniaoRepository.findAll();
  }
}

/**
 * Caso de uso para listar reuniões por equipe
 */
export class ListarReunioesPorEquipeUseCase {
  constructor(private reuniaoRepository: IRuniaoRepository) {}

  /**
   * Executa o caso de uso
   */
  async execute(equipeId: string): Promise<Reuniao[]> {
    return await this.reuniaoRepository.findByEquipe(equipeId);
  }
}

/**
 * Caso de uso para listar reuniões por período
 */
export class ListarReunioesPorPeriodoUseCase {
  constructor(private reuniaoRepository: IRuniaoRepository) {}

  /**
   * Executa o caso de uso
   */
  async execute(dataInicio: Date, dataFim: Date): Promise<Reuniao[]> {
    return await this.reuniaoRepository.findByData(dataInicio, dataFim);
  }
}

/**
 * Caso de uso para listar reuniões por status
 */
export class ListarReunioesPorStatusUseCase {
  constructor(private reuniaoRepository: IRuniaoRepository) {}

  /**
   * Executa o caso de uso
   */
  async execute(status: string): Promise<Reuniao[]> {
    return await this.reuniaoRepository.findByStatus(status);
  }
}
