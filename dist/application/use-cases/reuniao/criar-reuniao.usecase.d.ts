import { IRuniaoRepository } from '@domain/repositories/reuniao-repository.interface';
import { Reuniao } from '@domain/entities/reuniao.entity';
export interface CriarReuniaoDTO {
    titulo: string;
    data: Date;
    local?: string;
    equipeId: string;
    observacoes?: string;
    status?: string;
    participantes?: string[];
}
export declare class CriarReuniaoUseCase {
    private reuniaoRepository;
    constructor(reuniaoRepository: IRuniaoRepository);
    execute(dados: CriarReuniaoDTO): Promise<Reuniao>;
}
