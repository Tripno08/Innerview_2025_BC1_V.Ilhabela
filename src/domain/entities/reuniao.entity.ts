import { Equipe } from './equipe.entity';

/**
 * Interfaces para substituir os 'any'
 */
export interface ParticipanteReuniao {
  id: string;
  usuarioId: string;
  reuniaoId: string;
  presente?: boolean;
  confirmado?: boolean;
  justificativa?: string;
  papel?: string;
  obrigatorio?: boolean;
}

export interface EncaminhamentoReuniao {
  id: string;
  reuniaoId: string;
  descricao: string;
  responsavelId?: string;
  prazo?: Date;
  status: string;
  prioridade?: string;
  observacoes?: string;
}

/**
 * Propriedades para a entidade Reunião
 */
export interface ReuniaoProps {
  id: string;
  titulo: string;
  data: Date;
  local?: string;
  pauta?: string;
  status: string;
  observacoes?: string;
  resumo?: string;
  criadoEm: Date;
  atualizadoEm: Date;
  equipeId: string;
  equipe?: Equipe;
  participantes?: ParticipanteReuniao[];
  encaminhamentos?: EncaminhamentoReuniao[];
}

/**
 * Entidade de domínio para Reunião
 */
export class Reuniao {
  readonly id: string;
  readonly titulo: string;
  readonly data: Date;
  readonly local?: string;
  readonly pauta?: string;
  readonly status: string;
  readonly observacoes?: string;
  readonly resumo?: string;
  readonly criadoEm: Date;
  readonly atualizadoEm: Date;
  readonly equipeId: string;
  readonly equipe?: Equipe;
  readonly participantes?: ParticipanteReuniao[];
  readonly encaminhamentos?: EncaminhamentoReuniao[];

  private constructor(props: ReuniaoProps) {
    this.id = props.id;
    this.titulo = props.titulo;
    this.data = props.data;
    this.local = props.local;
    this.pauta = props.pauta;
    this.status = props.status;
    this.observacoes = props.observacoes;
    this.resumo = props.resumo;
    this.criadoEm = props.criadoEm;
    this.atualizadoEm = props.atualizadoEm;
    this.equipeId = props.equipeId;
    this.equipe = props.equipe;
    this.participantes = props.participantes;
    this.encaminhamentos = props.encaminhamentos;
  }

  /**
   * Cria uma nova instância da entidade Reunião
   */
  static criar(props: Omit<ReuniaoProps, 'id' | 'criadoEm' | 'atualizadoEm'>): Reuniao {
    const reuniao: ReuniaoProps = {
      ...props,
      id: crypto.randomUUID(),
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    };

    return new Reuniao(reuniao);
  }

  /**
   * Restaura uma instância existente da entidade Reunião
   */
  static restaurar(props: ReuniaoProps): Reuniao {
    return new Reuniao(props);
  }

  /**
   * Atualiza a reunião com novos dados
   */
  atualizar(props: Partial<Omit<ReuniaoProps, 'id' | 'criadoEm'>>): Reuniao {
    return new Reuniao({
      ...this,
      ...props,
      atualizadoEm: new Date(),
    });
  }

  /**
   * Verifica se a reunião está agendada
   */
  estaAgendada(): boolean {
    return this.status === 'AGENDADO';
  }

  /**
   * Verifica se a reunião está em andamento
   */
  estaEmAndamento(): boolean {
    return this.status === 'EM_ANDAMENTO';
  }

  /**
   * Verifica se a reunião foi concluída
   */
  estaConcluida(): boolean {
    return this.status === 'CONCLUIDO';
  }

  /**
   * Verifica se a reunião foi cancelada
   */
  estaCancelada(): boolean {
    return this.status === 'CANCELADO';
  }
}
