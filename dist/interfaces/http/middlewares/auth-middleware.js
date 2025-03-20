"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const app_error_1 = require("@shared/errors/app-error");
const env_1 = require("@config/env");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = require("@shared/logger");
function authMiddleware(req, _res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new app_error_1.AppError('Token não fornecido', 401, 'TOKEN_REQUIRED');
    }
    const parts = authHeader.split(' ');
    if (parts.length !== 2) {
        throw new app_error_1.AppError('Token em formato inválido', 401, 'INVALID_TOKEN_FORMAT');
    }
    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme)) {
        throw new app_error_1.AppError('Token em formato inválido', 401, 'INVALID_TOKEN_FORMAT');
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        req.user = decoded;
        logger_1.logger.debug(`Usuário autenticado: ${decoded.sub}`);
        return next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            throw new app_error_1.AppError('Token expirado', 401, 'TOKEN_EXPIRED');
        }
        throw new app_error_1.AppError('Token inválido', 401, 'INVALID_TOKEN');
    }
}
//# sourceMappingURL=auth-middleware.js.map