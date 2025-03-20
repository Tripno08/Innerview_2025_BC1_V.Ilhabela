import { CatalogoIntervencao, Intervencao, TipoIntervencao } from '@domain/entities/intervencao.entity';
export interface IIntervencaoRepository {
    findAllCatalogo(): Promise<CatalogoIntervencao[]>;
    findCatalogoById(id: string): Promise<CatalogoIntervencao | null>;
    findCatalogoByTipo(tipo: TipoIntervencao): Promise<CatalogoIntervencao[]>;
    findCatalogoByDificuldade(dificuldadeId: string): Promise<CatalogoIntervencao[]>;
    createCatalogo(data: any): Promise<CatalogoIntervencao>;
    updateCatalogo(id: string, data: any): Promise<CatalogoIntervencao>;
    deleteCatalogo(id: string): Promise<void>;
    findByEstudanteId(estudanteId: string): Promise<Intervencao[]>;
    findById(id: string): Promise<Intervencao | null>;
    create(data: any): Promise<Intervencao>;
    update(id: string, data: any): Promise<Intervencao>;
    atualizarProgresso(id: string, progresso: number): Promise<Intervencao>;
    concluir(id: string): Promise<Intervencao>;
    cancelar(id: string): Promise<Intervencao>;
}
