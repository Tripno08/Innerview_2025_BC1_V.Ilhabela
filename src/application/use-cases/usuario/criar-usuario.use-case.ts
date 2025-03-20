import { IUsuarioRepository } from '@domain/repositories/usuario-repository.interface';
import { Usuario } from '@domain/entities/usuario.entity';
import { AppError } from '@shared/errors/app-error';
import { hash } from 'bcryptjs';
import { CargoUsuario } from '@shared/enums';

interface CriarUsuarioDTO {
  nome: string;
  email: string;
  senha: string;
  cargo?: CargoUsuario;
}

/**
 * Caso de uso para criar um novo usuário
 */
export class CriarUsuarioUseCase {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  /**
   * Executa o caso de uso
   */
  async execute(data: CriarUsuarioDTO): Promise<Usuario> {
    // Verificar se já existe usuário com o mesmo email
    const usuarioExistente = await this.usuarioRepository.findByEmail(data.email);

    if (usuarioExistente) {
      throw new AppError('Email já está em uso', 409, 'EMAIL_IN_USE');
    }

    // Criptografar senha
    const senhaCriptografada = await hash(data.senha, 10);

    // Criar usuário com senha criptografada
    const dadosUsuario = {
      nome: data.nome,
      email: data.email,
      senha: senhaCriptografada,
      cargo: data.cargo || CargoUsuario.PROFESSOR,
    };

    // Criar usuário com senha criptografada
    const usuario = await this.usuarioRepository.create(dadosUsuario);

    return usuario;
  }
}
