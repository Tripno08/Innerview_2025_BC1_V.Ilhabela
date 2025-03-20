"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rbacMiddleware = rbacMiddleware;
const tsyringe_1 = require("tsyringe");
const app_error_1 = require("../../shared/errors/app-error");
function rbacMiddleware(cargosPermitidos) {
    return async (req, res, next) => {
        if (!req.user) {
            throw new app_error_1.AppError('Usuário não autenticado', 401, 'UNAUTHORIZED');
        }
        try {
            const verificarPermissaoUseCase = tsyringe_1.container.resolve('VerificarPermissaoUseCase');
            const instituicaoId = req.params.instituicaoId || req.body.instituicaoId;
            const temPermissao = await verificarPermissaoUseCase.execute({
                usuarioId: req.user.id,
                instituicaoId,
                cargosPermitidos,
            });
            if (!temPermissao) {
                throw new app_error_1.AppError('Acesso não autorizado', 403, 'FORBIDDEN');
            }
            return next();
        }
        catch (error) {
            if (error instanceof app_error_1.AppError) {
                throw error;
            }
            throw new app_error_1.AppError('Erro ao verificar permissões', 500, 'PERMISSION_ERROR');
        }
    };
}
//# sourceMappingURL=rbac.middleware.js.map