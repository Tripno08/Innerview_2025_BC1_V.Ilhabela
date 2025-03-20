import { DificuldadeAprendizagem as DificuldadeEntity } from '../../domain/entities/dificuldade-aprendizagem.entity';
export interface ListarDificuldadesDTO {
    instituicaoId?: string;
    tipo?: string;
    categoria?: string;
    status?: string;
    usuarioId: string;
}
export declare class DificuldadeAprendizagem {
    id: string;
    nome: string;
    descricao: string;
    sintomas: string;
    tipo: string;
    categoria: string;
    status: string;
    criadoEm: Date;
    atualizadoEm: Date;
    static fromEntity(entity: DificuldadeEntity): DificuldadeAprendizagem;
}
