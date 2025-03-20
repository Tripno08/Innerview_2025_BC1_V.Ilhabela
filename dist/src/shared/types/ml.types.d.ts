export type NivelRisco = 'BAIXO' | 'MEDIO' | 'ALTO' | 'CRITICO';
export type TendenciaAnalise = 'POSITIVA' | 'NEUTRA' | 'NEGATIVA';
export type ClassificacaoNormativa = 'MUITO_ABAIXO' | 'ABAIXO' | 'MEDIO' | 'ACIMA' | 'MUITO_ACIMA';
export type TipoModeloML = 'CLASSIFICACAO' | 'REGRESSAO' | 'AGRUPAMENTO' | 'RECOMENDACAO';
export type StatusModeloML = 'TREINANDO' | 'ATIVO' | 'DESATIVADO' | 'ERRO';
export interface IndicadorML {
    nome: string;
    valor: number;
    relevancia?: number;
}
export interface FatorContribuinte {
    fator: string;
    peso: number;
}
export interface EstudanteSimilar {
    estudanteSimilarId: string;
    similaridade: number;
    resultadoObtido?: string;
}
export interface MetricaComparativa {
    nome: string;
    valorInicial: number;
    valorAtual: number;
    delta: number;
    significancia: number;
}
export interface IndicadorNormativo {
    nome: string;
    valorEstudante: number;
    mediaPopulacional: number;
    desvioPadrao: number;
    percentil: number;
    classificacao: ClassificacaoNormativa;
}
export interface TendenciaTemporal {
    periodo: string;
    valor: number;
    mediaPopulacional: number;
}
export interface ConfiguracaoTreinamento {
    hiperparametros?: Record<string, unknown>;
    conjuntoDados?: string;
    validacaoCruzada?: boolean;
    epocas?: number;
    taxaAprendizado?: number;
}
