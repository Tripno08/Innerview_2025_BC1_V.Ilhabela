import { IUsuarioRepository } from '@domain/repositories/usuario-repository.interface';
import { Usuario } from '@domain/entities/usuario.entity';
import { IHashService } from '@application/interfaces/cryptography.interface';
import { CargoUsuario } from '@shared/enums';
interface AtualizarPerfilDTO {
    usuarioId: string;
    nome?: string;
    email?: string;
    senhaAtual?: string;
    novaSenha?: string;
    cargo?: CargoUsuario;
}
export declare class AtualizarPerfilUseCase {
    private readonly usuarioRepository;
    private readonly hashService;
    constructor(usuarioRepository: IUsuarioRepository, hashService: IHashService);
    execute(dados: AtualizarPerfilDTO): Promise<Usuario>;
    private validarEmail;
    private validarSenha;
}
export {};
