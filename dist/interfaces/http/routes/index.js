"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const health_routes_1 = require("./health.routes");
const usuario_routes_1 = require("./usuario.routes");
const reuniao_routes_1 = __importDefault(require("./reuniao.routes"));
const router = (0, express_1.Router)();
exports.router = router;
router.use('/health', health_routes_1.healthRoutes);
router.use('/usuarios', usuario_routes_1.usuarioRoutes);
router.use('/reunioes', reuniao_routes_1.default);
//# sourceMappingURL=index.js.map