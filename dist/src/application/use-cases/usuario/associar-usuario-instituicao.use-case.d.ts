import { IUsuarioRepository } from '@domain/repositories/usuario-repository.interface';
import { CargoUsuario } from '@shared/enums';
interface AssociarUsuarioInstituicaoDTO {
    usuarioId: string;
    instituicaoId: string;
    cargo?: CargoUsuario;
}
export declare class AssociarUsuarioInstituicaoUseCase {
    private readonly usuarioRepository;
    constructor(usuarioRepository: IUsuarioRepository);
    execute(dados: AssociarUsuarioInstituicaoDTO): Promise<void>;
}
export {};
