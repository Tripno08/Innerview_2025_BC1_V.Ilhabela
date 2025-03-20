"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerAuthMiddleware = void 0;
const env_1 = require("@config/env");
const swaggerAuthMiddleware = (req, res, next) => {
    const isSwaggerRoute = req.path.startsWith('/api-docs');
    if (isSwaggerRoute && env_1.env.NODE_ENV === 'production') {
        const auth = req.headers.authorization;
        if (!auth || !isValidBasicAuth(auth)) {
            res
                .status(401)
                .set('WWW-Authenticate', 'Basic realm="Innerview API Documentation"')
                .send('Não autorizado');
            return;
        }
    }
    next();
};
exports.swaggerAuthMiddleware = swaggerAuthMiddleware;
function isValidBasicAuth(auth) {
    if (!auth.startsWith('Basic ')) {
        return false;
    }
    try {
        const base64Credentials = auth.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
        const [username, password] = credentials.split(':');
        const validUsername = env_1.env.SWAGGER_USERNAME || 'admin';
        const validPassword = env_1.env.SWAGGER_PASSWORD || 'innerview';
        return username === validUsername && password === validPassword;
    }
    catch (error) {
        return false;
    }
}
//# sourceMappingURL=swagger.middleware.js.map