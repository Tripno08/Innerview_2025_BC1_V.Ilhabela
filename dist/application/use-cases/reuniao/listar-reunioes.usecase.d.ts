import { IRuniaoRepository } from '@domain/repositories/reuniao-repository.interface';
import { Reuniao } from '@domain/entities/reuniao.entity';
export declare class ListarReunioesUseCase {
    private reuniaoRepository;
    constructor(reuniaoRepository: IRuniaoRepository);
    execute(): Promise<Reuniao[]>;
}
export declare class ListarReunioesPorEquipeUseCase {
    private reuniaoRepository;
    constructor(reuniaoRepository: IRuniaoRepository);
    execute(equipeId: string): Promise<Reuniao[]>;
}
export declare class ListarReunioesPorPeriodoUseCase {
    private reuniaoRepository;
    constructor(reuniaoRepository: IRuniaoRepository);
    execute(dataInicio: Date, dataFim: Date): Promise<Reuniao[]>;
}
export declare class ListarReunioesPorStatusUseCase {
    private reuniaoRepository;
    constructor(reuniaoRepository: IRuniaoRepository);
    execute(status: string): Promise<Reuniao[]>;
}
