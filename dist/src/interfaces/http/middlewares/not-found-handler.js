"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = notFoundHandler;
const logger_1 = require("@shared/logger");
function notFoundHandler(req, res) {
    const path = `${req.method} ${req.path}`;
    logger_1.logger.info(`Rota não encontrada: ${path}`);
    return res.status(404).json({
        status: 'error',
        code: 'NOT_FOUND',
        message: `Rota não encontrada: ${path}`,
    });
}
//# sourceMappingURL=not-found-handler.js.map