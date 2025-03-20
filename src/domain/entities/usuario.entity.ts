import { CargoUsuario } from '@shared/enums';

export interface UsuarioProps {
  id?: string;
  email: string;
  nome: string;
  cargo: CargoUsuario;
  criadoEm?: Date;
  atualizadoEm?: Date;
}

/**
 * Entidade de usuário
 *
 * Representa um usuário no domínio da aplicação, abstraindo
 * dados de autenticação para melhor separação de responsabilidades
 */
export class Usuario {
  readonly id: string;
  readonly email: string;
  readonly nome: string;
  readonly cargo: CargoUsuario;
  readonly criadoEm: Date;
  readonly atualizadoEm: Date;

  private constructor(props: UsuarioProps) {
    this.id = props.id;
    this.email = props.email;
    this.nome = props.nome;
    this.cargo = props.cargo;
    this.criadoEm = props.criadoEm || new Date();
    this.atualizadoEm = props.atualizadoEm || new Date();

    this.validar();
  }

  /**
   * Validar os dados do usuário
   */
  private validar(): void {
    if (!this.nome || this.nome.trim().length < 3) {
      throw new Error('Nome deve ter pelo menos 3 caracteres');
    }

    if (!this.email || !this.validarEmail(this.email)) {
      throw new Error('Email inválido');
    }

    // Verifica se o cargo é válido
    const cargoValues = Object.values(CargoUsuario);
    if (!cargoValues.includes(this.cargo)) {
      throw new Error('Cargo inválido');
    }
  }

  /**
   * Validar formato de email
   */
  private validarEmail(email: string): boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }

  /**
   * Criar uma nova instância de usuário
   */
  static criar(props: UsuarioProps): Usuario {
    return new Usuario(props);
  }

  /**
   * Restaurar uma instância de usuário a partir de dados persistidos
   */
  static restaurar(dados: UsuarioProps): Usuario {
    return new Usuario({
      ...dados,
    });
  }

  /**
   * Atualizar dados do usuário criando uma nova instância
   */
  atualizar(dados: Partial<Omit<UsuarioProps, 'id' | 'criadoEm'>>): Usuario {
    return new Usuario({
      id: this.id,
      email: dados.email || this.email,
      nome: dados.nome || this.nome,
      cargo: dados.cargo || this.cargo,
      criadoEm: this.criadoEm,
      atualizadoEm: new Date(),
    });
  }

  /**
   * Verificar se o usuário tem permissão para determinado recurso
   */
  temPermissao(cargosPermitidos: CargoUsuario[]): boolean {
    return cargosPermitidos.includes(this.cargo);
  }

  /**
   * Verificar se o usuário é administrador
   */
  ehAdministrador(): boolean {
    return this.cargo === CargoUsuario.ADMIN || this.cargo === CargoUsuario.ADMINISTRADOR;
  }

  /**
   * Verificar se o usuário pode gerenciar outros usuários
   */
  podeGerenciarUsuarios(): boolean {
    const adminCargos = [
      CargoUsuario.ADMINISTRADOR,
      CargoUsuario.DIRETOR,
      CargoUsuario.COORDENADOR,
      CargoUsuario.ADMIN,
    ];
    return adminCargos.includes(this.cargo);
  }
}
