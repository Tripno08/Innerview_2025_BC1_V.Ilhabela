import { Equipe } from './equipe.entity';
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
export declare class Reuniao {
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
    private constructor();
    static criar(props: Omit<ReuniaoProps, 'id' | 'criadoEm' | 'atualizadoEm'>): Reuniao;
    static restaurar(props: ReuniaoProps): Reuniao;
    atualizar(props: Partial<Omit<ReuniaoProps, 'id' | 'criadoEm'>>): Reuniao;
    estaAgendada(): boolean;
    estaEmAndamento(): boolean;
    estaConcluida(): boolean;
    estaCancelada(): boolean;
}
