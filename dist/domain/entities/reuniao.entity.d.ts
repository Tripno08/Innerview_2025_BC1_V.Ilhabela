export interface ReuniaoProps {
    id: string;
    titulo: string;
    data: Date;
    local?: string;
    status: string;
    observacoes?: string;
    resumo?: string;
    criadoEm: Date;
    atualizadoEm: Date;
    equipeId: string;
    equipe?: any;
    participantes?: any[];
    encaminhamentos?: any[];
}
export declare class Reuniao {
    readonly id: string;
    readonly titulo: string;
    readonly data: Date;
    readonly local?: string;
    readonly status: string;
    readonly observacoes?: string;
    readonly resumo?: string;
    readonly criadoEm: Date;
    readonly atualizadoEm: Date;
    readonly equipeId: string;
    readonly equipe?: any;
    readonly participantes?: any[];
    readonly encaminhamentos?: any[];
    private constructor();
    static criar(props: Omit<ReuniaoProps, 'id' | 'criadoEm' | 'atualizadoEm'>): Reuniao;
    static restaurar(props: ReuniaoProps): Reuniao;
    atualizar(props: Partial<Omit<ReuniaoProps, 'id' | 'criadoEm'>>): Reuniao;
    estaAgendada(): boolean;
    estaEmAndamento(): boolean;
    estaConcluida(): boolean;
    estaCancelada(): boolean;
}
