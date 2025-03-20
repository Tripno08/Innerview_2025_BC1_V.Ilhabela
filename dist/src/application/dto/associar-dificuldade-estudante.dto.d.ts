import { Estudante } from '../../domain/entities/estudante.entity';
import { DificuldadeAprendizagem } from '../../domain/entities/dificuldade-aprendizagem.entity';
export interface AssociarDificuldadeEstudanteDTO {
    estudanteId: string;
    dificuldadeId: string;
    observacoes?: string;
    dataIdentificacao?: Date;
    usuarioId: string;
}
export declare class EstudanteDificuldade {
    id: string;
    estudanteId: string;
    dificuldadeId: string;
    dataIdentificacao: Date;
    observacoes?: string;
    criadoEm: Date;
    estudante?: {
        id: string;
        nome: string;
    };
    dificuldade?: {
        id: string;
        nome: string;
        tipo: string;
        categoria: string;
    };
    static fromEntities(estudanteId: string, dificuldadeId: string, dataIdentificacao: Date, observacoes?: string, estudante?: Estudante, dificuldade?: DificuldadeAprendizagem): EstudanteDificuldade;
}
