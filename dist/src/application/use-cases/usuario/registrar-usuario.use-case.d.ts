import { Usuario } from '@domain/entities/usuario.entity';
import { IUsuarioRepository } from '@domain/repositories/usuario-repository.interface';
import { IHashService } from '@application/interfaces/cryptography.interface';
import { CargoUsuario } from '@shared/enums';
interface RegistrarUsuarioDTO {
    nome: string;
    email: string;
    senha: string;
    cargo?: CargoUsuario;
}
interface RegistrarUsuarioResultado {
    usuario: Usuario;
}
export declare class RegistrarUsuarioUseCase {
    private readonly usuarioRepository;
    private readonly hashService;
    constructor(usuarioRepository: IUsuarioRepository, hashService: IHashService);
    execute(dados: RegistrarUsuarioDTO): Promise<RegistrarUsuarioResultado>;
    private validarEmail;
    private validarSenha;
}
export {};
