"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DificuldadeController = void 0;
const tsyringe_1 = require("tsyringe");
class DificuldadeController {
    async listar(req, res) {
        const { categoria, tipo, status } = req.query;
        const listarDificuldadesUseCase = tsyringe_1.container.resolve('ListarDificuldadesUseCase');
        const dificuldades = await listarDificuldadesUseCase.execute({
            categoria: categoria,
            tipo: tipo,
            status: status,
            usuarioId: req.user.id,
        });
        return res.json(dificuldades);
    }
    async detalhar(req, res) {
        const { id } = req.params;
        const detalharDificuldadeUseCase = tsyringe_1.container.resolve('DetalharDificuldadeUseCase');
        const dificuldade = await detalharDificuldadeUseCase.execute({
            id,
            usuarioId: req.user.id,
        });
        return res.json(dificuldade);
    }
    async criar(req, res) {
        const { nome, descricao, tipo, categoria, sintomas } = req.body;
        const criarDificuldadeUseCase = tsyringe_1.container.resolve('CriarDificuldadeUseCase');
        const dificuldade = await criarDificuldadeUseCase.execute({
            nome,
            descricao,
            sintomas,
            tipo,
            categoria,
            usuarioId: req.user.id,
        });
        return res.status(201).json(dificuldade);
    }
    async atualizar(req, res) {
        const { id } = req.params;
        const { nome, descricao, tipo, categoria, sintomas, status } = req.body;
        const atualizarDificuldadeUseCase = tsyringe_1.container.resolve('AtualizarDificuldadeUseCase');
        const dificuldade = await atualizarDificuldadeUseCase.execute({
            id,
            nome,
            descricao,
            tipo,
            categoria,
            sintomas,
            status,
            usuarioId: req.user.id,
        });
        return res.json(dificuldade);
    }
    async associarAEstudante(req, res) {
        const { id } = req.params;
        const { estudanteId, observacoes, dataIdentificacao } = req.body;
        const associarDificuldadeEstudanteUseCase = tsyringe_1.container.resolve('AssociarDificuldadeEstudanteUseCase');
        const associacao = await associarDificuldadeEstudanteUseCase.execute({
            dificuldadeId: id,
            estudanteId,
            observacoes,
            dataIdentificacao,
            usuarioId: req.user.id,
        });
        return res.status(201).json(associacao);
    }
    async removerDeEstudante(req, res) {
        const { id, estudanteId } = req.params;
        const { motivo } = req.body;
        const removerDificuldadeEstudanteUseCase = tsyringe_1.container.resolve('RemoverDificuldadeEstudanteUseCase');
        await removerDificuldadeEstudanteUseCase.execute({
            dificuldadeId: id,
            estudanteId,
            motivo,
            usuarioId: req.user.id,
        });
        return res.status(204).send();
    }
    async listarIntervencoesRecomendadas(req, res) {
        const { id } = req.params;
        const { estudanteId, limite } = req.query;
        const listarIntervencoesRecomendadasUseCase = tsyringe_1.container.resolve('ListarIntervencoesRecomendadasUseCase');
        const intervencoes = await listarIntervencoesRecomendadasUseCase.execute({
            dificuldadeId: id,
            estudanteId: estudanteId,
            limite: limite ? parseInt(limite, 10) : undefined,
            usuarioId: req.user.id,
        });
        return res.json(intervencoes);
    }
    async excluir(req, res) {
        const { id } = req.params;
        const excluirDificuldadeUseCase = tsyringe_1.container.resolve('ExcluirDificuldadeUseCase');
        await excluirDificuldadeUseCase.execute({
            id,
            usuarioId: req.user.id,
        });
        return res.status(204).send();
    }
}
exports.DificuldadeController = DificuldadeController;
//# sourceMappingURL=dificuldade.controller.js.map