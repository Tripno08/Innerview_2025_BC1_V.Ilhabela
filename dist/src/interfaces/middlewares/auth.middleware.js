"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = require("jsonwebtoken");
const app_error_1 = require("@shared/errors/app-error");
const enum_mappers_1 = require("@shared/utils/enum-mappers");
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new app_error_1.AppError('Token não fornecido', 401, 'TOKEN_MISSING');
    }
    const [, token] = authHeader.split(' ');
    try {
        const decoded = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
        const cargoLocal = (0, enum_mappers_1.mapCargoFromPrisma)(decoded.cargo);
        req.user = {
            id: String(decoded.sub),
            email: decoded.email,
            cargo: cargoLocal,
        };
        return next();
    }
    catch (error) {
        throw new app_error_1.AppError('Token inválido ou expirado', 401, 'INVALID_TOKEN');
    }
}
//# sourceMappingURL=auth.middleware.js.map