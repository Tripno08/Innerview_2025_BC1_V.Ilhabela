import { Status } from '@shared/enums';
import { Usuario } from './usuario.entity';
import { Estudante } from './estudante.entity';
export declare enum PapelMembro {
    COORDENADOR = "COORDENADOR",
    PROFESSOR = "PROFESSOR",
    PSICOLOGO = "PSICOLOGO",
    ASSISTENTE_SOCIAL = "ASSISTENTE_SOCIAL",
    FONOAUDIOLOGO = "FONOAUDIOLOGO",
    TERAPEUTA_OCUPACIONAL = "TERAPEUTA_OCUPACIONAL",
    OUTRO = "OUTRO"
}
export interface MembroEquipeProps {
    id?: string;
    papelMembro: PapelMembro;
    usuarioId: string;
    usuario?: Usuario;
    criadoEm?: Date;
    atualizadoEm?: Date;
}
export interface EstudanteEquipeProps {
    id?: string;
    estudanteId: string;
    estudante?: Estudante;
    criadoEm?: Date;
    atualizadoEm?: Date;
}
export interface EquipeProps {
    id?: string;
    nome: string;
    descricao?: string;
    status?: Status;
    membros?: MembroEquipeProps[];
    estudantes?: EstudanteEquipeProps[];
    criadoEm?: Date;
    atualizadoEm?: Date;
}
export declare class MembroEquipe {
    readonly id: string;
    readonly papelMembro: PapelMembro;
    readonly usuarioId: string;
    readonly usuario?: Usuario;
    readonly criadoEm: Date;
    readonly atualizadoEm: Date;
    constructor(props: MembroEquipeProps);
    private validar;
    static criar(props: MembroEquipeProps): MembroEquipe;
    eCoordenador(): boolean;
    temPapel(papel: PapelMembro): boolean;
}
export declare class EstudanteEquipe {
    readonly id: string;
    readonly estudanteId: string;
    readonly estudante?: Estudante;
    readonly criadoEm: Date;
    readonly atualizadoEm: Date;
    constructor(props: EstudanteEquipeProps);
    private validar;
    static criar(props: EstudanteEquipeProps): EstudanteEquipe;
}
export declare class Equipe {
    readonly id: string;
    readonly nome: string;
    readonly descricao: string;
    readonly status: Status;
    readonly membros: MembroEquipe[];
    readonly estudantes: EstudanteEquipe[];
    readonly criadoEm: Date;
    readonly atualizadoEm: Date;
    private constructor();
    private validar;
    static criar(props: EquipeProps): Equipe;
    static restaurar(dados: EquipeProps): Equipe;
    adicionarMembro(membro: MembroEquipeProps): Equipe;
    removerMembro(usuarioId: string): Equipe;
    adicionarEstudante(estudante: EstudanteEquipeProps): Equipe;
    removerEstudante(estudanteId: string): Equipe;
    atualizar(dados: Partial<Omit<EquipeProps, 'id' | 'criadoEm' | 'membros' | 'estudantes'>>): Equipe;
    inativar(): Equipe;
    estaAtiva(): boolean;
    obterCoordenadores(): MembroEquipe[];
    temMembro(usuarioId: string): boolean;
    temEstudante(estudanteId: string): boolean;
    quantidadeMembros(): number;
    quantidadeEstudantes(): number;
}
