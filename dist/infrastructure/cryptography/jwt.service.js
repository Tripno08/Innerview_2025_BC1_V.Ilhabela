"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtService = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const index_1 = __importDefault(require("@config/index"));
class JwtService {
    sign(payload, options) {
        const secret = index_1.default.jwt.secret;
        return (0, jsonwebtoken_1.sign)(payload, secret, {
            expiresIn: index_1.default.jwt.expiresIn,
            ...options,
        });
    }
    verify(token) {
        const secret = index_1.default.jwt.secret;
        return (0, jsonwebtoken_1.verify)(token, secret);
    }
}
exports.JwtService = JwtService;
//# sourceMappingURL=jwt.service.js.map