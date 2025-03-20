import { IEstudanteRepository, AvaliacaoEstudante } from '@domain/repositories/estudante-repository.interface';
import { IDificuldadeRepository } from '@domain/repositories/dificuldade-repository.interface';
import { IIntervencaoRepository } from '@domain/repositories/intervencao-repository.interface';
import { Estudante } from '@domain/entities/estudante.entity';
import { DificuldadeAprendizagem } from '@domain/entities/dificuldade-aprendizagem.entity';
import { Intervencao, CatalogoIntervencao } from '@domain/entities/intervencao.entity';
export declare class EstudanteFacade {
    private readonly estudanteRepository;
    private readonly dificuldadeRepository;
    private readonly intervencaoRepository;
    private unitOfWork;
    constructor(estudanteRepository: IEstudanteRepository, dificuldadeRepository: IDificuldadeRepository, intervencaoRepository: IIntervencaoRepository);
    transferirEstudante(estudanteId: string, novaSerie: string, novoResponsavelId: string): Promise<Estudante>;
    criarPerfilCompleto(dadosEstudante: Partial<Estudante>, dificuldadeIds: string[], avaliacaoInicial: Partial<AvaliacaoEstudante> & {
        tipo: string;
        data: Date;
        avaliadorId: string;
    }): Promise<{
        estudante: Estudante;
        dificuldades: DificuldadeAprendizagem[];
        intervencoes: CatalogoIntervencao[];
    }>;
    obterPerfilCompleto(estudanteId: string): Promise<{
        estudante: Estudante;
        dificuldades: DificuldadeAprendizagem[];
        intervencoes: Intervencao[];
        historicoAvaliacoes: Record<string, unknown>[];
        progressoMedio: number;
    }>;
}
