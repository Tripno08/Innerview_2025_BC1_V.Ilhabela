export interface ListarIntervencoesRecomendadasDTO {
    dificuldadeId: string;
    estudanteId?: string;
    limite?: number;
    usuarioId: string;
}
export declare class CatalogoIntervencao {
    id: string;
    titulo: string;
    descricao: string;
    tipo: string;
    objetivos: string;
    estrategias: string;
    recursos?: string;
    duracaoEstimada?: number;
    nivelEficacia?: number;
    totalUsos: number;
    criadoEm: Date;
    static fromData(data: any): CatalogoIntervencao;
}
