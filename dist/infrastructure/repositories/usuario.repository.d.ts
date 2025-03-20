import { IUsuarioRepository } from '@domain/repositories/usuario-repository.interface';
import { Usuario } from '@domain/entities/usuario.entity';
import { BaseRepository } from './base.repository';
import { CargoUsuario } from '@prisma/client';
export declare class UsuarioRepository extends BaseRepository<Usuario> implements IUsuarioRepository {
    findAll(): Promise<Usuario[]>;
    findById(id: string): Promise<Usuario | null>;
    findByEmail(email: string): Promise<Usuario | null>;
    findWithCredentials(email: string): Promise<any | null>;
    create(data: any): Promise<Usuario>;
    update(id: string, data: any): Promise<Usuario>;
    delete(id: string): Promise<void>;
    associarAInstituicao(usuarioId: string, instituicaoId: string, cargo?: CargoUsuario): Promise<void>;
    removerDeInstituicao(usuarioId: string, instituicaoId: string): Promise<void>;
    listarInstituicoesDoUsuario(usuarioId: string): Promise<any[]>;
    verificarPertencimentoInstituicao(usuarioId: string, instituicaoId: string): Promise<boolean>;
}
