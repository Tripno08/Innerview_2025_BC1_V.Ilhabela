"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usuarioRoutes = void 0;
const express_1 = require("express");
const usuario_controller_1 = require("@interfaces/http/controllers/usuario.controller");
const auth_middleware_1 = require("@interfaces/http/middlewares/auth-middleware");
const usuarioRoutes = (0, express_1.Router)();
exports.usuarioRoutes = usuarioRoutes;
const usuarioController = new usuario_controller_1.UsuarioController();
usuarioRoutes.post('/login', (req, res) => usuarioController.login(req, res));
usuarioRoutes.post('/refresh-token', (req, res) => usuarioController.refreshToken(req, res));
usuarioRoutes.use(auth_middleware_1.authMiddleware);
usuarioRoutes.get('/', (req, res) => usuarioController.findAll(req, res));
usuarioRoutes.get('/:id', (req, res) => usuarioController.findById(req, res));
usuarioRoutes.post('/', (req, res) => usuarioController.create(req, res));
usuarioRoutes.put('/:id', (req, res) => usuarioController.update(req, res));
usuarioRoutes.delete('/:id', (req, res) => usuarioController.delete(req, res));
//# sourceMappingURL=usuario.routes.js.map