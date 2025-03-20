"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockRbacMiddleware = exports.mockAuthMiddleware = void 0;
const mockAuthMiddleware = (req, _res, next) => {
    req.user = {
        id: 'mock-user-id',
        email: 'usuario@teste.com',
        nome: 'Usuário Teste',
        papel: 'PROFESSOR',
    };
    next();
};
exports.mockAuthMiddleware = mockAuthMiddleware;
const mockRbacMiddleware = (_cargosPermitidos) => {
    return (_req, _res, next) => {
        next();
    };
};
exports.mockRbacMiddleware = mockRbacMiddleware;
//# sourceMappingURL=mock.middleware.js.map