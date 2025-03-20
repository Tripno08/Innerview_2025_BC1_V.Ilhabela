import { IUsuarioRepository } from '@domain/repositories/usuario-repository.interface';
import { CargoUsuario } from '@shared/enums';
interface VerificarPermissaoDTO {
    usuarioId: string;
    instituicaoId?: string;
    cargosPermitidos: CargoUsuario[];
}
export declare class VerificarPermissaoUseCase {
    private usuarioRepository;
    constructor(usuarioRepository: IUsuarioRepository);
    execute({ usuarioId, instituicaoId, cargosPermitidos, }: VerificarPermissaoDTO): Promise<boolean>;
}
export {};
