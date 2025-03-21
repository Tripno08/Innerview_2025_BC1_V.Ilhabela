import { IEstudanteRepository, AvaliacaoEstudante } from '../../../domain/repositories/estudante-repository.interface';
import { Estudante, Avaliacao } from '../../../domain/entities/estudante.entity';
interface RegistrarAvaliacaoDTO {
    estudanteId: string;
    avaliadorId: string;
    data: Date;
    tipo: string;
    pontuacao: number;
    observacoes?: string;
    disciplina?: string;
    conteudo?: string;
}
interface RegistrarAvaliacaoResultado {
    estudante: Estudante;
    avaliacao: Avaliacao | AvaliacaoEstudante;
}
export declare class RegistrarAvaliacaoUseCase {
    private readonly estudanteRepository;
    constructor(estudanteRepository: IEstudanteRepository);
    execute(data: RegistrarAvaliacaoDTO): Promise<RegistrarAvaliacaoResultado>;
    private validarAvaliacao;
}
export {};
