import { Status } from '../../shared/enums';
import { DificuldadeAprendizagem } from './dificuldade-aprendizagem.entity';

/**
 * Interface de propriedades da avaliação
 */
export interface AvaliacaoProps {
  id?: string;
  data: Date;
  tipo: string;
  pontuacao: number;
  observacoes?: string;
  criadoEm?: Date;
  atualizadoEm?: Date;
}

/**
 * Interface de propriedades do estudante
 */
export interface EstudanteProps {
  id?: string;
  nome: string;
  serie: string;
  dataNascimento: Date;
  status?: Status;
  usuarioId: string; // ID do professor ou responsável
  dificuldades?: DificuldadeAprendizagem[];
  avaliacoes?: AvaliacaoProps[];
  criadoEm?: Date;
  atualizadoEm?: Date;
}

/**
 * Classe que representa uma avaliação de um estudante
 */
export class Avaliacao {
  readonly id: string;
  readonly data: Date;
  readonly tipo: string;
  readonly pontuacao: number;
  readonly observacoes?: string;
  readonly criadoEm: Date;
  readonly atualizadoEm: Date;

  constructor(props: AvaliacaoProps) {
    this.id = props.id;
    this.data = props.data;
    this.tipo = props.tipo;
    this.pontuacao = props.pontuacao;
    this.observacoes = props.observacoes;
    this.criadoEm = props.criadoEm || new Date();
    this.atualizadoEm = props.atualizadoEm || new Date();

    this.validar();
  }

  private validar(): void {
    if (!this.tipo || this.tipo.trim().length < 2) {
      throw new Error('Tipo de avaliação inválido');
    }

    if (this.pontuacao < 0 || this.pontuacao > 10) {
      throw new Error('Pontuação deve estar entre 0 e 10');
    }

    if (this.data > new Date()) {
      throw new Error('Data da avaliação não pode ser futura');
    }
  }

  static criar(props: AvaliacaoProps): Avaliacao {
    return new Avaliacao(props);
  }
}

/**
 * Entidade Estudante
 */
export class Estudante {
  readonly id: string;
  readonly nome: string;
  readonly serie: string;
  readonly dataNascimento: Date;
  readonly status: Status;
  readonly usuarioId: string;
  readonly dificuldades: DificuldadeAprendizagem[];
  readonly avaliacoes: Avaliacao[];
  readonly criadoEm: Date;
  readonly atualizadoEm: Date;

  private constructor(props: EstudanteProps) {
    this.id = props.id;
    this.nome = props.nome;
    this.serie = props.serie;
    this.dataNascimento = props.dataNascimento;
    this.status = props.status || Status.ATIVO;
    this.usuarioId = props.usuarioId;
    this.dificuldades = props.dificuldades || [];
    this.avaliacoes = (props.avaliacoes || []).map((av) =>
      av instanceof Avaliacao ? av : new Avaliacao(av),
    );
    this.criadoEm = props.criadoEm || new Date();
    this.atualizadoEm = props.atualizadoEm || new Date();

    this.validar();
  }

  /**
   * Validar dados do estudante
   */
  private validar(): void {
    if (!this.nome || this.nome.trim().length < 3) {
      throw new Error('Nome deve ter pelo menos 3 caracteres');
    }

    if (!this.serie || this.serie.trim().length < 1) {
      throw new Error('Série é obrigatória');
    }

    // Verificar se a data de nascimento é válida (não futura e não muito antiga)
    const hoje = new Date();
    const idadeMinima = new Date();
    idadeMinima.setFullYear(hoje.getFullYear() - 100); // Máximo 100 anos

    if (this.dataNascimento > hoje) {
      throw new Error('Data de nascimento não pode ser futura');
    }

    if (this.dataNascimento < idadeMinima) {
      throw new Error('Data de nascimento muito antiga');
    }
  }

  /**
   * Criar um novo estudante
   */
  static criar(props: EstudanteProps): Estudante {
    return new Estudante(props);
  }

  /**
   * Restaurar um estudante a partir de dados persistidos
   */
  static restaurar(dados: EstudanteProps): Estudante {
    return new Estudante({
      ...dados,
    });
  }

  /**
   * Adicionar uma dificuldade de aprendizagem ao estudante
   */
  adicionarDificuldade(dificuldade: DificuldadeAprendizagem): Estudante {
    // Verificar se a dificuldade já existe
    if (this.dificuldades.some((d) => d.id === dificuldade.id)) {
      return this;
    }

    return new Estudante({
      ...this,
      dificuldades: [...this.dificuldades, dificuldade],
      atualizadoEm: new Date(),
    });
  }

  /**
   * Remover uma dificuldade de aprendizagem do estudante
   */
  removerDificuldade(dificuldadeId: string): Estudante {
    return new Estudante({
      ...this,
      dificuldades: this.dificuldades.filter((d) => d.id !== dificuldadeId),
      atualizadoEm: new Date(),
    });
  }

  /**
   * Adicionar uma avaliação ao estudante
   */
  adicionarAvaliacao(avaliacao: AvaliacaoProps): Estudante {
    const novaAvaliacao = new Avaliacao(avaliacao);

    return new Estudante({
      ...this,
      avaliacoes: [...this.avaliacoes, novaAvaliacao],
      atualizadoEm: new Date(),
    });
  }

  /**
   * Atualizar dados do estudante
   */
  atualizar(
    dados: Partial<Omit<EstudanteProps, 'id' | 'criadoEm' | 'dificuldades' | 'avaliacoes'>>,
  ): Estudante {
    return new Estudante({
      ...this,
      nome: dados.nome || this.nome,
      serie: dados.serie || this.serie,
      dataNascimento: dados.dataNascimento || this.dataNascimento,
      status: dados.status || this.status,
      usuarioId: dados.usuarioId || this.usuarioId,
      atualizadoEm: new Date(),
    });
  }

  /**
   * Verificar se o estudante possui alguma dificuldade grave
   */
  possuiDificuldadeGrave(): boolean {
    return this.dificuldades.some((d) => d.ehGrave());
  }

  /**
   * Calcular a média das avaliações do estudante
   */
  calcularMediaAvaliacoes(): number {
    if (this.avaliacoes.length === 0) {
      return 0;
    }

    const soma = this.avaliacoes.reduce((acc, av) => acc + av.pontuacao, 0);
    return soma / this.avaliacoes.length;
  }

  /**
   * Inativar um estudante
   */
  inativar(): Estudante {
    return new Estudante({
      ...this,
      status: Status.CANCELADO,
      atualizadoEm: new Date(),
    });
  }

  /**
   * Verificar se o estudante está ativo
   */
  estaAtivo(): boolean {
    return this.status === Status.ATIVO;
  }

  /**
   * Calcular a idade do estudante
   */
  calcularIdade(): number {
    const hoje = new Date();
    let idade = hoje.getFullYear() - this.dataNascimento.getFullYear();

    // Ajustar a idade se ainda não fez aniversário este ano
    const mesAtual = hoje.getMonth();
    const diaAtual = hoje.getDate();
    const mesNascimento = this.dataNascimento.getMonth();
    const diaNascimento = this.dataNascimento.getDate();

    if (mesAtual < mesNascimento || (mesAtual === mesNascimento && diaAtual < diaNascimento)) {
      idade--;
    }

    return idade;
  }
}
