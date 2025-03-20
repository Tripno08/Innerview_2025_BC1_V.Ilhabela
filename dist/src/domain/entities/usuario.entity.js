"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = void 0;
const enums_1 = require("@shared/enums");
class Usuario {
    id;
    email;
    nome;
    cargo;
    criadoEm;
    atualizadoEm;
    constructor(props) {
        this.id = props.id;
        this.email = props.email;
        this.nome = props.nome;
        this.cargo = props.cargo;
        this.criadoEm = props.criadoEm || new Date();
        this.atualizadoEm = props.atualizadoEm || new Date();
        this.validar();
    }
    validar() {
        if (!this.nome || this.nome.trim().length < 3) {
            throw new Error('Nome deve ter pelo menos 3 caracteres');
        }
        if (!this.email || !this.validarEmail(this.email)) {
            throw new Error('Email inválido');
        }
        const cargoValues = Object.values(enums_1.CargoUsuario);
        if (!cargoValues.includes(this.cargo)) {
            throw new Error('Cargo inválido');
        }
    }
    validarEmail(email) {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    }
    static criar(props) {
        return new Usuario(props);
    }
    static restaurar(dados) {
        return new Usuario({
            ...dados,
        });
    }
    atualizar(dados) {
        return new Usuario({
            id: this.id,
            email: dados.email || this.email,
            nome: dados.nome || this.nome,
            cargo: dados.cargo || this.cargo,
            criadoEm: this.criadoEm,
            atualizadoEm: new Date(),
        });
    }
    temPermissao(cargosPermitidos) {
        return cargosPermitidos.includes(this.cargo);
    }
    ehAdministrador() {
        return this.cargo === enums_1.CargoUsuario.ADMIN || this.cargo === enums_1.CargoUsuario.ADMINISTRADOR;
    }
    podeGerenciarUsuarios() {
        const adminCargos = [
            enums_1.CargoUsuario.ADMINISTRADOR,
            enums_1.CargoUsuario.DIRETOR,
            enums_1.CargoUsuario.COORDENADOR,
            enums_1.CargoUsuario.ADMIN,
        ];
        return adminCargos.includes(this.cargo);
    }
}
exports.Usuario = Usuario;
//# sourceMappingURL=usuario.entity.js.map