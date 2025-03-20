"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReuniaoController = void 0;
const tsyringe_1 = require("tsyringe");
class ReuniaoController {
    async listar(req, res) {
        const { equipeId, periodo, status } = req.query;
        const listarReunioesUseCase = tsyringe_1.container.resolve('ListarReunioesUseCase');
        const reunioes = await listarReunioesUseCase.execute({
            equipeId: equipeId,
            periodo: periodo,
            status: status,
        });
        return res.json(reunioes);
    }
    async detalhar(req, res) {
        const { id } = req.params;
        const obterDetalhesReuniaoUseCase = tsyringe_1.container.resolve('ObterDetalhesReuniaoUseCase');
        const reuniao = await obterDetalhesReuniaoUseCase.execute({
            reuniaoId: id,
        });
        return res.json(reuniao);
    }
    async criar(req, res) {
        const { titulo, descricao, dataHora, duracao, local, modalidade, equipeId, participantes, pauta, } = req.body;
        const criarReuniaoUseCase = tsyringe_1.container.resolve('CriarReuniaoUseCase');
        const reuniao = await criarReuniaoUseCase.execute({
            titulo,
            descricao,
            dataHora,
            duracao,
            local,
            modalidade,
            equipeId,
            participantes,
            pauta,
            criadoPorId: req.user.id,
        });
        return res.status(201).json(reuniao);
    }
    async atualizar(req, res) {
        const { id } = req.params;
        const { titulo, descricao, dataHora, duracao, local, modalidade, status, pauta } = req.body;
        const atualizarReuniaoUseCase = tsyringe_1.container.resolve('AtualizarReuniaoUseCase');
        const reuniao = await atualizarReuniaoUseCase.execute({
            reuniaoId: id,
            titulo,
            descricao,
            dataHora,
            duracao,
            local,
            modalidade,
            status,
            pauta,
            atualizadoPorId: req.user.id,
        });
        return res.json(reuniao);
    }
    async adicionarParticipante(req, res) {
        const { id } = req.params;
        const { usuarioId, obrigatorio, papel } = req.body;
        const adicionarParticipanteUseCase = tsyringe_1.container.resolve('AdicionarParticipanteReuniaoUseCase');
        const participante = await adicionarParticipanteUseCase.execute({
            reuniaoId: id,
            usuarioId,
            obrigatorio,
            papel,
            adicionadoPorId: req.user.id,
        });
        return res.status(201).json(participante);
    }
    async removerParticipante(req, res) {
        const { id, participanteId } = req.params;
        const removerParticipanteUseCase = tsyringe_1.container.resolve('RemoverParticipanteReuniaoUseCase');
        await removerParticipanteUseCase.execute({
            reuniaoId: id,
            participanteId,
            removidoPorId: req.user.id,
        });
        return res.status(204).send();
    }
    async registrarPresenca(req, res) {
        const { id, participanteId } = req.params;
        const { presente, justificativa } = req.body;
        const registrarPresencaUseCase = tsyringe_1.container.resolve('RegistrarPresencaReuniaoUseCase');
        const participante = await registrarPresencaUseCase.execute({
            reuniaoId: id,
            participanteId,
            presente,
            justificativa,
            registradoPorId: req.user.id,
        });
        return res.json(participante);
    }
    async adicionarEncaminhamento(req, res) {
        const { id } = req.params;
        const { descricao, prazo, responsavelId, prioridade } = req.body;
        const adicionarEncaminhamentoUseCase = tsyringe_1.container.resolve('AdicionarEncaminhamentoReuniaoUseCase');
        const encaminhamento = await adicionarEncaminhamentoUseCase.execute({
            reuniaoId: id,
            descricao,
            prazo,
            responsavelId,
            prioridade,
            criadoPorId: req.user.id,
        });
        return res.status(201).json(encaminhamento);
    }
    async atualizarEncaminhamento(req, res) {
        const { id, encaminhamentoId } = req.params;
        const { descricao, prazo, responsavelId, prioridade, status, observacoes } = req.body;
        const atualizarEncaminhamentoUseCase = tsyringe_1.container.resolve('AtualizarEncaminhamentoReuniaoUseCase');
        const encaminhamento = await atualizarEncaminhamentoUseCase.execute({
            reuniaoId: id,
            encaminhamentoId,
            descricao,
            prazo,
            responsavelId,
            prioridade,
            status,
            observacoes,
            atualizadoPorId: req.user.id,
        });
        return res.json(encaminhamento);
    }
    async excluir(req, res) {
        const { id } = req.params;
        const excluirReuniaoUseCase = tsyringe_1.container.resolve('ExcluirReuniaoUseCase');
        await excluirReuniaoUseCase.execute({
            reuniaoId: id,
            excluidoPorId: req.user.id,
        });
        return res.status(204).send();
    }
}
exports.ReuniaoController = ReuniaoController;
//# sourceMappingURL=reuniao.controller.js.map