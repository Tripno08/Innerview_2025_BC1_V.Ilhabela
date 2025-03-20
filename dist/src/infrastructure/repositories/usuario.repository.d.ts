import { IUsuarioRepository, UsuarioComCredenciais, UsuarioInstituicao, ResultadoPertencimento } from '@domain/repositories/usuario-repository.interface';
import { BaseRepository } from './base.repository';
import { Usuario } from '@domain/entities/usuario.entity';
import { CargoUsuario } from '@shared/enums';
export declare class UsuarioRepository extends BaseRepository<Usuario> implements IUsuarioRepository {
    private mapToUsuario;
    findAll(): Promise<Usuario[]>;
    findById(id: string): Promise<Usuario | null>;
    findByEmail(email: string): Promise<Usuario | null>;
    findWithCredentials(email: string): Promise<UsuarioComCredenciais | null>;
    create(data: Partial<Omit<Usuario, 'id'>> & {
        senha: string;
    }): Promise<Usuario>;
    update(id: string, data: Partial<Omit<Usuario, 'id'>>): Promise<Usuario>;
    delete(id: string): Promise<void>;
    associarAInstituicao(usuarioId: string, instituicaoId: string, cargo?: CargoUsuario): Promise<void>;
    removerDeInstituicao(usuarioId: string, instituicaoId: string): Promise<void>;
    listarInstituicoesDoUsuario(usuarioId: string): Promise<UsuarioInstituicao[]>;
    verificarPertencimentoInstituicao(usuarioId: string, instituicaoId: string): Promise<ResultadoPertencimento>;
}
