"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const app_error_1 = require("@shared/errors/app-error");
const logger_1 = require("@shared/logger");
const zod_1 = require("zod");
const env_1 = require("@config/env");
function errorHandler(error, _req, res, _next) {
    if (error instanceof app_error_1.AppError) {
        logger_1.logger.warn({
            error: {
                message: error.message,
                code: error.code,
                stack: error.stack,
            }
        }, `[${error.statusCode}] ${error.message}`);
        return res.status(error.statusCode).json({
            status: 'error',
            code: error.code,
            message: error.message,
        });
    }
    if (error instanceof zod_1.ZodError) {
        const message = 'Erro de validação nos dados fornecidos';
        logger_1.logger.warn({
            error: {
                message,
                issues: error.format(),
                stack: error.stack,
            }
        }, `[400] ${message}`);
        return res.status(400).json({
            status: 'error',
            code: 'VALIDATION_ERROR',
            message,
            details: error.format(),
        });
    }
    const message = 'Erro interno do servidor';
    logger_1.logger.error({
        error: {
            message: error.message,
            stack: error.stack,
        }
    }, `[500] ${error.message}`);
    const response = {
        status: 'error',
        code: 'INTERNAL_SERVER_ERROR',
        message: env_1.env.NODE_ENV === 'production' ? message : error.message,
    };
    if (env_1.env.NODE_ENV !== 'production') {
        Object.assign(response, { stack: error.stack });
    }
    return res.status(500).json(response);
}
//# sourceMappingURL=error-handler.js.map