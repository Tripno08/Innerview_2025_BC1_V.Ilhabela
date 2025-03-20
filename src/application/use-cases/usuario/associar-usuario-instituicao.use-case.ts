import { IUsuarioRepository } from '@domain/repositories/usuario-repository.interface';
import { AppError } from '@shared/errors/app-error';
import { CargoUsuario } from '@shared/enums';

interface AssociarUsuarioInstituicaoDTO {
  usuarioId: string;
  instituicaoId: string;
  cargo?: CargoUsuario;
}

/**
 * Caso de uso para associar um usuário a uma instituição
 */
export class AssociarUsuarioInstituicaoUseCase {
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  /**
   * Executa o caso de uso
   */
  async execute(dados: AssociarUsuarioInstituicaoDTO): Promise<void> {
    // Verificar se o usuário existe
    const usuario = await this.usuarioRepository.findById(dados.usuarioId);
    if (!usuario) {
      throw new AppError('Usuário não encontrado', 404, 'USER_NOT_FOUND');
    }

    // Verificar se o usuário já está associado a esta instituição
    const jaAssociado = await this.usuarioRepository.verificarPertencimentoInstituicao(
      dados.usuarioId,
      dados.instituicaoId,
    );

    if (jaAssociado) {
      throw new AppError(
        'Usuário já está associado a esta instituição',
        409,
        'USER_ALREADY_ASSOCIATED',
      );
    }

    // Associar usuário à instituição
    await this.usuarioRepository.associarAInstituicao(
      dados.usuarioId,
      dados.instituicaoId,
      dados.cargo,
    );
  }
}
