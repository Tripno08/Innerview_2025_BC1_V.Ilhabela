import { IUsuarioRepository } from '@domain/repositories/usuario-repository.interface';
import { Usuario } from '@domain/entities/usuario.entity';
import { CargoUsuario } from '@shared/enums';
interface CriarUsuarioDTO {
    nome: string;
    email: string;
    senha: string;
    cargo?: CargoUsuario;
}
export declare class CriarUsuarioUseCase {
    private usuarioRepository;
    constructor(usuarioRepository: IUsuarioRepository);
    execute(data: CriarUsuarioDTO): Promise<Usuario>;
}
export {};
