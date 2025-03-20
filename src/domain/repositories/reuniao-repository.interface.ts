import { IBaseRepository } from './base-repository.interface';
import { Reuniao, ParticipanteReuniao, EncaminhamentoReuniao } from '../entities/reuniao.entity';

/**
 * Interface para dados de encaminhamento
 */
export interface DadosEncaminhamento {
  descricao: string;
  responsavelId?: string;
  prazo?: Date;
  prioridade?: string;
  status?: string;
}

/**
 * Interface para repositório de reuniões
 *
 * Define as operações disponíveis para manipulação de dados de reuniões de equipe
 */
export interface IRuniaoRepository extends IBaseRepository<Reuniao> {
  /**
   * Encontrar reuniões por equipe
   */
  findByEquipe(equipeId: string): Promise<Reuniao[]>;

  /**
   * Encontrar reuniões por data
   */
  findByData(dataInicio: Date, dataFim: Date): Promise<Reuniao[]>;

  /**
   * Encontrar reuniões por status
   */
  findByStatus(status: string): Promise<Reuniao[]>;

  /**
   * Adicionar participante a uma reunião
   */
  adicionarParticipante(reuniaoId: string, usuarioId: string, cargo?: string): Promise<void>;

  /**
   * Remover participante de uma reunião
   */
  removerParticipante(reuniaoId: string, usuarioId: string): Promise<void>;

  /**
   * Marcar participante como presente em uma reunião
   */
  marcarPresenca(reuniaoId: string, usuarioId: string, presente: boolean): Promise<void>;

  /**
   * Listar participantes de uma reunião
   */
  listarParticipantes(reuniaoId: string): Promise<ParticipanteReuniao[]>;

  /**
   * Adicionar encaminhamento a uma reunião
   */
  adicionarEncaminhamento(
    reuniaoId: string,
    encaminhamentoData: DadosEncaminhamento,
  ): Promise<EncaminhamentoReuniao>;

  /**
   * Listar encaminhamentos de uma reunião
   */
  listarEncaminhamentos(reuniaoId: string): Promise<EncaminhamentoReuniao[]>;

  /**
   * Atualizar resumo da reunião
   */
  atualizarResumo(reuniaoId: string, resumo: string): Promise<Reuniao>;

  /**
   * Atualizar status da reunião
   */
  atualizarStatus(reuniaoId: string, status: string): Promise<Reuniao>;
}
