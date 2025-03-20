import { Status } from '@shared/enums';

/**
 * Tipos de intervenção
 */
export enum TipoIntervencao {
  PEDAGOGICA = 'PEDAGOGICA',
  COMPORTAMENTAL = 'COMPORTAMENTAL',
  PSICOLOGICA = 'PSICOLOGICA',
  SOCIAL = 'SOCIAL',
  MULTIDISCIPLINAR = 'MULTIDISCIPLINAR',
  OUTRA = 'OUTRA',
}

/**
 * Interface de propriedades básicas de intervenção (comuns a base e instância)
 */
export interface IntervencaoProps {
  id?: string;
  titulo: string;
  descricao: string;
  tipo: TipoIntervencao;
  status?: Status;
  criadoEm?: Date;
  atualizadoEm?: Date;
}

/**
 * Interface de propriedades específicas da base de intervenção (catálogo)
 */
export interface IntervencaoBaseProps extends IntervencaoProps {
  duracao?: number; // Duração sugerida em dias
  dificuldadesAlvo?: string[]; // Tipos de dificuldades que esta intervenção aborda
  publico?: string[]; // Público alvo recomendado
  recursos?: string[]; // Recursos necessários
}

/**
 * Interface de propriedades específicas da instância de intervenção
 */
export interface IntervencaoInstanciaProps extends IntervencaoProps {
  dataInicio: Date;
  dataFim?: Date;
  estudanteId: string;
  intervencaoBaseId?: string; // Opcional, se for baseada numa intervenção do catálogo
  observacoes?: string;
  progresso?: number; // De 0 a 100%
}

/**
 * Classe base para Intervenções
 */
export abstract class IntervencaoBase {
  readonly id: string;
  readonly titulo: string;
  readonly descricao: string;
  readonly tipo: TipoIntervencao;
  readonly status: Status;
  readonly criadoEm: Date;
  readonly atualizadoEm: Date;

  constructor(props: IntervencaoProps) {
    this.id = props.id;
    this.titulo = props.titulo;
    this.descricao = props.descricao;
    this.tipo = props.tipo;
    this.status = props.status || Status.ATIVO;
    this.criadoEm = props.criadoEm || new Date();
    this.atualizadoEm = props.atualizadoEm || new Date();

    this.validarBase();
  }

  /**
   * Validação básica comum a todas intervenções
   */
  protected validarBase(): void {
    if (!this.titulo || this.titulo.trim().length < 3) {
      throw new Error('Título deve ter pelo menos 3 caracteres');
    }

    if (!this.descricao || this.descricao.trim().length < 10) {
      throw new Error('Descrição deve ter pelo menos 10 caracteres');
    }

    if (!Object.values(TipoIntervencao).includes(this.tipo)) {
      throw new Error('Tipo de intervenção inválido');
    }
  }

  /**
   * Verificar se a intervenção está ativa
   */
  estaAtiva(): boolean {
    return this.status === Status.ATIVO;
  }
}

/**
 * Intervenção de catálogo
 *
 * Representa um modelo de intervenção que pode ser aplicado a múltiplos estudantes
 */
export class CatalogoIntervencao extends IntervencaoBase {
  readonly duracao?: number;
  readonly dificuldadesAlvo: string[];
  readonly publico: string[];
  readonly recursos: string[];

  constructor(props: IntervencaoBaseProps) {
    super(props);
    this.duracao = props.duracao;
    this.dificuldadesAlvo = props.dificuldadesAlvo || [];
    this.publico = props.publico || [];
    this.recursos = props.recursos || [];

    this.validar();
  }

  private validar(): void {
    if (this.duracao !== undefined && this.duracao <= 0) {
      throw new Error('Duração deve ser um número positivo');
    }
  }

  /**
   * Criar uma nova intervenção de catálogo
   */
  static criar(props: IntervencaoBaseProps): CatalogoIntervencao {
    return new CatalogoIntervencao(props);
  }

  /**
   * Restaurar uma intervenção de catálogo a partir de dados persistidos
   */
  static restaurar(dados: IntervencaoBaseProps): CatalogoIntervencao {
    return new CatalogoIntervencao({
      ...dados,
    });
  }

  /**
   * Atualizar uma intervenção de catálogo
   */
  atualizar(dados: Partial<Omit<IntervencaoBaseProps, 'id' | 'criadoEm'>>): CatalogoIntervencao {
    return new CatalogoIntervencao({
      id: this.id,
      titulo: dados.titulo || this.titulo,
      descricao: dados.descricao || this.descricao,
      tipo: dados.tipo || this.tipo,
      status: dados.status || this.status,
      duracao: dados.duracao ?? this.duracao,
      dificuldadesAlvo: dados.dificuldadesAlvo || this.dificuldadesAlvo,
      publico: dados.publico || this.publico,
      recursos: dados.recursos || this.recursos,
      criadoEm: this.criadoEm,
      atualizadoEm: new Date(),
    });
  }

