import { DificuldadeAprendizagem as DificuldadeEntity, TipoDificuldade, CategoriaDificuldade } from '../../domain/entities/dificuldade-aprendizagem.entity';
export interface CriarDificuldadeDTO {
    nome: string;
    descricao: string;
    sintomas: string;
    tipo: TipoDificuldade;
    categoria: CategoriaDificuldade;
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
