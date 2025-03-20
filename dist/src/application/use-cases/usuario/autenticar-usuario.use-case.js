"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutenticarUsuarioUseCase = void 0;
const app_error_1 = require("@shared/errors/app-error");
const usuario_entity_1 = require("@domain/entities/usuario.entity");
class AutenticarUsuarioUseCase {
    usuarioRepository;
    hashService;
    jwtService;
    constructor(usuarioRepository, hashService, jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.hashService = hashService;
        this.jwtService = jwtService;
    }
    async execute(dados) {
        const usuarioComCredenciais = await this.usuarioRepository.findWithCredentials(dados.email);
        if (!usuarioComCredenciais) {
            throw new app_error_1.AppError('Email ou senha inválidos', 401, 'INVALID_CREDENTIALS');
        }
        const senhaCorreta = await this.hashService.compare(dados.senha, usuarioComCredenciais.senha);
        if (!senhaCorreta) {
            throw new app_error_1.AppError('Email ou senha inválidos', 401, 'INVALID_CREDENTIALS');
        }
        const usuario = usuario_entity_1.Usuario.restaurar({
            id: usuarioComCredenciais.id,
            email: usuarioComCredenciais.email,
            nome: usuarioComCredenciais.nome,
            cargo: usuarioComCredenciais.cargo,
            criadoEm: usuarioComCredenciais.criadoEm,
            atualizadoEm: usuarioComCredenciais.atualizadoEm,
        });
        const token = this.jwtService.sign({
            sub: usuario.id,
            email: usuario.email,
            cargo: usuario.cargo,
        });
        return {
            usuario,
            token,
        };
    }
}
exports.AutenticarUsuarioUseCase = AutenticarUsuarioUseCase;
//# sourceMappingURL=autenticar-usuario.use-case.js.map