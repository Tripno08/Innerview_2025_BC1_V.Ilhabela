import { Status } from '@prisma/client';
import { DificuldadeAprendizagem } from './dificuldade-aprendizagem.entity';
export interface AvaliacaoProps {
    id?: string;
    data: Date;
    tipo: string;
    pontuacao: number;
    observacoes?: string;
    criadoEm?: Date;
    atualizadoEm?: Date;
}
export interface EstudanteProps {
    id?: string;
    nome: string;
    serie: string;
    dataNascimento: Date;
    status?: Status;
    usuarioId: string;
    dificuldades?: DificuldadeAprendizagem[];
    avaliacoes?: AvaliacaoProps[];
    criadoEm?: Date;
    atualizadoEm?: Date;
}
export declare class Avaliacao {
    readonly id: string;
    readonly data: Date;
    readonly tipo: string;
    readonly pontuacao: number;
    readonly observacoes?: string;
    readonly criadoEm: Date;
    readonly atualizadoEm: Date;
    constructor(props: AvaliacaoProps);
    private validar;
    static criar(props: AvaliacaoProps): Avaliacao;
}
export declare class Estudante {
    readonly id: string;
    readonly nome: string;
    readonly serie: string;
    readonly dataNascimento: Date;
    readonly status: Status;
    readonly usuarioId: string;
    readonly dificuldades: DificuldadeAprendizagem[];
    readonly avaliacoes: Avaliacao[];
    readonly criadoEm: Date;
    readonly atualizadoEm: Date;
    private constructor();
    private validar;
    static criar(props: EstudanteProps): Estudante;
    static restaurar(dados: EstudanteProps): Estudante;
    adicionarDificuldade(dificuldade: DificuldadeAprendizagem): Estudante;
    removerDificuldade(dificuldadeId: string): Estudante;
    adicionarAvaliacao(avaliacao: AvaliacaoProps): Estudante;
    atualizar(dados: Partial<Omit<EstudanteProps, 'id' | 'criadoEm' | 'dificuldades' | 'avaliacoes'>>): Estudante;
    possuiDificuldadeGrave(): boolean;
    calcularMediaAvaliacoes(): number;
    inativar(): Estudante;
    estaAtivo(): boolean;
    calcularIdade(): number;
}