  /**
   * Criar uma instância de intervenção a partir do catálogo
   */
  criarInstancia(estudanteId: string, dataInicio: Date, dataFim?: Date): Intervencao {
    return Intervencao.criar({
      titulo: this.titulo,
      descricao: this.descricao,
      tipo: this.tipo,
      dataInicio,
      dataFim,
      estudanteId,
      intervencaoBaseId: this.id,
      observacoes: `Intervenção baseada no modelo: ${this.titulo}`,
    });
  }

  /**
   * Inativar uma intervenção base
   */
  inativar(): CatalogoIntervencao {
    return new CatalogoIntervencao({
      ...this,
      status: Status.CANCELADO,
      atualizadoEm: new Date(),
    });
  }
}

/**
 * Instância de Intervenção
 *
 * Representa uma intervenção aplicada a um estudante específico
 */
export class Intervencao extends IntervencaoBase {
  readonly dataInicio: Date;
  readonly dataFim?: Date;
  readonly estudanteId: string;
  readonly intervencaoBaseId?: string;
  readonly observacoes?: string;
  readonly progresso: number;

  constructor(props: IntervencaoInstanciaProps) {
    super(props);
    this.dataInicio = props.dataInicio;
    this.dataFim = props.dataFim;
    this.estudanteId = props.estudanteId;
    this.intervencaoBaseId = props.intervencaoBaseId;
    this.observacoes = props.observacoes;
    this.progresso = props.progresso || 0;

    this.validar();
  }

  private validar(): void {
    if (this.dataInicio > new Date()) {
      throw new Error('Data de início não pode ser futura');
    }

    if (this.dataFim && this.dataFim < this.dataInicio) {
      throw new Error('Data de fim não pode ser anterior à data de início');
    }

    if (this.progresso < 0 || this.progresso > 100) {
      throw new Error('Progresso deve estar entre 0 e 100%');
    }
  }

  /**
   * Criar uma nova instância de intervenção
   */
  static criar(props: IntervencaoInstanciaProps): Intervencao {
    return new Intervencao(props);
  }

  /**
   * Restaurar uma instância de intervenção a partir de dados persistidos
   */
  static restaurar(dados: IntervencaoInstanciaProps): Intervencao {
    return new Intervencao({
      ...dados,
    });
  }

  /**
   * Atualizar uma instância de intervenção
   */
  atualizar(
    dados: Partial<Omit<IntervencaoInstanciaProps, 'id' | 'criadoEm' | 'estudanteId'>>,
  ): Intervencao {
    return new Intervencao({
      id: this.id,
      titulo: dados.titulo || this.titulo,
      descricao: dados.descricao || this.descricao,
      tipo: dados.tipo || this.tipo,
      status: dados.status || this.status,
      dataInicio: dados.dataInicio || this.dataInicio,
      dataFim: dados.dataFim ?? this.dataFim,
      estudanteId: this.estudanteId,
      intervencaoBaseId: dados.intervencaoBaseId ?? this.intervencaoBaseId,
      observacoes: dados.observacoes ?? this.observacoes,
      progresso: dados.progresso ?? this.progresso,
      criadoEm: this.criadoEm,
      atualizadoEm: new Date(),
    });
  }

  /**
   * Atualizar o progresso da intervenção
   */
  atualizarProgresso(novoProgresso: number): Intervencao {
    if (novoProgresso < 0 || novoProgresso > 100) {
      throw new Error('Progresso deve estar entre 0 e 100%');
    }

    return this.atualizar({ progresso: novoProgresso });
  }

  /**
   * Concluir a intervenção
   */
  concluir(): Intervencao {
    return new Intervencao({
      ...this,
      dataFim: this.dataFim || new Date(),
      status: Status.CONCLUIDO,
      progresso: 100,
      atualizadoEm: new Date(),
    });
  }

  /**
   * Cancelar a intervenção
   */
  cancelar(): Intervencao {
    return new Intervencao({
      ...this,
      dataFim: this.dataFim || new Date(),
      status: Status.CANCELADO,
      atualizadoEm: new Date(),
    });
  }

  /**
   * Verificar se a intervenção está concluída
   */
  estaConcluida(): boolean {
    return this.status === Status.CONCLUIDO;
  }

  /**
   * Verificar se a intervenção está em andamento
   */
  estaEmAndamento(): boolean {
    return this.status === Status.ATIVO && !this.dataFim;
  }

  /**
   * Calcular a duração da intervenção em dias
   */
  calcularDuracao(): number {
    const fim = this.dataFim || new Date();
    const inicio = this.dataInicio;

    const diferencaMs = fim.getTime() - inicio.getTime();
    const dias = Math.ceil(diferencaMs / (1000 * 60 * 60 * 24));

    return dias;
  }
}
