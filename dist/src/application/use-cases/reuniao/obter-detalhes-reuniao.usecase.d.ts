import { IRuniaoRepository } from '@domain/repositories/reuniao-repository.interface';
import { Reuniao, ParticipanteReuniao, EncaminhamentoReuniao } from '@domain/entities/reuniao.entity';
interface ReuniaoDetalhesResponse {
    reuniao: Reuniao;
    participantes: ParticipanteReuniao[];
    encaminhamentos: EncaminhamentoReuniao[];
}
export declare class ObterDetalhesReuniaoUseCase {
    private reuniaoRepository;
    constructor(reuniaoRepository: IRuniaoRepository);
    execute(reuniaoId: string): Promise<ReuniaoDetalhesResponse>;
}
export {};
