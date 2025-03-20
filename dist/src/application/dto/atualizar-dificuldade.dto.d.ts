import { DificuldadeAprendizagem as DificuldadeEntity, TipoDificuldade, CategoriaDificuldade } from '../../domain/entities/dificuldade-aprendizagem.entity';
import { Status } from '../../shared/enums';
export interface AtualizarDificuldadeDTO {
    id: string;
    nome?: string;
    descricao?: string;
    sintomas?: string;
    tipo?: TipoDificuldade;
    categoria?: CategoriaDificuldade;
    status?: Status;
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
