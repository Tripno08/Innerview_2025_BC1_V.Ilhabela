"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUsuarioSchema = exports.atualizarUsuarioSchema = exports.criarUsuarioSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.criarUsuarioSchema = zod_1.z.object({
    nome: zod_1.z
        .string()
        .min(3, 'Nome deve ter pelo menos 3 caracteres')
        .max(100, 'Nome deve ter no máximo 100 caracteres'),
    email: zod_1.z
        .string()
        .email('Email inválido')
        .max(255, 'Email deve ter no máximo 255 caracteres'),
    senha: zod_1.z
        .string()
        .min(6, 'Senha deve ter pelo menos 6 caracteres')
        .max(100, 'Senha deve ter no máximo 100 caracteres'),
    cargo: zod_1.z
        .nativeEnum(client_1.CargoUsuario)
        .optional()
        .default(client_1.CargoUsuario.PROFESSOR),
});
exports.atualizarUsuarioSchema = zod_1.z.object({
    nome: zod_1.z
        .string()
        .min(3, 'Nome deve ter pelo menos 3 caracteres')
        .max(100, 'Nome deve ter no máximo 100 caracteres')
        .optional(),
    email: zod_1.z
        .string()
        .email('Email inválido')
        .max(255, 'Email deve ter no máximo 255 caracteres')
        .optional(),
    senha: zod_1.z
        .string()
        .min(6, 'Senha deve ter pelo menos 6 caracteres')
        .max(100, 'Senha deve ter no máximo 100 caracteres')
        .optional(),
    cargo: zod_1.z
        .nativeEnum(client_1.CargoUsuario)
        .optional(),
});
exports.loginUsuarioSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .email('Email inválido'),
    senha: zod_1.z
        .string()
        .min(1, 'Senha é obrigatória'),
});
//# sourceMappingURL=usuario.validator.js.map