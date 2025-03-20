"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthRoutes = void 0;
const express_1 = require("express");
const health_controller_1 = require("@interfaces/http/controllers/health.controller");
const healthRoutes = (0, express_1.Router)();
exports.healthRoutes = healthRoutes;
const healthController = new health_controller_1.HealthController();
healthRoutes.get('/', (req, res) => healthController.check(req, res));
healthRoutes.get('/details', (req, res) => healthController.details(req, res));
//# sourceMappingURL=health.routes.js.map