import { IUsuarioRepository } from '@domain/repositories/usuario-repository.interface';
import { AppError } from '@shared/errors/app-error';
import { CargoUsuario } from '@shared/enums';
import { injectable, inject } from 'tsyringe';

interface VerificarPermissaoDTO {
  usuarioId: string;
  instituicaoId?: string;
  cargosPermitidos: CargoUsuario[];
}

/**
 * Caso de uso para verificar se um usuário tem permissão para realizar uma ação
 * baseado em seu cargo e associação com instituição
 */
@injectable()
export class VerificarPermissaoUseCase {
  constructor(
    @inject('UsuarioRepository')
    private usuarioRepository: IUsuarioRepository,
  ) {}

  /**
   * Executa o caso de uso
   */
  async execute({
    usuarioId,
    instituicaoId,
    cargosPermitidos,
  }: VerificarPermissaoDTO): Promise<boolean> {
    const usuario = await this.usuarioRepository.findById(usuarioId);

    if (!usuario) {
      throw new AppError('Usuário não encontrado', 404);
    }

    // Se o usuário for administrador, tem permissão para tudo
    if (usuario.ehAdministrador()) {
      return true;
    }

    // Se não houver instituição, verifica apenas pelo cargo global do usuário
    if (!instituicaoId) {
      return usuario.temPermissao(cargosPermitidos);
    }

    // Verifica se o usuário pertence à instituição
    const pertencimento = await this.usuarioRepository.verificarPertencimentoInstituicao(
      usuarioId,
      instituicaoId,
    );

    if (!pertencimento.pertence) {
      throw new AppError('Usuário não pertence à instituição', 403);
    }

    // Se pertence, verifica se o cargo na instituição tem permissão
    const cargoNaInstituicao = pertencimento.cargo;

    // Se não houver cargo específico na instituição, usa o cargo global
    if (!cargoNaInstituicao) {
      return usuario.temPermissao(cargosPermitidos);
    }

    // Verifica se o cargo na instituição está entre os permitidos
    return cargosPermitidos.includes(cargoNaInstituicao);
  }
}
