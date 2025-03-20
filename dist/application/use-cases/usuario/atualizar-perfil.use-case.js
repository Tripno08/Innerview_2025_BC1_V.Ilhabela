"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtualizarPerfilUseCase = void 0;
const app_error_1 = require("@shared/errors/app-error");
class AtualizarPerfilUseCase {
    usuarioRepository;
    hashService;
    constructor(usuarioRepository, hashService) {
        this.usuarioRepository = usuarioRepository;
        this.hashService = hashService;
    }
    async execute(dados) {
        const usuario = await this.usuarioRepository.findById(dados.usuarioId);
        if (!usuario) {
            throw new app_error_1.AppError('Usuário não encontrado', 404, 'USER_NOT_FOUND');
        }
        const dadosAtualizacao = {};
        if (dados.nome && dados.nome.trim() !== '') {
            dadosAtualizacao.nome = dados.nome;
        }
        if (dados.email && dados.email !== usuario.email) {
            if (!this.validarEmail(dados.email)) {
                throw new app_error_1.AppError('Email inválido', 400, 'INVALID_EMAIL');
            }
            const emailExistente = await this.usuarioRepository.findByEmail(dados.email);
            if (emailExistente && emailExistente.id !== usuario.id) {
                throw new app_error_1.AppError('Email já está em uso', 409, 'EMAIL_IN_USE');
            }
            dadosAtualizacao.email = dados.email;
        }
        if (dados.cargo) {
            dadosAtualizacao.cargo = dados.cargo;
        }
        if (dados.novaSenha && dados.senhaAtual) {
            const usuarioComCredenciais = await this.usuarioRepository.findWithCredentials(usuario.email);
            const senhaCorreta = await this.hashService.compare(dados.senhaAtual, usuarioComCredenciais.senha);
            if (!senhaCorreta) {
                throw new app_error_1.AppError('Senha atual incorreta', 401, 'INCORRECT_PASSWORD');
            }
            if (!this.validarSenha(dados.novaSenha)) {
                throw new app_error_1.AppError('Nova senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas e números', 400, 'INVALID_PASSWORD');
            }
            dadosAtualizacao.senha = await this.hashService.hash(dados.novaSenha);
        }
        if (Object.keys(dadosAtualizacao).length === 0) {
            return usuario;
        }
        const usuarioAtualizado = await this.usuarioRepository.update(usuario.id, dadosAtualizacao);
        return usuarioAtualizado;
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
exports.AtualizarPerfilUseCase = AtualizarPerfilUseCase;
//# sourceMappingURL=atualizar-perfil.use-case.js.map