import { Status } from '@shared/enums';
import { Usuario } from './usuario.entity';
import { Estudante } from './estudante.entity';

/**
 * Tipos de papel de membro em uma equipe
 */
export enum PapelMembro {
  COORDENADOR = 'COORDENADOR',
  PROFESSOR = 'PROFESSOR',
  PSICOLOGO = 'PSICOLOGO',
  ASSISTENTE_SOCIAL = 'ASSISTENTE_SOCIAL',
  FONOAUDIOLOGO = 'FONOAUDIOLOGO',
  TERAPEUTA_OCUPACIONAL = 'TERAPEUTA_OCUPACIONAL',
  OUTRO = 'OUTRO',
}

/**
 * Interface para membros da equipe
 */
export interface MembroEquipeProps {
  id?: string;
  papelMembro: PapelMembro;
  usuarioId: string;
  usuario?: Usuario;
  criadoEm?: Date;
  atualizadoEm?: Date;
}

/**
 * Interface para relacionamento com estudantes
 */
export interface EstudanteEquipeProps {
  id?: string;
  estudanteId: string;
  estudante?: Estudante;
  criadoEm?: Date;
  atualizadoEm?: Date;
}

/**
 * Interface de propriedades da equipe
 */
export interface EquipeProps {
  id?: string;
  nome: string;
  descricao?: string;
  status?: Status;
  membros?: MembroEquipeProps[];
  estudantes?: EstudanteEquipeProps[];
  criadoEm?: Date;
  atualizadoEm?: Date;
}

/**
 * Classe que representa um membro da equipe
 */
export class MembroEquipe {
  readonly id: string;
  readonly papelMembro: PapelMembro;
  readonly usuarioId: string;
  readonly usuario?: Usuario;
  readonly criadoEm: Date;
  readonly atualizadoEm: Date;

  constructor(props: MembroEquipeProps) {
    this.id = props.id;
    this.papelMembro = props.papelMembro;
    this.usuarioId = props.usuarioId;
    this.usuario = props.usuario;
    this.criadoEm = props.criadoEm || new Date();
    this.atualizadoEm = props.atualizadoEm || new Date();

    this.validar();
  }

  private validar(): void {
    if (!Object.values(PapelMembro).includes(this.papelMembro)) {
      throw new Error('Papel de membro inválido');
    }

    if (!this.usuarioId) {
      throw new Error('ID do usuário é obrigatório');
    }
  }

  static criar(props: MembroEquipeProps): MembroEquipe {
    return new MembroEquipe(props);
  }

  /**
   * Verifica se o membro é coordenador da equipe
   */
  eCoordenador(): boolean {
    return this.papelMembro === PapelMembro.COORDENADOR;
  }

  /**
   * Verificar se o membro possui um papel específico
   */
  temPapel(papel: PapelMembro): boolean {
    return this.papelMembro === papel;
  }
}

/**
 * Classe que representa um relacionamento entre equipe e estudante
 */
export class EstudanteEquipe {
  readonly id: string;
  readonly estudanteId: string;
  readonly estudante?: Estudante;
  readonly criadoEm: Date;
  readonly atualizadoEm: Date;

  constructor(props: EstudanteEquipeProps) {
    this.id = props.id;
    this.estudanteId = props.estudanteId;
    this.estudante = props.estudante;
    this.criadoEm = props.criadoEm || new Date();
    this.atualizadoEm = props.atualizadoEm || new Date();

    this.validar();
  }

  private validar(): void {
    if (!this.estudanteId) {
      throw new Error('ID do estudante é obrigatório');
    }
  }

  static criar(props: EstudanteEquipeProps): EstudanteEquipe {
    return new EstudanteEquipe(props);
  }
}

/**
 * Entidade Equipe
 *
 * Representa uma equipe multidisciplinar que acompanha um conjunto de estudantes
 */
export class Equipe {
  readonly id: string;
  readonly nome: string;
  readonly descricao: string;
  readonly status: Status;
  readonly membros: MembroEquipe[];
  readonly estudantes: EstudanteEquipe[];
  readonly criadoEm: Date;
  readonly atualizadoEm: Date;

