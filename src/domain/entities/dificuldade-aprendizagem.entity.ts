import { Status } from '../../shared/enums';

/**
 * Tipos de dificuldade de aprendizagem
 */
export enum TipoDificuldade {
  PRIMARIA = 'PRIMARIA',
  SECUNDARIA = 'SECUNDARIA',
  LEITURA = 'LEITURA',
  ESCRITA = 'ESCRITA',
  MATEMATICA = 'MATEMATICA',
  ATENCAO = 'ATENCAO',
  COMPORTAMENTAL = 'COMPORTAMENTAL',
  EMOCIONAL = 'EMOCIONAL',
  SOCIAL = 'SOCIAL',
  NEUROMOTORA = 'NEUROMOTORA',
  OUTRO = 'OUTRO',
}

/**
 * Categorias de dificuldade de aprendizagem
 */
export enum CategoriaDificuldade {
  LEVE = 'LEVE',
  MODERADA = 'MODERADA',
  GRAVE = 'GRAVE',
}

/**
 * Interface de propriedades da dificuldade de aprendizagem
 */
export interface DificuldadeAprendizagemProps {
  id?: string;
  nome: string;
  descricao: string;
  sintomas: string;
  tipo: TipoDificuldade;
  categoria: CategoriaDificuldade;
  status?: Status;
  criadoEm?: Date;
  atualizadoEm?: Date;
}

/**
 * Entidade DificuldadeAprendizagem
 *
 * Representa uma dificuldade de aprendizagem que pode ser associada a um estudante
 */
export class DificuldadeAprendizagem {
  readonly id: string;
  readonly nome: string;
  readonly descricao: string;
  readonly sintomas: string;
  readonly tipo: TipoDificuldade;
  readonly categoria: CategoriaDificuldade;
  readonly status: Status;
  readonly criadoEm: Date;
  readonly atualizadoEm: Date;

  private constructor(props: DificuldadeAprendizagemProps) {
    this.id = props.id;
    this.nome = props.nome;
    this.descricao = props.descricao;
    this.sintomas = props.sintomas;
    this.tipo = props.tipo;
    this.categoria = props.categoria;
    this.status = props.status || Status.ATIVO;
    this.criadoEm = props.criadoEm || new Date();
    this.atualizadoEm = props.atualizadoEm || new Date();

    this.validar();
  }

  /**
   * Validar os dados da dificuldade de aprendizagem
   */
  private validar(): void {
    if (!this.nome || this.nome.trim().length < 3) {
      throw new Error('Nome deve ter pelo menos 3 caracteres');
    }

    if (!this.descricao || this.descricao.trim().length < 10) {
      throw new Error('Descrição deve ter pelo menos 10 caracteres');
    }

    if (!this.sintomas) {
      throw new Error('Sintomas não podem estar vazios');
    }

    if (!Object.values(TipoDificuldade).includes(this.tipo)) {
      throw new Error('Tipo de dificuldade inválido');
    }

    if (!Object.values(CategoriaDificuldade).includes(this.categoria)) {
      throw new Error('Categoria de dificuldade inválida');
    }
  }

  /**
   * Criar uma nova dificuldade de aprendizagem
   */
  static criar(props: DificuldadeAprendizagemProps): DificuldadeAprendizagem {
    return new DificuldadeAprendizagem(props);
  }

  /**
   * Restaurar uma dificuldade de aprendizagem a partir de dados persistidos
   */
  static restaurar(dados: DificuldadeAprendizagemProps): DificuldadeAprendizagem {
    return new DificuldadeAprendizagem({
      ...dados,
    });
  }

  /**
   * Atualizar uma dificuldade de aprendizagem
   */
  atualizar(
    dados: Partial<Omit<DificuldadeAprendizagemProps, 'id' | 'criadoEm'>>,
  ): DificuldadeAprendizagem {
    return new DificuldadeAprendizagem({
      id: this.id,
      nome: dados.nome || this.nome,
      descricao: dados.descricao || this.descricao,
      sintomas: dados.sintomas || this.sintomas,
      tipo: dados.tipo || this.tipo,
      categoria: dados.categoria || this.categoria,
      status: dados.status || this.status,
      criadoEm: this.criadoEm,
      atualizadoEm: new Date(),
    });
  }

  /**
   * Inativar uma dificuldade de aprendizagem
   */
  inativar(): DificuldadeAprendizagem {
    return new DificuldadeAprendizagem({
      ...this,
      status: Status.CANCELADO,
      atualizadoEm: new Date(),
    });
  }

  /**
   * Verificar se a dificuldade está ativa
   */
  estaAtiva(): boolean {
    return this.status === Status.ATIVO;
  }

  /**
   * Verificar se a dificuldade é considerada grave
   */
  ehGrave(): boolean {
    return this.categoria === CategoriaDificuldade.GRAVE;
  }
}
