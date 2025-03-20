"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const usuario_routes_1 = require("./usuario.routes");
const estudante_routes_1 = require("./estudante.routes");
const routes = (0, express_1.Router)();
exports.routes = routes;
routes.use('/usuarios', usuario_routes_1.usuarioRoutes);
routes.use('/estudantes', estudante_routes_1.estudanteRoutes);
//# sourceMappingURL=index.js.map