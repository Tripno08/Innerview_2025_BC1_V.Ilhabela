import { IEstudanteRepository } from '@domain/repositories/estudante-repository.interface';
import { IIntervencaoRepository } from '@domain/repositories/intervencao-repository.interface';
import { Intervencao } from '@domain/entities/intervencao.entity';
import { Avaliacao } from '@domain/entities/estudante.entity';
interface AcompanharProgressoDTO {
    estudanteId: string;
}
interface AcompanharProgressoResultado {
    intervencoes: Intervencao[];
    avaliacoes: Avaliacao[];
    progressoGeral: number;
    statusIntervencoes: {
        ativas: number;
        concluidas: number;
        canceladas: number;
    };
    mediaAvaliacoes: number;
    tendencia: 'MELHORA' | 'ESTAVEL' | 'PIORA';
}
export declare class AcompanharProgressoUseCase {
    private readonly estudanteRepository;
    private readonly intervencaoRepository;
    constructor(estudanteRepository: IEstudanteRepository, intervencaoRepository: IIntervencaoRepository);
    execute(data: AcompanharProgressoDTO): Promise<AcompanharProgressoResultado>;
}
export {};
