import { IUsuarioRepository } from '@domain/repositories/usuario-repository.interface';
import { Usuario } from '@domain/entities/usuario.entity';
import { AppError } from '@shared/errors/app-error';
import { IHashService } from '@application/interfaces/cryptography.interface';
import { CargoUsuario } from '@shared/enums';

interface AtualizarPerfilDTO {
  usuarioId: string;
  nome?: string;
  email?: string;
  senhaAtual?: string;
  novaSenha?: string;
  cargo?: CargoUsuario;
}

interface AtualizarUsuarioDTO {
  nome?: string;
  email?: string;
  cargo?: CargoUsuario;
  senha?: string;
}

/**
 * Caso de uso para atualizar o perfil de um usuário
 */
export class AtualizarPerfilUseCase {
  constructor(
    private readonly usuarioRepository: IUsuarioRepository,
    private readonly hashService: IHashService,
  ) {}

  /**
   * Executa o caso de uso
   */
  async execute(dados: AtualizarPerfilDTO): Promise<Usuario> {
    // Buscar usuário pelo ID
    const usuario = await this.usuarioRepository.findById(dados.usuarioId);

    if (!usuario) {
      throw new AppError('Usuário não encontrado', 404, 'USER_NOT_FOUND');
    }

    // Preparar os dados para atualização
    const dadosAtualizacao: AtualizarUsuarioDTO = {};

    // Atualizar nome se fornecido
    if (dados.nome && dados.nome.trim() !== '') {
      dadosAtualizacao.nome = dados.nome;
    }

    // Atualizar email se fornecido
    if (dados.email && dados.email !== usuario.email) {
      // Validar formato do email
      if (!this.validarEmail(dados.email)) {
        throw new AppError('Email inválido', 400, 'INVALID_EMAIL');
      }

      // Verificar se o email já está em uso
      const emailExistente = await this.usuarioRepository.findByEmail(dados.email);
      if (emailExistente && emailExistente.id !== usuario.id) {
        throw new AppError('Email já está em uso', 409, 'EMAIL_IN_USE');
      }

      dadosAtualizacao.email = dados.email;
    }

    // Atualizar cargo se fornecido
    if (dados.cargo) {
      dadosAtualizacao.cargo = dados.cargo;
    }

    // Se forneceu nova senha e senha atual, atualizar a senha
    if (dados.novaSenha && dados.senhaAtual) {
      // Buscar usuário com credenciais para validar a senha atual
      const usuarioComCredenciais = await this.usuarioRepository.findWithCredentials(usuario.email);

      // Verificar se a senha atual está correta
      const senhaCorreta = await this.hashService.compare(
        dados.senhaAtual,
        usuarioComCredenciais.senha,
      );

      if (!senhaCorreta) {
        throw new AppError('Senha atual incorreta', 401, 'INCORRECT_PASSWORD');
      }

      // Validar força da nova senha
      if (!this.validarSenha(dados.novaSenha)) {
        throw new AppError(
          'Nova senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas e números',
          400,
          'INVALID_PASSWORD',
        );
      }

      // Criptografar a nova senha
      dadosAtualizacao.senha = await this.hashService.hash(dados.novaSenha);
    }

    // Verificar se há dados para atualizar
    if (Object.keys(dadosAtualizacao).length === 0) {
      return usuario;
    }

    // Atualizar os dados do usuário
    const usuarioAtualizado = await this.usuarioRepository.update(usuario.id, dadosAtualizacao);

    return usuarioAtualizado;
  }

  /**
   * Validar formato de email
   */
  private validarEmail(email: string): boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }

  /**
   * Validar formato e força da senha
   */
  private validarSenha(senha: string): boolean {
    if (senha.length < 8) return false;

    // Verificar se a senha contém pelo menos uma letra maiúscula, minúscula e um número
    const regexMaiuscula = /[A-Z]/;
    const regexMinuscula = /[a-z]/;
    const regexNumero = /[0-9]/;

    return regexMaiuscula.test(senha) && regexMinuscula.test(senha) && regexNumero.test(senha);
  }
}
