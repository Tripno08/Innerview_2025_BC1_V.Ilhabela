import { IUsuarioRepository } from '@domain/repositories/usuario-repository.interface';
import { CargoUsuario } from '@prisma/client';
interface VerificarPermissaoDTO {
    usuarioId: string;
    instituicaoId?: string;
    cargosPermitidos: CargoUsuario[];
}
export declare class VerificarPermissaoUseCase {
    private readonly usuarioRepository;
    constructor(usuarioRepository: IUsuarioRepository);
    execute(dados: VerificarPermissaoDTO): Promise<boolean>;
}
export {};