  private constructor(props: EquipeProps) {
    this.id = props.id;
    this.nome = props.nome;
    this.descricao = props.descricao || '';
    this.status = props.status || Status.ATIVO;
    this.membros = (props.membros || []).map((m) =>
      m instanceof MembroEquipe ? m : MembroEquipe.criar(m),
    );
    this.estudantes = (props.estudantes || []).map((e) =>
      e instanceof EstudanteEquipe ? e : EstudanteEquipe.criar(e),
    );
    this.criadoEm = props.criadoEm || new Date();
    this.atualizadoEm = props.atualizadoEm || new Date();

    this.validar();
  }

  /**
   * Validar dados da equipe
   */
  private validar(): void {
    if (!this.nome || this.nome.trim().length < 3) {
      throw new Error('Nome deve ter pelo menos 3 caracteres');
    }
  }

  /**
   * Criar uma nova equipe
   */
  static criar(props: EquipeProps): Equipe {
    return new Equipe(props);
  }

  /**
   * Restaurar uma equipe a partir de dados persistidos
   */
  static restaurar(dados: EquipeProps): Equipe {
    return new Equipe({
      ...dados,
    });
  }

  /**
   * Adicionar um membro à equipe
   */
  adicionarMembro(membro: MembroEquipeProps): Equipe {
    // Verificar se o usuário já é membro
    if (this.membros.some((m) => m.usuarioId === membro.usuarioId)) {
      throw new Error('Usuário já é membro desta equipe');
    }

    const novoMembro = new MembroEquipe(membro);

    return new Equipe({
      ...this,
      membros: [...this.membros, novoMembro],
      atualizadoEm: new Date(),
    });
  }

  /**
   * Remover um membro da equipe
   */
  removerMembro(usuarioId: string): Equipe {
    return new Equipe({
      ...this,
      membros: this.membros.filter((m) => m.usuarioId !== usuarioId),
      atualizadoEm: new Date(),
    });
  }

  /**
   * Adicionar um estudante à equipe
   */
  adicionarEstudante(estudante: EstudanteEquipeProps): Equipe {
    // Verificar se o estudante já está associado
    if (this.estudantes.some((e) => e.estudanteId === estudante.estudanteId)) {
      throw new Error('Estudante já está associado a esta equipe');
    }

    const novoEstudante = new EstudanteEquipe(estudante);

    return new Equipe({
      ...this,
      estudantes: [...this.estudantes, novoEstudante],
      atualizadoEm: new Date(),
    });
  }

  /**
   * Remover um estudante da equipe
   */
  removerEstudante(estudanteId: string): Equipe {
    return new Equipe({
      ...this,
      estudantes: this.estudantes.filter((e) => e.estudanteId !== estudanteId),
      atualizadoEm: new Date(),
    });
  }

  /**
   * Atualizar dados da equipe
   */
  atualizar(
    dados: Partial<Omit<EquipeProps, 'id' | 'criadoEm' | 'membros' | 'estudantes'>>,
  ): Equipe {
    return new Equipe({
      ...this,
      nome: dados.nome || this.nome,
      descricao: dados.descricao ?? this.descricao,
      status: dados.status || this.status,
      atualizadoEm: new Date(),
    });
  }

  /**
   * Inativar a equipe
   */
  inativar(): Equipe {
    return new Equipe({
      ...this,
      status: Status.CANCELADO,
      atualizadoEm: new Date(),
    });
  }

  /**
   * Verificar se a equipe está ativa
   */
  estaAtiva(): boolean {
    return this.status === Status.ATIVO;
  }

  /**
   * Obter os coordenadores da equipe
   */
  obterCoordenadores(): MembroEquipe[] {
    return this.membros.filter((m) => m.eCoordenador());
  }

  /**
   * Verificar se um usuário é membro da equipe
   */
  temMembro(usuarioId: string): boolean {
    return this.membros.some((m) => m.usuarioId === usuarioId);
  }

  /**
   * Verificar se um estudante está associado à equipe
   */
  temEstudante(estudanteId: string): boolean {
    return this.estudantes.some((e) => e.estudanteId === estudanteId);
  }

  /**
   * Obter quantidade de membros
   */
  quantidadeMembros(): number {
    return this.membros.length;
  }

  /**
   * Obter quantidade de estudantes
   */
  quantidadeEstudantes(): number {
    return this.estudantes.length;
  }
}
