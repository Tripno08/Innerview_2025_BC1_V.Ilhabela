import { IRuniaoRepository, DadosEncaminhamento } from '@domain/repositories/reuniao-repository.interface';
import { BaseRepository } from './base.repository';
import { Reuniao, ParticipanteReuniao, EncaminhamentoReuniao } from '@domain/entities/reuniao.entity';
export declare class ReuniaoRepository extends BaseRepository<Reuniao> implements IRuniaoRepository {
    findAll(): Promise<Reuniao[]>;
    findByEquipe(equipeId: string): Promise<Reuniao[]>;
    findByData(dataInicio: Date, dataFim: Date): Promise<Reuniao[]>;
    findByStatus(status: string): Promise<Reuniao[]>;
    findById(id: string): Promise<Reuniao | null>;
    create(data: Partial<Omit<Reuniao, 'id'>>): Promise<Reuniao>;
    update(id: string, data: Partial<Omit<Reuniao, 'id'>>): Promise<Reuniao>;
    delete(id: string): Promise<void>;
    adicionarParticipante(reuniaoId: string, usuarioId: string, cargo?: string): Promise<void>;
    removerParticipante(reuniaoId: string, usuarioId: string): Promise<void>;
    marcarPresenca(reuniaoId: string, usuarioId: string, presente: boolean): Promise<void>;
    listarParticipantes(reuniaoId: string): Promise<ParticipanteReuniao[]>;
    adicionarEncaminhamento(reuniaoId: string, encaminhamentoData: DadosEncaminhamento): Promise<EncaminhamentoReuniao>;
    listarEncaminhamentos(reuniaoId: string): Promise<EncaminhamentoReuniao[]>;
    atualizarResumo(reuniaoId: string, resumo: string): Promise<Reuniao>;
    atualizarStatus(reuniaoId: string, status: string): Promise<Reuniao>;
    private getReuniaoIncludes;
    private mapToReuniao;
}
