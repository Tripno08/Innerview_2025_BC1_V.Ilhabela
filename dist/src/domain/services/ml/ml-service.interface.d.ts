import { Estudante } from '@domain/entities/estudante.entity';
import { Intervencao } from '@domain/entities/intervencao.entity';
import { DificuldadeAprendizagem } from '@domain/entities/dificuldade-aprendizagem.entity';
import { NivelRisco, TendenciaAnalise, FatorContribuinte, EstudanteSimilar, MetricaComparativa, IndicadorML, IndicadorNormativo, TendenciaTemporal, TipoModeloML, StatusModeloML, ConfiguracaoTreinamento } from '@shared/types/ml.types';
export interface PrevisaoRiscoAcademico {
    estudanteId: string;
    probabilidade: number;
    nivelRisco: NivelRisco;
    fatoresContribuintes: FatorContribuinte[];
    dataCriacao: Date;
}
export interface RecomendacaoIntervencao {
    intervencaoId: string;
    titulo: string;
    descricao: string;
    nivelCompatibilidade: number;
    baseadoEm: EstudanteSimilar[];
}
export interface AnaliseEficaciaIntervencao {
    intervencaoId: string;
    eficaciaGeral: number;
    metricas: MetricaComparativa[];
    tendencia: TendenciaAnalise;
    tempoParaResultado: number;
}
export interface PadraoIdentificado {
    nome: string;
    descricao: string;
    confianca: number;
    estudantesAfetados: string[];
    indicadores: IndicadorML[];
    possiveisCausas: string[];
    recomendacoes: string[];
}
export interface ComparacaoNormativa {
    estudanteId: string;
    metricas: IndicadorNormativo[];
    tendenciaTemporal: TendenciaTemporal[];
}
export interface ModeloML {
    id: string;
    nome: string;
    tipo: TipoModeloML;
    versao: string;
    dataAtualizacao: Date;
    metricas: Record<string, number>;
    status: StatusModeloML;
}
export type DadoTreinamentoValor = string | number | boolean | Date | Array<string | number | boolean | Date> | Record<string, string | number | boolean | Date>;
export type DadoTreinamentoMetadados = Record<string, string | number | boolean | Date>;
export interface DadoTreinamento {
    fonte: string;
    data: Date;
    tipo: string;
    valor: DadoTreinamentoValor;
    metadados: DadoTreinamentoMetadados;
}
export interface FiltrosDeteccaoPadroes {
    area?: string;
    estudanteId?: string;
    idade?: number | {
        min?: number;
        max?: number;
    };
    serie?: string | string[];
    dificuldades?: string[];
    [chave: string]: string | string[] | number | {
        min?: number;
        max?: number;
    } | undefined;
}
export interface IMLService {
    preverRiscoAcademico(estudante: Estudante, incluirFatores?: boolean): Promise<PrevisaoRiscoAcademico>;
    recomendarIntervencoes(estudante: Estudante, dificuldades?: DificuldadeAprendizagem[], limite?: number): Promise<RecomendacaoIntervencao[]>;
    analisarEficaciaIntervencao(intervencao: Intervencao, metricas?: string[]): Promise<AnaliseEficaciaIntervencao>;
    detectarPadroes(filtros?: FiltrosDeteccaoPadroes, limiteConfianca?: number): Promise<PadraoIdentificado[]>;
    compararComNormas(estudante: Estudante, indicadores: string[]): Promise<ComparacaoNormativa>;
    registrarDadosTreinamento(dados: DadoTreinamento[]): Promise<void>;
    listarModelos(tipo?: string): Promise<ModeloML[]>;
    treinarModelo(modeloId: string, configuracao?: ConfiguracaoTreinamento): Promise<ModeloML>;
}
