import { IBaseRepository } from './base-repository.interface';
import { Reuniao } from '@domain/entities/reuniao.entity';
export interface IRuniaoRepository extends IBaseRepository<Reuniao> {
    findByEquipe(equipeId: string): Promise<Reuniao[]>;
    findByData(dataInicio: Date, dataFim: Date): Promise<Reuniao[]>;
    findByStatus(status: string): Promise<Reuniao[]>;
    adicionarParticipante(reuniaoId: string, usuarioId: string, cargo?: string): Promise<void>;
    removerParticipante(reuniaoId: string, usuarioId: string): Promise<void>;
    marcarPresenca(reuniaoId: string, usuarioId: string, presente: boolean): Promise<void>;
    listarParticipantes(reuniaoId: string): Promise<any[]>;
    adicionarEncaminhamento(reuniaoId: string, encaminhamentoData: any): Promise<any>;
    listarEncaminhamentos(reuniaoId: string): Promise<any[]>;
    atualizarResumo(reuniaoId: string, resumo: string): Promise<Reuniao>;
    atualizarStatus(reuniaoId: string, status: string): Promise<Reuniao>;
}
