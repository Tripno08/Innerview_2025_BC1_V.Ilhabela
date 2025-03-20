"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthService = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const tsyringe_1 = require("tsyringe");
const app_error_1 = require("@shared/errors/app-error");
const env_1 = require("@config/env");
let JwtAuthService = class JwtAuthService {
    generateToken(payload) {
        const { sub, ...restPayload } = payload;
        const secret = String(env_1.env.JWT_SECRET);
        const expiresIn = env_1.env.JWT_EXPIRATION || '1d';
        const options = {
            subject: sub,
            expiresIn: expiresIn,
        };
        return (0, jsonwebtoken_1.sign)(restPayload, secret, options);
    }
    verifyToken(token) {
        try {
            const secret = String(env_1.env.JWT_SECRET);
            const decoded = (0, jsonwebtoken_1.verify)(token, secret);
            return decoded;
        }
        catch (error) {
            throw new app_error_1.AppError('Token inválido ou expirado', 401, 'INVALID_TOKEN');
        }
    }
    extractTokenFromHeader(authorizationHeader) {
        if (!authorizationHeader) {
            throw new app_error_1.AppError('Token não fornecido', 401, 'TOKEN_MISSING');
        }
        const [type, token] = authorizationHeader.split(' ');
        if (type !== 'Bearer') {
            throw new app_error_1.AppError('Tipo de token inválido', 401, 'INVALID_TOKEN_TYPE');
        }
        return token;
    }
};
exports.JwtAuthService = JwtAuthService;
exports.JwtAuthService = JwtAuthService = __decorate([
    (0, tsyringe_1.injectable)()
], JwtAuthService);
//# sourceMappingURL=JwtAuthService.js.map