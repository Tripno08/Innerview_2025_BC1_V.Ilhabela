"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
require("reflect-metadata");
const env_1 = require("@config/env");
const error_handler_1 = require("@interfaces/http/middlewares/error-handler");
const not_found_handler_1 = require("@interfaces/http/middlewares/not-found-handler");
const routes_1 = require("@interfaces/routes");
const logger_1 = require("@shared/logger");
const container_1 = require("@shared/container");
(0, container_1.registerDependencies)();
const app = (0, express_1.default)();
exports.app = app;
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use((0, cors_1.default)({
    origin: env_1.env.CORS_ORIGINS.split(','),
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)('dev', {
    stream: {
        write: (message) => logger_1.logger.http(message.trim()),
    },
}));
app.use(env_1.env.API_PREFIX, routes_1.routes);
app.use(not_found_handler_1.notFoundHandler);
app.use(error_handler_1.errorHandler);
//# sourceMappingURL=app.js.map