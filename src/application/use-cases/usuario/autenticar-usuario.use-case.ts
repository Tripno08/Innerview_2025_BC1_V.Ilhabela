import { IUsuarioRepository } from '@domain/repositories/usuario-repository.interface';
import { AppError } from '@shared/errors/app-error';
import { IHashService, IJwtService } from '@application/interfaces/cryptography.interface';
import { Usuario } from '@domain/entities/usuario.entity';

interface AutenticarUsuarioDTO {
  email: string;
  senha: string;
}

interface AutenticarUsuarioResultado {
  usuario: Usuario;
  token: string;
}

/**
 * Caso de uso para autenticar um usuário e gerar um token JWT
 */
export class AutenticarUsuarioUseCase {
  constructor(
    private readonly usuarioRepository: IUsuarioRepository,
    private readonly hashService: IHashService,
    private readonly jwtService: IJwtService,
  ) {}

  /**
   * Executa o caso de uso
   */
  async execute(dados: AutenticarUsuarioDTO): Promise<AutenticarUsuarioResultado> {
    // Buscar usuário pelo email junto com suas credenciais
    const usuarioComCredenciais = await this.usuarioRepository.findWithCredentials(dados.email);

    if (!usuarioComCredenciais) {
      throw new AppError('Email ou senha inválidos', 401, 'INVALID_CREDENTIALS');
    }

    // Verificar se a senha está correta
    const senhaCorreta = await this.hashService.compare(dados.senha, usuarioComCredenciais.senha);

    if (!senhaCorreta) {
      throw new AppError('Email ou senha inválidos', 401, 'INVALID_CREDENTIALS');
    }

    // Criar objeto de usuário sem a senha
    const usuario = Usuario.restaurar({
      id: usuarioComCredenciais.id,
      email: usuarioComCredenciais.email,
      nome: usuarioComCredenciais.nome,
      cargo: usuarioComCredenciais.cargo,
      criadoEm: usuarioComCredenciais.criadoEm,
      atualizadoEm: usuarioComCredenciais.atualizadoEm,
    });

    // Gerar token JWT
    const token = this.jwtService.sign({
      sub: usuario.id,
      email: usuario.email,
      cargo: usuario.cargo,
    });

    return {
      usuario,
      token,
    };
  }
}
