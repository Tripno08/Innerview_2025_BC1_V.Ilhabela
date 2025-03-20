import { Usuario } from '@domain/entities/usuario.entity';
import { IUsuarioRepository } from '@domain/repositories/usuario-repository.interface';
import { IHashService } from '@application/interfaces/cryptography.interface';
import { AppError } from '@shared/errors/app-error';
import { CargoUsuario } from '@shared/enums';

interface RegistrarUsuarioDTO {
  nome: string;
  email: string;
  senha: string;
  cargo?: CargoUsuario;
}

interface CriarUsuarioDTO extends Partial<Omit<Usuario, 'id'>> {
  senha: string;
}

interface RegistrarUsuarioResultado {
  usuario: Usuario;
}

/**
 * Caso de uso para registrar um novo usuário
 */
export class RegistrarUsuarioUseCase {
  constructor(
    private readonly usuarioRepository: IUsuarioRepository,
    private readonly hashService: IHashService,
  ) {}

  /**
   * Executa o caso de uso
   */
  async execute(dados: RegistrarUsuarioDTO): Promise<RegistrarUsuarioResultado> {
    // Verificar se já existe usuário com o mesmo email
    const usuarioExistente = await this.usuarioRepository.findByEmail(dados.email);

    if (usuarioExistente) {
      throw new AppError('Email já está em uso', 409, 'EMAIL_IN_USE');
    }

    // Validar formato de email
    if (!this.validarEmail(dados.email)) {
      throw new AppError('Email inválido', 400, 'INVALID_EMAIL');
    }

    // Validar senha
    if (!this.validarSenha(dados.senha)) {
      throw new AppError(
        'Senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas e números',
        400,
        'INVALID_PASSWORD',
      );
    }

    // Criptografar senha
    const senhaCriptografada = await this.hashService.hash(dados.senha);

    // Criar usuário com senha criptografada
    const dadosCriacao: CriarUsuarioDTO = {
      nome: dados.nome,
      email: dados.email,
      senha: senhaCriptografada,
      cargo: dados.cargo || CargoUsuario.PROFESSOR,
    };

    const usuario = await this.usuarioRepository.create(dadosCriacao);

    return { usuario };
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
