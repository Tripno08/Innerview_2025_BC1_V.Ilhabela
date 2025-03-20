"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
require("reflect-metadata");
require("express-async-errors");
const app_1 = require("./app");
const env_1 = require("@config/env");
const logger_1 = require("@shared/logger");
const PORT = env_1.env.PORT || 3000;
const server = app_1.app.listen(PORT, () => {
    logger_1.logger.info(`Servidor iniciado na porta ${PORT}`);
    logger_1.logger.info(`Ambiente: ${env_1.env.NODE_ENV}`);
    logger_1.logger.info(`Acesse: http://localhost:${PORT}${env_1.env.API_PREFIX}`);
});
exports.server = server;
process.on('unhandledRejection', (reason) => {
    logger_1.logger.error('Rejeição não tratada:', reason);
    process.exit(1);
});
process.on('uncaughtException', (error) => {
    logger_1.logger.error('Exceção não capturada:', error);
    process.exit(1);
});
process.on('SIGTERM', () => {
    logger_1.logger.info('SIGTERM recebido. Encerrando servidor...');
    server.close(() => {
        logger_1.logger.info('Servidor encerrado');
        process.exit(0);
    });
});
//# sourceMappingURL=server.js.map