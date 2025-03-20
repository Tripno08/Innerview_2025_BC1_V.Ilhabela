import { IEstudanteRepository } from '@domain/repositories/estudante-repository.interface';
import { IDificuldadeRepository } from '@domain/repositories/dificuldade-repository.interface';
import { IIntervencaoRepository } from '@domain/repositories/intervencao-repository.interface';
import { CatalogoIntervencao } from '@domain/entities/intervencao.entity';
interface RecomendarIntervencoesDTO {
    estudanteId: string;
}
interface RecomendarIntervencoesResultado {
    intervencoes: CatalogoIntervencao[];
}
export declare class RecomendarIntervencoesUseCase {
    private readonly estudanteRepository;
    private readonly dificuldadeRepository;
    private readonly intervencaoRepository;
    constructor(estudanteRepository: IEstudanteRepository, dificuldadeRepository: IDificuldadeRepository, intervencaoRepository: IIntervencaoRepository);
    execute(data: RecomendarIntervencoesDTO): Promise<RecomendarIntervencoesResultado>;
    private intervencaoAtendeTiposDificuldade;
}
export {};
