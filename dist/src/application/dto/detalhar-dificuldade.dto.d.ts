import { DificuldadeAprendizagem as DificuldadeEntity } from '../../domain/entities/dificuldade-aprendizagem.entity';
export interface DetalharDificuldadeDTO {
    id: string;
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
    totalEstudantes?: number;
    static fromEntity(entity: DificuldadeEntity, totalEstudantes?: number): DificuldadeAprendizagem;
}
