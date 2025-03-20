/**
 * Tipos de dados para o serviço de Machine Learning
 */

export type NivelRisco = 'BAIXO' | 'MEDIO' | 'ALTO' | 'CRITICO';

export type TendenciaAnalise = 'POSITIVA' | 'NEUTRA' | 'NEGATIVA';

export type ClassificacaoNormativa = 'MUITO_ABAIXO' | 'ABAIXO' | 'MEDIO' | 'ACIMA' | 'MUITO_ACIMA';

export type TipoModeloML = 'CLASSIFICACAO' | 'REGRESSAO' | 'AGRUPAMENTO' | 'RECOMENDACAO';

export type StatusModeloML = 'TREINANDO' | 'ATIVO' | 'DESATIVADO' | 'ERRO';

export interface IndicadorML {
  nome: string;
  valor: number;
  relevancia?: number; // 0-1
}

export interface FatorContribuinte {
  fator: string;
  peso: number; // 0-1
}

export interface EstudanteSimilar {
  estudanteSimilarId: string;
  similaridade: number; // 0-1
  resultadoObtido?: string;
}

export interface MetricaComparativa {
  nome: string;
  valorInicial: number;
  valorAtual: number;
  delta: number;
  significancia: number; // 0-1, relevância estatística
}

export interface IndicadorNormativo {
  nome: string;
  valorEstudante: number;
  mediaPopulacional: number;
  desvioPadrao: number;
  percentil: number; // 0-100
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
