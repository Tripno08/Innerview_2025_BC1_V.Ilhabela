"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntervencaoController = void 0;
const tsyringe_1 = require("tsyringe");
class IntervencaoController {
    async listar(req, res) {
        const { estudanteId, equipeId, status, tipo, page, limit } = req.query;
        const listarIntervencoesUseCase = tsyringe_1.container.resolve('ListarIntervencoesUseCase');
        const intervencoes = await listarIntervencoesUseCase.execute({
            estudanteId: estudanteId,
            equipeId: equipeId,
            status: status,
            tipo: tipo,
            page: page ? parseInt(page, 10) : 1,
            limit: limit ? parseInt(limit, 10) : 20,
            usuarioId: req.user.id,
        });
        return res.json(intervencoes);
    }
    async detalhar(req, res) {
        const { id } = req.params;
        const detalharIntervencaoUseCase = tsyringe_1.container.resolve('DetalharIntervencaoUseCase');
        const intervencao = await detalharIntervencaoUseCase.execute({
            id,
            usuarioId: req.user.id,
        });
        return res.json(intervencao);
    }
    async criar(req, res) {
        const criarIntervencaoUseCase = tsyringe_1.container.resolve('CriarIntervencaoUseCase');
        const intervencao = await criarIntervencaoUseCase.execute({
            ...req.body,
            usuarioId: req.user.id,
        });
        return res.status(201).json(intervencao);
    }
    async atualizar(req, res) {
        const { id } = req.params;
        const atualizarIntervencaoUseCase = tsyringe_1.container.resolve('AtualizarIntervencaoUseCase');
        const intervencao = await atualizarIntervencaoUseCase.execute({
            id,
            ...req.body,
            usuarioId: req.user.id,
        });
        return res.json(intervencao);
    }
    async registrarProgresso(req, res) {
        const { id } = req.params;
        const { progresso, observacao } = req.body;
        const registrarProgressoIntervencaoUseCase = tsyringe_1.container.resolve('RegistrarProgressoIntervencaoUseCase');
        const intervencao = await registrarProgressoIntervencaoUseCase.execute({
            intervencaoId: id,
            progresso,
            observacao,
            usuarioId: req.user.id,
        });
        return res.json(intervencao);
    }
    async avaliarEficacia(req, res) {
        const { id } = req.params;
        const { nota, observacao } = req.body;
        const avaliarEficaciaIntervencaoUseCase = tsyringe_1.container.resolve('AvaliarEficaciaIntervencaoUseCase');
        const avaliacao = await avaliarEficaciaIntervencaoUseCase.execute({
            intervencaoId: id,
            nota,
            observacao,
            usuarioId: req.user.id,
        });
        return res.json(avaliacao);
    }
    async excluir(req, res) {
        const { id } = req.params;
        const excluirIntervencaoUseCase = tsyringe_1.container.resolve('ExcluirIntervencaoUseCase');
        await excluirIntervencaoUseCase.execute({
            id,
            usuarioId: req.user.id,
        });
        return res.status(204).send();
    }
}
exports.IntervencaoController = IntervencaoController;
//# sourceMappingURL=intervencao.controller.js.map