import { Estudante } from '@domain/entities/estudante.entity';
import { Intervencao } from '@domain/entities/intervencao.entity';
import { DificuldadeAprendizagem } from '@domain/entities/dificuldade-aprendizagem.entity';
import {
  NivelRisco,
  TendenciaAnalise,
  FatorContribuinte,
  EstudanteSimilar,
  MetricaComparativa,
  IndicadorML,
  IndicadorNormativo,
  TendenciaTemporal,
  TipoModeloML,
  StatusModeloML,
  ConfiguracaoTreinamento,
} from '@shared/types/ml.types';

export interface PrevisaoRiscoAcademico {
  estudanteId: string;
  probabilidade: number; // 0-100%
  nivelRisco: NivelRisco;
  fatoresContribuintes: FatorContribuinte[];
  dataCriacao: Date;
}

export interface RecomendacaoIntervencao {
  intervencaoId: string;
  titulo: string;
  descricao: string;
  nivelCompatibilidade: number; // 0-100%
  baseadoEm: EstudanteSimilar[];
}

export interface AnaliseEficaciaIntervencao {
  intervencaoId: string;
  eficaciaGeral: number; // 0-100%
  metricas: MetricaComparativa[];
  tendencia: TendenciaAnalise;
  tempoParaResultado: number; // em dias
}

export interface PadraoIdentificado {
  nome: string;
  descricao: string;
  confianca: number; // 0-100%
  estudantesAfetados: string[]; // IDs dos estudantes
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

/**
 * Representa um valor de dado de treinamento que pode ser de diferentes tipos
 */
export type DadoTreinamentoValor =
  | string
  | number
  | boolean
  | Date
  | Array<string | number | boolean | Date>
  | Record<string, string | number | boolean | Date>;

/**
 * Interface para metadados de treinamento
 */
export type DadoTreinamentoMetadados = Record<string, string | number | boolean | Date>;

export interface DadoTreinamento {
  fonte: string;
  data: Date;
  tipo: string;
  valor: DadoTreinamentoValor;
  metadados: DadoTreinamentoMetadados;
}

/**
 * Filtros para detecção de padrões
 */
export interface FiltrosDeteccaoPadroes {
  area?: string;
  estudanteId?: string;
  idade?: number | { min?: number; max?: number };
  serie?: string | string[];
  dificuldades?: string[];
  [chave: string]: string | string[] | number | { min?: number; max?: number } | undefined;
}

export interface IMLService {
  /**
   * Prediz o risco acadêmico de um estudante
   * @param estudante Estudante a ser analisado
   * @param incluirFatores Se deve incluir fatores detalhados que contribuem para o risco
   */
  preverRiscoAcademico(
    estudante: Estudante,
    incluirFatores?: boolean,
  ): Promise<PrevisaoRiscoAcademico>;

  /**
   * Recomenda intervenções para um estudante com base em casos similares
   * @param estudante Estudante para receber recomendações
   * @param dificuldades Lista de dificuldades do estudante (opcional)
   * @param limite Número máximo de recomendações a retornar
   */
  recomendarIntervencoes(
    estudante: Estudante,
    dificuldades?: DificuldadeAprendizagem[],
    limite?: number,
  ): Promise<RecomendacaoIntervencao[]>;

  /**
   * Analisa a eficácia de uma intervenção
   * @param intervencao Intervenção a ser analisada
   * @param metricas Métricas específicas a serem analisadas (opcional)
   */
  analisarEficaciaIntervencao(
    intervencao: Intervencao,
    metricas?: string[],
  ): Promise<AnaliseEficaciaIntervencao>;

  /**
   * Detecta padrões em dificuldades de aprendizagem entre estudantes
   * @param filtros Filtros para selecionar subconjunto de estudantes
   * @param limiteConfianca Limite mínimo de confiança para retornar padrões
   */
  detectarPadroes(
    filtros?: FiltrosDeteccaoPadroes,
    limiteConfianca?: number,
  ): Promise<PadraoIdentificado[]>;

  /**
   * Compara indicadores de um estudante com normas populacionais
   * @param estudante Estudante a ser comparado
   * @param indicadores Lista de indicadores a serem comparados
   */
  compararComNormas(estudante: Estudante, indicadores: string[]): Promise<ComparacaoNormativa>;

  /**
   * Registra novos dados para treinamento contínuo dos modelos
   * @param dados Dados de treinamento a serem registrados
   */
  registrarDadosTreinamento(dados: DadoTreinamento[]): Promise<void>;

  /**
   * Obtém informações sobre os modelos de ML disponíveis
   * @param tipo Filtrar por tipo específico de modelo
   */
  listarModelos(tipo?: string): Promise<ModeloML[]>;

  /**
   * Treina ou atualiza um modelo específico
   * @param modeloId ID do modelo a ser treinado/atualizado
   * @param configuracao Configurações para o treinamento
   */
  treinarModelo(modeloId: string, configuracao?: ConfiguracaoTreinamento): Promise<ModeloML>;
}
