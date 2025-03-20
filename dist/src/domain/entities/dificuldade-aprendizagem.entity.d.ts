import { Status } from '../../shared/enums';
export declare enum TipoDificuldade {
    PRIMARIA = "PRIMARIA",
    SECUNDARIA = "SECUNDARIA",
    LEITURA = "LEITURA",
    ESCRITA = "ESCRITA",
    MATEMATICA = "MATEMATICA",
    ATENCAO = "ATENCAO",
    COMPORTAMENTAL = "COMPORTAMENTAL",
    EMOCIONAL = "EMOCIONAL",
    SOCIAL = "SOCIAL",
    NEUROMOTORA = "NEUROMOTORA",
    OUTRO = "OUTRO"
}
export declare enum CategoriaDificuldade {
    LEVE = "LEVE",
    MODERADA = "MODERADA",
    GRAVE = "GRAVE"
}
export interface DificuldadeAprendizagemProps {
    id?: string;
    nome: string;
    descricao: string;
    sintomas: string;
    tipo: TipoDificuldade;
    categoria: CategoriaDificuldade;
    status?: Status;
    criadoEm?: Date;
    atualizadoEm?: Date;
}
export declare class DificuldadeAprendizagem {
    readonly id: string;
    readonly nome: string;
    readonly descricao: string;
    readonly sintomas: string;
    readonly tipo: TipoDificuldade;
    readonly categoria: CategoriaDificuldade;
    readonly status: Status;
    readonly criadoEm: Date;
    readonly atualizadoEm: Date;
    private constructor();
    private validar;
    static criar(props: DificuldadeAprendizagemProps): DificuldadeAprendizagem;
    static restaurar(dados: DificuldadeAprendizagemProps): DificuldadeAprendizagem;
    atualizar(dados: Partial<Omit<DificuldadeAprendizagemProps, 'id' | 'criadoEm'>>): DificuldadeAprendizagem;
    inativar(): DificuldadeAprendizagem;
    estaAtiva(): boolean;
    ehGrave(): boolean;
}
