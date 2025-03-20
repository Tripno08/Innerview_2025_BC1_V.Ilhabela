"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipeController = void 0;
const tsyringe_1 = require("tsyringe");
class EquipeController {
    async listar(req, res) {
        const { instituicaoId, usuarioId, tipo } = req.query;
        const listarEquipesUseCase = tsyringe_1.container.resolve('ListarEquipesUseCase');
        const equipes = await listarEquipesUseCase.execute({
            instituicaoId: instituicaoId,
            usuarioId: usuarioId || req.user.id,
            tipo: tipo,
        });
        return res.json(equipes);
    }
    async detalhar(req, res) {
        const { id } = req.params;
        const detalharEquipeUseCase = tsyringe_1.container.resolve('DetalharEquipeUseCase');
        const equipe = await detalharEquipeUseCase.execute({
            id,
            usuarioId: req.user.id,
        });
        return res.json(equipe);
    }
    async criar(req, res) {
        const criarEquipeUseCase = tsyringe_1.container.resolve('CriarEquipeUseCase');
        const equipe = await criarEquipeUseCase.execute({
            ...req.body,
            usuarioCriador: req.user.id,
        });
        return res.status(201).json(equipe);
    }
    async atualizar(req, res) {
        const { id } = req.params;
        const atualizarEquipeUseCase = tsyringe_1.container.resolve('AtualizarEquipeUseCase');
        const equipe = await atualizarEquipeUseCase.execute({
            id,
            ...req.body,
            usuarioId: req.user.id,
        });
        return res.json(equipe);
    }
    async adicionarMembro(req, res) {
        const { id } = req.params;
        const adicionarMembroEquipeUseCase = tsyringe_1.container.resolve('AdicionarMembroEquipeUseCase');
        const membro = await adicionarMembroEquipeUseCase.execute({
            equipeId: id,
            ...req.body,
            usuarioId: req.user.id,
        });
        return res.status(201).json(membro);
    }
    async removerMembro(req, res) {
        const { id, membroId } = req.params;
        const removerMembroEquipeUseCase = tsyringe_1.container.resolve('RemoverMembroEquipeUseCase');
        await removerMembroEquipeUseCase.execute({
            equipeId: id,
            membroId,
            usuarioId: req.user.id,
        });
        return res.sendStatus(204);
    }
    async adicionarEstudante(req, res) {
        const { id } = req.params;
        const adicionarEstudanteEquipeUseCase = tsyringe_1.container.resolve('AdicionarEstudanteEquipeUseCase');
        const estudanteEquipe = await adicionarEstudanteEquipeUseCase.execute({
            equipeId: id,
            ...req.body,
            usuarioId: req.user.id,
        });
        return res.status(201).json(estudanteEquipe);
    }
    async removerEstudante(req, res) {
        const { id, estudanteId } = req.params;
        const removerEstudanteEquipeUseCase = tsyringe_1.container.resolve('RemoverEstudanteEquipeUseCase');
        await removerEstudanteEquipeUseCase.execute({
            equipeId: id,
            estudanteId,
            usuarioId: req.user.id,
        });
        return res.sendStatus(204);
    }
    async listarEstudantes(req, res) {
        const { id } = req.params;
        const listarEstudantesEquipeUseCase = tsyringe_1.container.resolve('ListarEstudantesEquipeUseCase');
        const estudantes = await listarEstudantesEquipeUseCase.execute({
            equipeId: id,
            usuarioId: req.user.id,
        });
        return res.json(estudantes);
    }
    async excluir(req, res) {
        const { id } = req.params;
        const excluirEquipeUseCase = tsyringe_1.container.resolve('ExcluirEquipeUseCase');
        await excluirEquipeUseCase.execute({
            id,
            usuarioId: req.user.id,
        });
        return res.sendStatus(204);
    }
}
exports.EquipeController = EquipeController;
//# sourceMappingURL=equipe.controller.js.map