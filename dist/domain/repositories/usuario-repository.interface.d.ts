import { Usuario } from '@domain/entities/usuario.entity';
import { CargoUsuario } from '@prisma/client';
import { IBaseRepository } from './base-repository.interface';
export interface IUsuarioRepository extends IBaseRepository<Usuario> {
    findByEmail(email: string): Promise<Usuario | null>;
    findWithCredentials(email: string): Promise<any | null>;
    associarAInstituicao(usuarioId: string, instituicaoId: string, cargo?: CargoUsuario): Promise<void>;
    removerDeInstituicao(usuarioId: string, instituicaoId: string): Promise<void>;
    listarInstituicoesDoUsuario(usuarioId: string): Promise<any[]>;
    verificarPertencimentoInstituicao(usuarioId: string, instituicaoId: string): Promise<boolean>;
}
