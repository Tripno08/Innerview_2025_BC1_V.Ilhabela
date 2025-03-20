"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationMiddleware = void 0;
const celebrate_1 = require("celebrate");
const app_error_1 = require("@shared/errors/app-error");
exports.ValidationMiddleware = {
    validateBody: (schema) => (0, celebrate_1.celebrate)({ [celebrate_1.Segments.BODY]: schema }),
    validateParams: (schema) => {
        if ('id' in schema && typeof schema.id !== 'string') {
            return (0, celebrate_1.celebrate)({ [celebrate_1.Segments.PARAMS]: schema });
        }
        return (0, celebrate_1.celebrate)({ [celebrate_1.Segments.PARAMS]: schema });
    },
    validateQuery: (schema) => (0, celebrate_1.celebrate)({ [celebrate_1.Segments.QUERY]: schema }),
    handleValidationErrors: (err, req, res, _next) => {
        if (err.joi) {
            const errorDetails = err.joi.details.map((detail) => ({
                message: detail.message,
                path: detail.path,
                type: detail.type,
            }));
            return res.status(400).json({
                status: 'error',
                message: 'Erro de validação',
                details: errorDetails,
            });
        }
        if (err instanceof app_error_1.AppError) {
            return res.status(err.statusCode).json({
                status: 'error',
                message: err.message,
            });
        }
        console.error(err);
        return res.status(500).json({
            status: 'error',
            message: 'Erro interno do servidor',
        });
    },
    schemas: {
        id: celebrate_1.Joi.object({
            id: celebrate_1.Joi.string().uuid().required(),
        }),
        pagination: celebrate_1.Joi.object({
            page: celebrate_1.Joi.number().integer().min(1).default(1),
            limit: celebrate_1.Joi.number().integer().min(1).max(100).default(10),
        }),
        periodo: celebrate_1.Joi.object({
            dataInicio: celebrate_1.Joi.date().iso(),
            dataFim: celebrate_1.Joi.date().iso().min(celebrate_1.Joi.ref('dataInicio')),
        }),
        usuario: {
            registro: celebrate_1.Joi.object({
                nome: celebrate_1.Joi.string().min(3).max(100).required(),
                email: celebrate_1.Joi.string().email().required(),
                senha: celebrate_1.Joi.string().min(6).required(),
                cargo: celebrate_1.Joi.string().required(),
            }),
            autenticacao: celebrate_1.Joi.object({
                email: celebrate_1.Joi.string().email().required(),
                senha: celebrate_1.Joi.string().required(),
            }),
            atualizacao: celebrate_1.Joi.object({
                nome: celebrate_1.Joi.string().min(3).max(100),
                email: celebrate_1.Joi.string().email(),
                senhaAtual: celebrate_1.Joi.string().when('novaSenha', {
                    is: celebrate_1.Joi.exist(),
                    then: celebrate_1.Joi.required(),
                    otherwise: celebrate_1.Joi.optional(),
                }),
                novaSenha: celebrate_1.Joi.string().min(6),
                cargo: celebrate_1.Joi.string(),
            }),
        },
        estudante: {
            criacao: celebrate_1.Joi.object({
                nome: celebrate_1.Joi.string().min(3).max(100).required(),
                dataNascimento: celebrate_1.Joi.date().iso().required(),
                genero: celebrate_1.Joi.string().valid('M', 'F', 'OUTRO').required(),
                anoEscolar: celebrate_1.Joi.string().required(),
                turma: celebrate_1.Joi.string().required(),
                turno: celebrate_1.Joi.string().valid('MANHA', 'TARDE', 'NOITE').required(),
                responsaveis: celebrate_1.Joi.array()
                    .items(celebrate_1.Joi.object({
                    nome: celebrate_1.Joi.string().min(3).max(100).required(),
                    telefone: celebrate_1.Joi.string().required(),
                    email: celebrate_1.Joi.string().email(),
                    tipo: celebrate_1.Joi.string().required(),
                }))
                    .min(1),
                instituicaoId: celebrate_1.Joi.string().uuid().required(),
                observacoes: celebrate_1.Joi.string(),
            }),
        },
        intervencao: {
            criacao: celebrate_1.Joi.object({
                titulo: celebrate_1.Joi.string().min(3).max(100).required(),
                descricao: celebrate_1.Joi.string().required(),
                objetivos: celebrate_1.Joi.string().required(),
                estrategias: celebrate_1.Joi.string().required(),
                recursos: celebrate_1.Joi.string(),
                estudanteId: celebrate_1.Joi.string().uuid().required(),
                dificuldadesIds: celebrate_1.Joi.array().items(celebrate_1.Joi.string().uuid()).min(1).required(),
                responsaveisIds: celebrate_1.Joi.array().items(celebrate_1.Joi.string().uuid()).min(1).required(),
                dataInicio: celebrate_1.Joi.date().iso().required(),
                dataFim: celebrate_1.Joi.date().iso().min(celebrate_1.Joi.ref('dataInicio')),
                observacoes: celebrate_1.Joi.string(),
            }),
            progresso: celebrate_1.Joi.object({
                data: celebrate_1.Joi.date().iso().required(),
                descricao: celebrate_1.Joi.string().required(),
                resultados: celebrate_1.Joi.string(),
                observacoes: celebrate_1.Joi.string(),
            }),
        },
        equipe: {
            criacao: celebrate_1.Joi.object({
                nome: celebrate_1.Joi.string().min(3).max(100).required(),
                descricao: celebrate_1.Joi.string(),
                tipo: celebrate_1.Joi.string().required(),
                instituicaoId: celebrate_1.Joi.string().uuid().required(),
                coordenadorId: celebrate_1.Joi.string().uuid(),
                membrosIds: celebrate_1.Joi.array().items(celebrate_1.Joi.string().uuid()),
            }),
            membro: celebrate_1.Joi.object({
                usuarioId: celebrate_1.Joi.string().uuid().required(),
                funcao: celebrate_1.Joi.string().required(),
                permissoes: celebrate_1.Joi.array().items(celebrate_1.Joi.string()),
            }),
        },
        reuniao: {
            criacao: celebrate_1.Joi.object({
                titulo: celebrate_1.Joi.string().min(3).max(100).required(),
                data: celebrate_1.Joi.date().iso().required(),
                horaInicio: celebrate_1.Joi.string()
                    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
                    .required(),
                horaFim: celebrate_1.Joi.string()
                    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
                    .required(),
                local: celebrate_1.Joi.string().required(),
                pauta: celebrate_1.Joi.string().required(),
                equipeId: celebrate_1.Joi.string().uuid().required(),
                participantesIds: celebrate_1.Joi.array().items(celebrate_1.Joi.string().uuid()).min(1),
                observacoes: celebrate_1.Joi.string(),
            }),
        },
        dificuldade: {
            criacao: celebrate_1.Joi.object({
                nome: celebrate_1.Joi.string().min(3).max(100).required(),
                descricao: celebrate_1.Joi.string().required(),
                tipo: celebrate_1.Joi.string().required(),
                categoria: celebrate_1.Joi.string().required(),
                sintomas: celebrate_1.Joi.string().required(),
            }),
            associacao: celebrate_1.Joi.object({
                observacoes: celebrate_1.Joi.string(),
                dataIdentificacao: celebrate_1.Joi.date().iso(),
            }),
        },
    },
};
//# sourceMappingURL=validation.middleware.js.map