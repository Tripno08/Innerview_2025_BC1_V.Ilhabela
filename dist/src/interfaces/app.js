"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = require("body-parser");
require("reflect-metadata");
require("@shared/container");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const usuario_routes_1 = require("@interfaces/routes/usuario.routes");
const intervencao_routes_1 = require("@interfaces/routes/intervencao.routes");
const estudante_routes_1 = require("@interfaces/routes/estudante.routes");
const ml_routes_1 = require("@interfaces/routes/ml.routes");
class App {
    express;
    constructor() {
        this.express = (0, express_1.default)();
        this.middlewares();
        this.routes();
        this.documentation();
    }
    middlewares() {
        this.express.use((0, helmet_1.default)());
        this.express.use((0, cors_1.default)());
        this.express.use((0, body_parser_1.json)());
        this.express.use((0, morgan_1.default)('dev'));
    }
    routes() {
        this.express.use('/usuarios', usuario_routes_1.usuarioRoutes);
        this.express.use('/intervencoes', intervencao_routes_1.intervencaoRoutes);
        this.express.use('/estudantes', estudante_routes_1.estudanteRoutes);
        this.express.use('/ml', ml_routes_1.mlRoutes);
    }
    documentation() {
        const swaggerOptions = {
            openapi: '3.0.0',
            info: {
                title: 'API Innerview Ilhabela',
                version: '1.0.0',
                description: 'API para o sistema Innerview de acompanhamento e intervenção educacional',
            },
        };
        this.express.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerOptions));
    }
}
exports.default = new App().express;
//# sourceMappingURL=app.js.map