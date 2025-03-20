import { Usuario } from '../entities/usuario.entity';
import { IBaseRepository } from './base-repository.interface';
import { CargoUsuario } from '@shared/enums';

/**
 * Interface para usuário com credenciais
 */
export interface UsuarioComCredenciais extends Usuario {
  senha?: string;
  salt?: string;
}

/**
 * Interface para associação de usuário com instituição
 */
export interface UsuarioInstituicao {
  id: string;
  usuarioId: string;
  instituicaoId: string;
  cargo: CargoUsuario;
  ativo: boolean;
  criadoEm: Date;
  atualizadoEm: Date;
  instituicao: {
    id: string;
    nome: string;
    tipo: string;
  };
}

/**
 * Interface para resultado de verificação de pertencimento
 */
export interface ResultadoPertencimento {
  pertence: boolean;
  cargo?: CargoUsuario;
}

/**
 * Interface para repositório de usuários
 *
 * Define as operações disponíveis para manipulação de dados de usuários
 */
export interface IUsuarioRepository extends IBaseRepository<Usuario> {
  /**
   * Encontrar um usuário por email
   */
  findByEmail(email: string): Promise<Usuario | null>;

  /**
   * Encontrar usuário com suas credenciais
   */
  findWithCredentials(email: string): Promise<UsuarioComCredenciais | null>;

  /**
   * Associar usuário a uma instituição
   */
  associarAInstituicao(
    usuarioId: string,
    instituicaoId: string,
    cargo?: CargoUsuario,
  ): Promise<void>;

  /**
   * Remover associação de usuário com instituição
   */
  removerDeInstituicao(usuarioId: string, instituicaoId: string): Promise<void>;

  /**
   * Listar instituições associadas ao usuário
   */
  listarInstituicoesDoUsuario(usuarioId: string): Promise<UsuarioInstituicao[]>;

  /**
   * Verificar se usuário pertence a uma instituição
   * @returns Objeto com informação se pertence e qual cargo, se aplicável
   */
  verificarPertencimentoInstituicao(
    usuarioId: string,
    instituicaoId: string,
  ): Promise<ResultadoPertencimento>;
}
