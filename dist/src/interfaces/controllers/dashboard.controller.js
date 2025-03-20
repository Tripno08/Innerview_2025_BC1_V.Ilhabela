"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const tsyringe_1 = require("tsyringe");
class DashboardController {
    async obterIndicadores(req, res) {
        const { instituicaoId, periodo } = req.query;
        const obterIndicadoresUseCase = tsyringe_1.container.resolve('ObterIndicadoresUseCase');
        const indicadores = await obterIndicadoresUseCase.execute({
            instituicaoId: instituicaoId,
            periodo: periodo,
            usuarioId: req.user.id,
        });
        return res.json(indicadores);
    }
    async obterEstatisticasEstudantes(req, res) {
        const { instituicaoId, equipeId, periodo, agrupador } = req.query;
        const obterEstatisticasEstudantesUseCase = tsyringe_1.container.resolve('ObterEstatisticasEstudantesUseCase');
        const estatisticas = await obterEstatisticasEstudantesUseCase.execute({
            instituicaoId: instituicaoId,
            equipeId: equipeId,
            periodo: periodo,
            agrupador: agrupador,
            usuarioId: req.user.id,
        });
        return res.json(estatisticas);
    }
    async obterEstatisticasDificuldades(req, res) {
        const { instituicaoId, equipeId, periodo, agrupador } = req.query;
        const obterEstatisticasDificuldadesUseCase = tsyringe_1.container.resolve('ObterEstatisticasDificuldadesUseCase');
        const estatisticas = await obterEstatisticasDificuldadesUseCase.execute({
            instituicaoId: instituicaoId,
            equipeId: equipeId,
            periodo: periodo,
            agrupador: agrupador,
            usuarioId: req.user.id,
        });
        return res.json(estatisticas);
    }
    async obterEstatisticasIntervencoes(req, res) {
        const { instituicaoId, equipeId, periodo, agrupador } = req.query;
        const obterEstatisticasIntervencoesUseCase = tsyringe_1.container.resolve('ObterEstatisticasIntervencoesUseCase');
        const estatisticas = await obterEstatisticasIntervencoesUseCase.execute({
            instituicaoId: instituicaoId,
            equipeId: equipeId,
            periodo: periodo,
            agrupador: agrupador,
            usuarioId: req.user.id,
        });
        return res.json(estatisticas);
    }
    async obterEstatisticasReunioes(req, res) {
        const { instituicaoId, equipeId, periodo, agrupador } = req.query;
        const obterEstatisticasReunioesUseCase = tsyringe_1.container.resolve('ObterEstatisticasReunioesUseCase');
        const estatisticas = await obterEstatisticasReunioesUseCase.execute({
            instituicaoId: instituicaoId,
            equipeId: equipeId,
            periodo: periodo,
            agrupador: agrupador,
            usuarioId: req.user.id,
        });
        return res.json(estatisticas);
    }
    async obterEstatisticasProgresso(req, res) {
        const { instituicaoId, equipeId, periodo, agrupador } = req.query;
        const obterEstatisticasProgressoUseCase = tsyringe_1.container.resolve('ObterEstatisticasProgressoUseCase');
        const estatisticas = await obterEstatisticasProgressoUseCase.execute({
            instituicaoId: instituicaoId,
            equipeId: equipeId,
            periodo: periodo,
            agrupador: agrupador,
            usuarioId: req.user.id,
        });
        return res.json(estatisticas);
    }
    async obterEstatisticasDesempenho(req, res) {
        const { instituicaoId, equipeId, periodo, estudanteId } = req.query;
        const obterEstatisticasDesempenhoUseCase = tsyringe_1.container.resolve('ObterEstatisticasDesempenhoUseCase');
        const estatisticas = await obterEstatisticasDesempenhoUseCase.execute({
            instituicaoId: instituicaoId,
            equipeId: equipeId,
            periodo: periodo,
            estudanteId: estudanteId,
            usuarioId: req.user.id,
        });
        return res.json(estatisticas);
    }
    async obterTendenciasAprendizagem(req, res) {
        const { instituicaoId, equipeId, periodo } = req.query;
        const obterTendenciasAprendizagemUseCase = tsyringe_1.container.resolve('ObterTendenciasAprendizagemUseCase');
        const tendencias = await obterTendenciasAprendizagemUseCase.execute({
            instituicaoId: instituicaoId,
            equipeId: equipeId,
            periodo: periodo,
            usuarioId: req.user.id,
        });
        return res.json(tendencias);
    }
    async gerarRelatorioEstudante(req, res) {
        const { estudanteId } = req.params;
        const { formato, periodo } = req.query;
        const gerarRelatorioEstudanteUseCase = tsyringe_1.container.resolve('GerarRelatorioEstudanteUseCase');
        const relatorio = await gerarRelatorioEstudanteUseCase.execute({
            estudanteId,
            formato: formato,
            periodo: periodo,
            usuarioId: req.user.id,
        });
        if (formato === 'pdf' || formato === 'excel') {
            res.setHeader('Content-Type', formato === 'pdf' ? 'application/pdf' : 'application/vnd.ms-excel');
            res.setHeader('Content-Disposition', `attachment; filename=relatorio-estudante-${estudanteId}.${formato}`);
            return res.send(relatorio);
        }
        return res.json(relatorio);
    }
    async gerarRelatorioIntervencoes(req, res) {
        const { instituicaoId, equipeId, periodo, formato, tipoIntervencao } = req.query;
        const gerarRelatorioIntervencoesUseCase = tsyringe_1.container.resolve('GerarRelatorioIntervencoesUseCase');
        const relatorio = await gerarRelatorioIntervencoesUseCase.execute({
            instituicaoId: instituicaoId,
            equipeId: equipeId,
            periodo: periodo,
            formato: formato,
            tipoIntervencao: tipoIntervencao,
            usuarioId: req.user.id,
        });
        if (formato === 'pdf' || formato === 'excel') {
            res.setHeader('Content-Type', formato === 'pdf' ? 'application/pdf' : 'application/vnd.ms-excel');
            res.setHeader('Content-Disposition', `attachment; filename=relatorio-intervencoes-${periodo}.${formato}`);
            return res.send(relatorio);
        }
        return res.json(relatorio);
    }
    async gerarRelatorioEquipe(req, res) {
        const { equipeId } = req.params;
        const { formato, periodo } = req.query;
        const gerarRelatorioEquipeUseCase = tsyringe_1.container.resolve('GerarRelatorioEquipeUseCase');
        const relatorio = await gerarRelatorioEquipeUseCase.execute({
            equipeId,
            formato: formato,
            periodo: periodo,
            usuarioId: req.user.id,
        });
        if (formato === 'pdf' || formato === 'excel') {
            res.setHeader('Content-Type', formato === 'pdf' ? 'application/pdf' : 'application/vnd.ms-excel');
            res.setHeader('Content-Disposition', `attachment; filename=relatorio-equipe-${equipeId}.${formato}`);
            return res.send(relatorio);
        }
        return res.json(relatorio);
    }
}
exports.DashboardController = DashboardController;
//# sourceMappingURL=dashboard.controller.js.map