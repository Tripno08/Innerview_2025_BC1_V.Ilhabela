import { IMLService, PrevisaoRiscoAcademico, RecomendacaoIntervencao, AnaliseEficaciaIntervencao, PadraoIdentificado, ComparacaoNormativa, ModeloML, DadoTreinamento } from '@domain/services/ml/ml-service.interface';
import { Estudante } from '@domain/entities/estudante.entity';
import { Intervencao } from '@domain/entities/intervencao.entity';
import { DificuldadeAprendizagem } from '@domain/entities/dificuldade-aprendizagem.entity';
import { IEstudanteRepository } from '@domain/repositories/estudante-repository.interface';
import { IIntervencaoRepository } from '@domain/repositories/intervencao-repository.interface';
import { ConfiguracaoTreinamento } from '@shared/types/ml.types';
export declare class MLServiceBasic implements IMLService {
    private estudanteRepository;
    private intervencaoRepository;
    private dadosTreinamento;
    private modelos;
    constructor(estudanteRepository: IEstudanteRepository, intervencaoRepository: IIntervencaoRepository);
    preverRiscoAcademico(estudante: Estudante, incluirFatores?: boolean): Promise<PrevisaoRiscoAcademico>;
    recomendarIntervencoes(estudante: Estudante, dificuldades?: DificuldadeAprendizagem[], limite?: number): Promise<RecomendacaoIntervencao[]>;
    analisarEficaciaIntervencao(intervencao: Intervencao, metricas?: string[]): Promise<AnaliseEficaciaIntervencao>;
    detectarPadroes(filtros?: {
        area?: string;
        estudanteId?: string;
        [key: string]: unknown;
    }, limiteConfianca?: number): Promise<PadraoIdentificado[]>;
    compararComNormas(estudante: Estudante, indicadores: string[]): Promise<ComparacaoNormativa>;
    registrarDadosTreinamento(dados: DadoTreinamento[]): Promise<void>;
    listarModelos(tipo?: string): Promise<ModeloML[]>;
    treinarModelo(modeloId: string, _configuracao?: ConfiguracaoTreinamento): Promise<ModeloML>;
    private analisarFatoresRisco;
    private calcularIdade;
    private calcularCompatibilidade;
    private encontrarEstudantesSimilares;
    private simularValorEstudante;
    private simularMediaPopulacional;
    private zScoreParaPercentil;
    treinarModeloPersonalizado(_configuracao: ConfiguracaoTreinamento): Promise<ModeloML>;
}
