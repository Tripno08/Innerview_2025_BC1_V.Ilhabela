"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrarUsuarioUseCase = void 0;
const app_error_1 = require("@shared/errors/app-error");
const enums_1 = require("@shared/enums");
class RegistrarUsuarioUseCase {
    usuarioRepository;
    hashService;
    constructor(usuarioRepository, hashService) {
        this.usuarioRepository = usuarioRepository;
        this.hashService = hashService;
    }
    async execute(dados) {
        const usuarioExistente = await this.usuarioRepository.findByEmail(dados.email);
        if (usuarioExistente) {
            throw new app_error_1.AppError('Email já está em uso', 409, 'EMAIL_IN_USE');
        }
        if (!this.validarEmail(dados.email)) {
            throw new app_error_1.AppError('Email inválido', 400, 'INVALID_EMAIL');
        }
        if (!this.validarSenha(dados.senha)) {
            throw new app_error_1.AppError('Senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas e números', 400, 'INVALID_PASSWORD');
        }
        const senhaCriptografada = await this.hashService.hash(dados.senha);
        const dadosCriacao = {
            nome: dados.nome,
            email: dados.email,
            senha: senhaCriptografada,
            cargo: dados.cargo || enums_1.CargoUsuario.PROFESSOR,
        };
        const usuario = await this.usuarioRepository.create(dadosCriacao);
        return { usuario };
    }
    validarEmail(email) {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    }
    validarSenha(senha) {
        if (senha.length < 8)
            return false;
        const regexMaiuscula = /[A-Z]/;
        const regexMinuscula = /[a-z]/;
        const regexNumero = /[0-9]/;
        return regexMaiuscula.test(senha) && regexMinuscula.test(senha) && regexNumero.test(senha);
    }
}
exports.RegistrarUsuarioUseCase = RegistrarUsuarioUseCase;
//# sourceMappingURL=registrar-usuario.use-case.js.map