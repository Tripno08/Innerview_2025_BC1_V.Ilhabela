"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CriarUsuarioUseCase = void 0;
const app_error_1 = require("@shared/errors/app-error");
const bcryptjs_1 = require("bcryptjs");
const enums_1 = require("@shared/enums");
class CriarUsuarioUseCase {
    usuarioRepository;
    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }
    async execute(data) {
        const usuarioExistente = await this.usuarioRepository.findByEmail(data.email);
        if (usuarioExistente) {
            throw new app_error_1.AppError('Email já está em uso', 409, 'EMAIL_IN_USE');
        }
        const senhaCriptografada = await (0, bcryptjs_1.hash)(data.senha, 10);
        const dadosUsuario = {
            nome: data.nome,
            email: data.email,
            senha: senhaCriptografada,
            cargo: data.cargo || enums_1.CargoUsuario.PROFESSOR,
        };
        const usuario = await this.usuarioRepository.create(dadosUsuario);
        return usuario;
    }
}
exports.CriarUsuarioUseCase = CriarUsuarioUseCase;
//# sourceMappingURL=criar-usuario.use-case.js.map