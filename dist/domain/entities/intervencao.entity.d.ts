import { Status } from '@prisma/client';
export declare enum TipoIntervencao {
    PEDAGOGICA = "PEDAGOGICA",
    COMPORTAMENTAL = "COMPORTAMENTAL",
    PSICOLOGICA = "PSICOLOGICA",
    SOCIAL = "SOCIAL",
    MULTIDISCIPLINAR = "MULTIDISCIPLINAR",
    OUTRA = "OUTRA"
}
export interface IntervencaoProps {
    id?: string;
    titulo: string;
    descricao: string;
    tipo: TipoIntervencao;
    status?: Status;
    criadoEm?: Date;
    atualizadoEm?: Date;
}
export interface IntervencaoBaseProps extends IntervencaoProps {
    duracao?: number;
    dificuldadesAlvo?: string[];
    publico?: string[];
    recursos?: string[];
}
export interface IntervencaoInstanciaProps extends IntervencaoProps {
    dataInicio: Date;
    dataFim?: Date;
    estudanteId: string;
    intervencaoBaseId?: string;
    observacoes?: string;
    progresso?: number;
}
export declare abstract class IntervencaoBase {
    readonly id: string;
    readonly titulo: string;
    readonly descricao: string;
    readonly tipo: TipoIntervencao;
    readonly status: Status;
    readonly criadoEm: Date;
    readonly atualizadoEm: Date;
    constructor(props: IntervencaoProps);
    protected validarBase(): void;
    estaAtiva(): boolean;
}
export declare class CatalogoIntervencao extends IntervencaoBase {
    readonly duracao?: number;
    readonly dificuldadesAlvo: string[];
    readonly publico: string[];
    readonly recursos: string[];
    constructor(props: IntervencaoBaseProps);
    private validar;
    static criar(props: IntervencaoBaseProps): CatalogoIntervencao;
    static restaurar(dados: IntervencaoBaseProps): CatalogoIntervencao;
    atualizar(dados: Partial<Omit<IntervencaoBaseProps, 'id' | 'criadoEm'>>): CatalogoIntervencao;
    criarInstancia(estudanteId: string, dataInicio: Date, dataFim?: Date): Intervencao;
    inativar(): CatalogoIntervencao;
}
export declare class Intervencao extends IntervencaoBase {
    readonly dataInicio: Date;
    readonly dataFim?: Date;
    readonly estudanteId: string;
    readonly intervencaoBaseId?: string;
    readonly observacoes?: string;
    readonly progresso: number;
    constructor(props: IntervencaoInstanciaProps);
    private validar;
    static criar(props: IntervencaoInstanciaProps): Intervencao;
    static restaurar(dados: IntervencaoInstanciaProps): Intervencao;
    atualizar(dados: Partial<Omit<IntervencaoInstanciaProps, 'id' | 'criadoEm' | 'estudanteId'>>): Intervencao;
    atualizarProgresso(novoProgresso: number): Intervencao;
    concluir(): Intervencao;
    cancelar(): Intervencao;
    estaConcluida(): boolean;
    estaEmAndamento(): boolean;
    calcularDuracao(): number;
}
