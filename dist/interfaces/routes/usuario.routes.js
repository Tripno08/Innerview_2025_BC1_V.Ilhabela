"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usuarioRoutes = void 0;
const express_1 = require("express");
const usuario_controller_1 = require("@interfaces/controllers/usuario.controller");
const auth_middleware_1 = require("@interfaces/middlewares/auth.middleware");
const rbac_middleware_1 = require("@interfaces/middlewares/rbac.middleware");
const client_1 = require("@prisma/client");
const usuarioRoutes = (0, express_1.Router)();
exports.usuarioRoutes = usuarioRoutes;
const usuarioController = new usuario_controller_1.UsuarioController();
usuarioRoutes.post('/registrar', usuarioController.registrar);
usuarioRoutes.post('/autenticar', usuarioController.autenticar);
usuarioRoutes.use(auth_middleware_1.authMiddleware);
usuarioRoutes.get('/perfil', usuarioController.obterPerfil);
usuarioRoutes.put('/perfil', usuarioController.atualizarPerfil);
usuarioRoutes.post('/instituicao', (0, rbac_middleware_1.rbacMiddleware)([client_1.CargoUsuario.ADMINISTRADOR, client_1.CargoUsuario.DIRETOR, client_1.CargoUsuario.COORDENADOR]), usuarioController.associarAInstituicao);
//# sourceMappingURL=usuario.routes.js.map