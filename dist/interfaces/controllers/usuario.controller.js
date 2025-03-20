"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioController = void 0;
const tsyringe_1 = require("tsyringe");
class UsuarioController {
    async registrar(req, res) {
        const { nome, email, senha, cargo } = req.body;
        const registrarUsuarioUseCase = tsyringe_1.container.resolve('RegistrarUsuarioUseCase');
        const { usuario } = await registrarUsuarioUseCase.execute({
            nome,
            email,
            senha,
            cargo,
        });
        return res.status(201).json({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            cargo: usuario.cargo,
        });
    }
    async autenticar(req, res) {
        const { email, senha } = req.body;
        const autenticarUsuarioUseCase = tsyringe_1.container.resolve('AutenticarUsuarioUseCase');
        const { usuario, token } = await autenticarUsuarioUseCase.execute({
            email,
            senha,
        });
        return res.json({
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                cargo: usuario.cargo,
            },
            token,
        });
    }
    async obterPerfil(req, res) {
        return res.json({
            id: req.user.id,
            nome: req.user.nome,
            email: req.user.email,
            cargo: req.user.cargo,
        });
    }
    async atualizarPerfil(req, res) {
        const { nome, email, senhaAtual, novaSenha, cargo } = req.body;
        const atualizarPerfilUseCase = tsyringe_1.container.resolve('AtualizarPerfilUseCase');
        const usuarioAtualizado = await atualizarPerfilUseCase.execute({
            usuarioId: req.user.id,
            nome,
            email,
            senhaAtual,
            novaSenha,
            cargo,
        });
        return res.json({
            id: usuarioAtualizado.id,
            nome: usuarioAtualizado.nome,
            email: usuarioAtualizado.email,
            cargo: usuarioAtualizado.cargo,
        });
    }
    async associarAInstituicao(req, res) {
        const { instituicaoId, usuarioId, cargo } = req.body;
        const associarUsuarioInstituicaoUseCase = tsyringe_1.container.resolve('AssociarUsuarioInstituicaoUseCase');
        await associarUsuarioInstituicaoUseCase.execute({
            usuarioId: usuarioId || req.user.id,
            instituicaoId,
            cargo,
        });
        return res.status(204).send();
    }
}
exports.UsuarioController = UsuarioController;
//# sourceMappingURL=usuario.controller.js.map