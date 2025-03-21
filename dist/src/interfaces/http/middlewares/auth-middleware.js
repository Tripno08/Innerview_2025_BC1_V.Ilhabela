"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureAuthenticated = ensureAuthenticated;
const jsonwebtoken_1 = require("jsonwebtoken");
const app_error_1 = require("@shared/errors/app-error");
const env_1 = require("@config/env");
const logger_1 = require("@shared/logger");
const enum_mappers_1 = require("@shared/utils/enum-mappers");
function ensureAuthenticated(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new app_error_1.AppError('Token JWT não encontrado', 401, 'TOKEN_MISSING');
    }
    const [, token] = authHeader.split(' ');
    try {
        const decoded = (0, jsonwebtoken_1.verify)(token, env_1.env.JWT_SECRET);
        const cargoLocal = (0, enum_mappers_1.mapCargoFromPrisma)(decoded.cargo);
        req.user = {
            id: decoded.sub,
            email: decoded.email,
            cargo: cargoLocal,
        };
        logger_1.logger.debug(`Usuário autenticado: ${decoded.sub}`);
        return next();
    }
    catch (error) {
        throw new app_error_1.AppError('Token JWT inválido', 401, 'TOKEN_INVALID');
    }
}
//# sourceMappingURL=auth-middleware.js.map