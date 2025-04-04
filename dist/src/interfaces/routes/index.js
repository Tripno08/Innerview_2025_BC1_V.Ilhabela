"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const dashboard_routes_1 = require("./dashboard.routes");
const estudante_routes_1 = require("./estudante.routes");
const equipe_routes_1 = require("./equipe.routes");
const intervencao_routes_1 = require("./intervencao.routes");
const reuniao_routes_1 = require("./reuniao.routes");
const usuario_routes_1 = require("./usuario.routes");
const dificuldade_routes_1 = require("./dificuldade.routes");
const ml_routes_1 = require("./ml.routes");
const routes = (0, express_1.Router)();
exports.routes = routes;
routes.use('/dashboard', dashboard_routes_1.dashboardRoutes);
routes.use('/estudantes', estudante_routes_1.estudanteRoutes);
routes.use('/equipes', equipe_routes_1.equipeRoutes);
routes.use('/intervencoes', intervencao_routes_1.intervencaoRoutes);
routes.use('/reunioes', reuniao_routes_1.reuniaoRoutes);
routes.use('/usuarios', usuario_routes_1.usuarioRoutes);
routes.use('/dificuldades', dificuldade_routes_1.dificuldadeRoutes);
routes.use('/ml', ml_routes_1.mlRoutes);
//# sourceMappingURL=index.js.map