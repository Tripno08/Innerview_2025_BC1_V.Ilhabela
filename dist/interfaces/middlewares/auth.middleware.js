"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const tsyringe_1 = require("tsyringe");
const app_error_1 = require("@shared/errors/app-error");
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new app_error_1.AppError('Token não fornecido', 401, 'TOKEN_MISSING');
    }
    const [, token] = authHeader.split(' ');
    try {
        const jwtService = tsyringe_1.container.resolve('JwtService');
        const decoded = jwtService.verify(token);
        req.user = {
            id: decoded.sub,
            email: decoded.email,
            cargo: decoded.cargo,
        };
        return next();
    }
    catch (error) {
        throw new app_error_1.AppError('Token inválido ou expirado', 401, 'INVALID_TOKEN');
    }
}
//# sourceMappingURL=auth.middleware.js.map