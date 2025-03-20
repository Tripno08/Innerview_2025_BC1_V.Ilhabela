"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReuniaoController = void 0;
const tsyringe_1 = require("tsyringe");
const listar_reunioes_usecase_1 = require("@application/use-cases/reuniao/listar-reunioes.usecase");
const obter_detalhes_reuniao_usecase_1 = require("@application/use-cases/reuniao/obter-detalhes-reuniao.usecase");
const criar_reuniao_usecase_1 = require("@application/use-cases/reuniao/criar-reuniao.usecase");
const app_error_1 = require("@shared/errors/app-error");
class ReuniaoController {
    async listar(request, response) {
        try {
            const listarReunioesUseCase = tsyringe_1.container.resolve(listar_reunioes_usecase_1.ListarReunioesUseCase);
            const reunioes = await listarReunioesUseCase.execute();
            return response.json(reunioes);
        }
        catch (error) {
            if (error instanceof app_error_1.AppError) {
                return response.status(error.statusCode).json({
                    status: 'error',
                    code: error.code,
                    message: error.message,
                });
            }
            return response.status(500).json({
                status: 'error',
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Erro interno do servidor',
            });
        }
    }
    async listarPorEquipe(request, response) {
        try {
            const { equipeId } = request.params;
            if (!equipeId) {
                return response.status(400).json({
                    status: 'error',
                    code: 'INVALID_INPUT',
                    message: 'ID da equipe é obrigatório',
                });
            }
            const listarReunioesPorEquipeUseCase = tsyringe_1.container.resolve(listar_reunioes_usecase_1.ListarReunioesPorEquipeUseCase);
            const reunioes = await listarReunioesPorEquipeUseCase.execute(equipeId);
            return response.json(reunioes);
        }
        catch (error) {
            if (error instanceof app_error_1.AppError) {
                return response.status(error.statusCode).json({
                    status: 'error',
                    code: error.code,
                    message: error.message,
                });
            }
            return response.status(500).json({
                status: 'error',
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Erro interno do servidor',
            });
        }
    }
    async listarPorPeriodo(request, response) {
        try {
            const { dataInicio, dataFim } = request.query;
            if (!dataInicio || !dataFim) {
                return response.status(400).json({
                    status: 'error',
                    code: 'INVALID_INPUT',
                    message: 'Data de início e data de fim são obrigatórias',
                });
            }
            const dataInicioObj = new Date(dataInicio);
            const dataFimObj = new Date(dataFim);
            if (isNaN(dataInicioObj.getTime()) || isNaN(dataFimObj.getTime())) {
                return response.status(400).json({
                    status: 'error',
                    code: 'INVALID_INPUT',
                    message: 'Formato de data inválido',
                });
            }
            const listarReunioesPorPeriodoUseCase = tsyringe_1.container.resolve(listar_reunioes_usecase_1.ListarReunioesPorPeriodoUseCase);
            const reunioes = await listarReunioesPorPeriodoUseCase.execute(dataInicioObj, dataFimObj);
            return response.json(reunioes);
        }
        catch (error) {
            if (error instanceof app_error_1.AppError) {
                return response.status(error.statusCode).json({
                    status: 'error',
                    code: error.code,
                    message: error.message,
                });
            }
            return response.status(500).json({
                status: 'error',
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Erro interno do servidor',
            });
        }
    }
    async listarPorStatus(request, response) {
        try {
            const { status } = request.params;
            if (!status) {
                return response.status(400).json({
                    status: 'error',
                    code: 'INVALID_INPUT',
                    message: 'Status é obrigatório',
                });
            }
            const listarReunioesPorStatusUseCase = tsyringe_1.container.resolve(listar_reunioes_usecase_1.ListarReunioesPorStatusUseCase);
            const reunioes = await listarReunioesPorStatusUseCase.execute(status);
            return response.json(reunioes);
        }
        catch (error) {
            if (error instanceof app_error_1.AppError) {
                return response.status(error.statusCode).json({
                    status: 'error',
                    code: error.code,
                    message: error.message,
                });
            }
            return response.status(500).json({
                status: 'error',
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Erro interno do servidor',
            });
        }
    }
    async obterDetalhes(request, response) {
        try {
            const { id } = request.params;
            if (!id) {
                return response.status(400).json({
                    status: 'error',
                    code: 'INVALID_INPUT',
                    message: 'ID da reunião é obrigatório',
                });
            }
            const obterDetalhesReuniaoUseCase = tsyringe_1.container.resolve(obter_detalhes_reuniao_usecase_1.ObterDetalhesReuniaoUseCase);
            const detalhes = await obterDetalhesReuniaoUseCase.execute(id);
            return response.json(detalhes);
        }
        catch (error) {
            if (error instanceof app_error_1.AppError) {
                return response.status(error.statusCode).json({
                    status: 'error',
                    code: error.code,
                    message: error.message,
                });
            }
            return response.status(500).json({
                status: 'error',
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Erro interno do servidor',
            });
        }
    }
    async criar(request, response) {
        try {
            const { titulo, data, local, equipeId, observacoes, status, participantes } = request.body;
            const reuniaoData = {
                titulo,
                data: new Date(data),
                local,
                equipeId,
                observacoes,
                status,
                participantes
            };
            if (!reuniaoData.titulo) {
                return response.status(400).json({
                    status: 'error',
                    code: 'INVALID_INPUT',
                    message: 'Título da reunião é obrigatório',
                });
            }
            if (!reuniaoData.data || isNaN(reuniaoData.data.getTime())) {
                return response.status(400).json({
                    status: 'error',
                    code: 'INVALID_INPUT',
                    message: 'Data da reunião é obrigatória e deve estar em formato válido',
                });
            }
            if (!reuniaoData.equipeId) {
                return response.status(400).json({
                    status: 'error',
                    code: 'INVALID_INPUT',
                    message: 'ID da equipe é obrigatório',
                });
            }
            const criarReuniaoUseCase = tsyringe_1.container.resolve(criar_reuniao_usecase_1.CriarReuniaoUseCase);
            const reuniao = await criarReuniaoUseCase.execute(reuniaoData);
            return response.status(201).json(reuniao);
        }
        catch (error) {
            if (error instanceof app_error_1.AppError) {
                return response.status(error.statusCode).json({
                    status: 'error',
                    code: error.code,
                    message: error.message,
                });
            }
            return response.status(500).json({
                status: 'error',
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Erro interno do servidor',
            });
        }
    }
}
exports.ReuniaoController = ReuniaoController;
//# sourceMappingURL=reuniao.controller.js.map