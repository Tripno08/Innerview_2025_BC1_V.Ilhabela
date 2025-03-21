"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mlRoutes = void 0;
const express_1 = require("express");
const tsyringe_1 = require("tsyringe");
const estudante_repository_1 = require("../../infrastructure/repositories/estudante.repository");
const intervencao_repository_1 = require("../../infrastructure/repositories/intervencao.repository");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const rbac_middleware_1 = require("../middlewares/rbac.middleware");
const enums_1 = require("../../shared/enums");
const mlRoutes = (0, express_1.Router)();
exports.mlRoutes = mlRoutes;
const mlService = tsyringe_1.container.resolve('MLService');
const estudanteRepository = tsyringe_1.container.resolve(estudante_repository_1.EstudanteRepository);
const intervencaoRepository = tsyringe_1.container.resolve(intervencao_repository_1.IntervencaoRepository);
const dificuldadeRepository = tsyringe_1.container.resolve('DificuldadeRepository');
mlRoutes.use(auth_middleware_1.authMiddleware);
mlRoutes.get('/estudantes/:estudanteId/risco', (0, rbac_middleware_1.rbacMiddleware)([enums_1.CargoUsuario.ADMIN, enums_1.CargoUsuario.PROFESSOR, enums_1.CargoUsuario.ESPECIALISTA]), async (req, res) => {
    try {
        const { estudanteId } = req.params;
        const { incluirFatores } = req.query;
        const estudante = await estudanteRepository.findById(estudanteId);
        if (!estudante) {
            return res.status(404).json({ message: 'Estudante não encontrado' });
        }
        const analiseRisco = await mlService.preverRiscoAcademico(estudante, incluirFatores === 'true');
        return res.json(analiseRisco);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao analisar risco acadêmico' });
    }
});
mlRoutes.get('/estudantes/:estudanteId/recomendacoes', (0, rbac_middleware_1.rbacMiddleware)([enums_1.CargoUsuario.ADMIN, enums_1.CargoUsuario.PROFESSOR, enums_1.CargoUsuario.ESPECIALISTA]), async (req, res) => {
    try {
        const { estudanteId } = req.params;
        const { limite } = req.query;
        const estudante = await estudanteRepository.findById(estudanteId);
        if (!estudante) {
            return res.status(404).json({ message: 'Estudante não encontrado' });
        }
        const dificuldades = await dificuldadeRepository.findByEstudanteId(estudanteId);
        const recomendacoes = await mlService.recomendarIntervencoes(estudante, dificuldades, limite ? parseInt(limite) : undefined);
        return res.json(recomendacoes);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao gerar recomendações' });
    }
});
mlRoutes.get('/intervencoes/:intervencaoId/eficacia', (0, rbac_middleware_1.rbacMiddleware)([enums_1.CargoUsuario.ADMIN, enums_1.CargoUsuario.PROFESSOR, enums_1.CargoUsuario.ESPECIALISTA]), async (req, res) => {
    try {
        const { intervencaoId } = req.params;
        const { metricas } = req.query;
        const intervencao = await intervencaoRepository.findById(intervencaoId);
        if (!intervencao) {
            return res.status(404).json({ message: 'Intervenção não encontrada' });
        }
        const metricasArray = metricas ? metricas.split(',') : undefined;
        const analiseEficacia = await mlService.analisarEficaciaIntervencao(intervencao, metricasArray);
        return res.json(analiseEficacia);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao analisar eficácia da intervenção' });
    }
});
mlRoutes.get('/padroes', (0, rbac_middleware_1.rbacMiddleware)([enums_1.CargoUsuario.ADMIN, enums_1.CargoUsuario.PROFESSOR, enums_1.CargoUsuario.ESPECIALISTA]), async (req, res) => {
    try {
        const { limiteConfianca, area, estudanteId } = req.query;
        const filtros = {};
        if (area)
            filtros.area = area;
        if (estudanteId)
            filtros.estudanteId = estudanteId;
        const padroes = await mlService.detectarPadroes(Object.keys(filtros).length > 0 ? filtros : undefined, limiteConfianca ? parseFloat(limiteConfianca) : undefined);
        return res.json(padroes);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao detectar padrões' });
    }
});
mlRoutes.get('/estudantes/:estudanteId/comparacao', (0, rbac_middleware_1.rbacMiddleware)([enums_1.CargoUsuario.ADMIN, enums_1.CargoUsuario.PROFESSOR, enums_1.CargoUsuario.ESPECIALISTA]), async (req, res) => {
    try {
        const { estudanteId } = req.params;
        const { indicadores } = req.query;
        const estudante = await estudanteRepository.findById(estudanteId);
        if (!estudante) {
            return res.status(404).json({ message: 'Estudante não encontrado' });
        }
        if (!indicadores) {
            return res.status(400).json({ message: 'É necessário fornecer pelo menos um indicador' });
        }
        const indicadoresArray = indicadores.split(',');
        const comparacao = await mlService.compararComNormas(estudante, indicadoresArray);
        return res.json(comparacao);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao gerar comparação normativa' });
    }
});
mlRoutes.get('/modelos', (0, rbac_middleware_1.rbacMiddleware)([enums_1.CargoUsuario.ADMIN]), async (req, res) => {
    try {
        const { tipo } = req.query;
        const modelos = await mlService.listarModelos(tipo);
        return res.json(modelos);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao listar modelos' });
    }
});
mlRoutes.post('/modelos/:modeloId/treinar', (0, rbac_middleware_1.rbacMiddleware)([enums_1.CargoUsuario.ADMIN]), async (req, res) => {
    try {
        const { modeloId } = req.params;
        const configuracao = req.body;
        const modeloAtualizado = await mlService.treinarModelo(modeloId, configuracao);
        return res.json(modeloAtualizado);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao treinar modelo' });
    }
});
mlRoutes.post('/dados/treinamento', (0, rbac_middleware_1.rbacMiddleware)([enums_1.CargoUsuario.ADMIN]), async (req, res) => {
    try {
        const dados = req.body;
        if (!Array.isArray(dados)) {
            return res
                .status(400)
                .json({ message: 'O corpo da requisição deve ser um array de dados de treinamento' });
        }
        await mlService.registrarDadosTreinamento(dados);
        return res.status(201).json({ message: 'Dados de treinamento registrados com sucesso' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao registrar dados de treinamento' });
    }
});
//# sourceMappingURL=ml.routes.js.map