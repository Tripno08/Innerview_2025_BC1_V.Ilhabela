import { IUsuarioRepository } from '@domain/repositories/usuario-repository.interface';
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
export declare class AutenticarUsuarioUseCase {
    private readonly usuarioRepository;
    private readonly hashService;
    private readonly jwtService;
    constructor(usuarioRepository: IUsuarioRepository, hashService: IHashService, jwtService: IJwtService);
    execute(dados: AutenticarUsuarioDTO): Promise<AutenticarUsuarioResultado>;
}
export {};
