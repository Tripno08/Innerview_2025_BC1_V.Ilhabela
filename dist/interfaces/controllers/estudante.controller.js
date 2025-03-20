"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstudanteController = void 0;
const tsyringe_1 = require("tsyringe");
class EstudanteController {
    async cadastrar(req, res) {
        const { nome, serie, dataNascimento } = req.body;
        const usuarioId = req.user.id;
        const cadastrarEstudanteUseCase = tsyringe_1.container.resolve('CadastrarEstudanteUseCase');
        const { estudante } = await cadastrarEstudanteUseCase.execute({
            nome,
            serie,
            dataNascimento,
            usuarioId,
        });
        return res.status(201).json(estudante);
    }
    async associarDificuldade(req, res) {
        const { estudanteId, dificuldadeId } = req.body;
        const associarDificuldadeUseCase = tsyringe_1.container.resolve('AssociarDificuldadeUseCase');
        const { estudante } = await associarDificuldadeUseCase.execute({
            estudanteId,
            dificuldadeId,
        });
        return res.status(200).json(estudante);
    }
    async registrarAvaliacao(req, res) {
        const { estudanteId, data, tipo, pontuacao, observacoes } = req.body;
        const registrarAvaliacaoUseCase = tsyringe_1.container.resolve('RegistrarAvaliacaoUseCase');
        const resultado = await registrarAvaliacaoUseCase.execute({
            estudanteId,
            data,
            tipo,
            pontuacao,
            observacoes,
        });
        return res.status(201).json(resultado);
    }
    async recomendarIntervencoes(req, res) {
        const { estudanteId } = req.params;
        const recomendarIntervencoesUseCase = tsyringe_1.container.resolve('RecomendarIntervencoesUseCase');
        const { intervencoes } = await recomendarIntervencoesUseCase.execute({
            estudanteId,
        });
        return res.status(200).json({ intervencoes });
    }
    async acompanharProgresso(req, res) {
        const { estudanteId } = req.params;
        const acompanharProgressoUseCase = tsyringe_1.container.resolve('AcompanharProgressoUseCase');
        const progresso = await acompanharProgressoUseCase.execute({
            estudanteId,
        });
        return res.status(200).json(progresso);
    }
    async listarEstudantesProfessor(req, res) {
        const usuarioId = req.user.id;
        const estudanteRepository = tsyringe_1.container.resolve('EstudanteRepository');
        const estudantes = await estudanteRepository.findByUsuarioId(usuarioId);
        return res.status(200).json(estudantes);
    }
}
exports.EstudanteController = EstudanteController;
//# sourceMappingURL=estudante.controller.js.map