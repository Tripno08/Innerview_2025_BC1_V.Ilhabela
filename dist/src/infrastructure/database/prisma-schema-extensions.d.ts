interface EstudanteDificuldadeWhereUniqueInput {
    estudanteId_dificuldadeId?: {
        estudanteId: string;
        dificuldadeId: string;
    };
}
interface MembroEquipeWhereUniqueInput {
    equipeId_usuarioId?: {
        equipeId: string;
        usuarioId: string;
    };
}
interface EstudanteEquipeWhereUniqueInput {
    equipeId_estudanteId?: {
        equipeId: string;
        estudanteId: string;
    };
}
interface DificuldadeAprendizagemWhereInput {
    tipo?: string | {
        equals?: string;
        in?: string[];
    };
    categoria?: string | {
        equals?: string;
        in?: string[];
    };
}
export { EstudanteDificuldadeWhereUniqueInput, MembroEquipeWhereUniqueInput, EstudanteEquipeWhereUniqueInput, DificuldadeAprendizagemWhereInput, };
