import { Usuario } from '../entities/usuario.entity';
import { IBaseRepository } from './base-repository.interface';
import { CargoUsuario } from '@shared/enums';
export interface UsuarioComCredenciais extends Usuario {
    senha?: string;
    salt?: string;
}
export interface UsuarioInstituicao {
    id: string;
    usuarioId: string;
    instituicaoId: string;
    cargo: CargoUsuario;
    ativo: boolean;
    criadoEm: Date;
    atualizadoEm: Date;
    instituicao: {
        id: string;
        nome: string;
        tipo: string;
    };
}
export interface ResultadoPertencimento {
    pertence: boolean;
    cargo?: CargoUsuario;
}
export interface IUsuarioRepository extends IBaseRepository<Usuario> {
    findByEmail(email: string): Promise<Usuario | null>;
    findWithCredentials(email: string): Promise<UsuarioComCredenciais | null>;
    associarAInstituicao(usuarioId: string, instituicaoId: string, cargo?: CargoUsuario): Promise<void>;
    removerDeInstituicao(usuarioId: string, instituicaoId: string): Promise<void>;
    listarInstituicoesDoUsuario(usuarioId: string): Promise<UsuarioInstituicao[]>;
    verificarPertencimentoInstituicao(usuarioId: string, instituicaoId: string): Promise<ResultadoPertencimento>;
}
