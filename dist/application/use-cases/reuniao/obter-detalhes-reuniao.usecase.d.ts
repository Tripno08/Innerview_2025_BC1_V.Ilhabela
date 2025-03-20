import { IRuniaoRepository } from '@domain/repositories/reuniao-repository.interface';
import { Reuniao } from '@domain/entities/reuniao.entity';
interface ReuniaoDetalhesResponse {
    reuniao: Reuniao;
    participantes: any[];
    encaminhamentos: any[];
}
export declare class ObterDetalhesReuniaoUseCase {
    private reuniaoRepository;
    constructor(reuniaoRepository: IRuniaoRepository);
    execute(reuniaoId: string): Promise<ReuniaoDetalhesResponse>;
}
export {};
