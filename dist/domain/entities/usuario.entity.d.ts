import { CargoUsuario } from '@prisma/client';
export interface UsuarioProps {
    id?: string;
    email: string;
    nome: string;
    cargo: CargoUsuario;
    criadoEm?: Date;
    atualizadoEm?: Date;
}
export declare class Usuario {
    readonly id: string;
    readonly email: string;
    readonly nome: string;
    readonly cargo: CargoUsuario;
    readonly criadoEm: Date;
    readonly atualizadoEm: Date;
    private constructor();
    private validar;
    private validarEmail;
    static criar(props: UsuarioProps): Usuario;
    static restaurar(dados: UsuarioProps): Usuario;
    atualizar(dados: Partial<Omit<UsuarioProps, 'id' | 'criadoEm'>>): Usuario;
    temPermissao(cargosPermitidos: CargoUsuario[]): boolean;
    ehAdministrador(): boolean;
    podeGerenciarUsuarios(): boolean;
}
