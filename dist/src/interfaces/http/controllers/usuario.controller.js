"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioController = void 0;
const logger_1 = require("@shared/logger");
const usuario_repository_1 = require("@infrastructure/repositories/usuario.repository");
const criar_usuario_use_case_1 = require("@application/use-cases/usuario/criar-usuario.use-case");
const app_error_1 = require("@shared/errors/app-error");
const zod_1 = require("zod");
const usuario_validator_1 = require("@interfaces/http/validators/usuario.validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = require("bcryptjs");
const env_1 = require("@config/env");
class UsuarioController {
    usuarioRepository;
    constructor() {
        this.usuarioRepository = new usuario_repository_1.UsuarioRepository();
    }
    async findAll(_req, res) {
        logger_1.logger.debug('Buscando todos os usuários');
        const usuarios = await this.usuarioRepository.findAll();
        return res.status(200).json(usuarios);
    }
    async findById(req, res) {
        const { id } = req.params;
        logger_1.logger.debug(`Buscando usuário com ID: ${id}`);
        const usuario = await this.usuarioRepository.findById(id);
        if (!usuario) {
            throw new app_error_1.AppError('Usuário não encontrado', 404, 'USER_NOT_FOUND');
        }
        return res.status(200).json(usuario);
    }
    async create(req, res) {
        try {
            const validatedData = usuario_validator_1.criarUsuarioSchema.parse(req.body);
            logger_1.logger.debug(`Criando novo usuário: ${validatedData.email}`);
            const criarUsuarioUseCase = new criar_usuario_use_case_1.CriarUsuarioUseCase(this.usuarioRepository);
            const usuario = await criarUsuarioUseCase.execute(validatedData);
            return res.status(201).json(usuario);
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                throw new app_error_1.AppError('Dados inválidos para criação de usuário', 400, 'VALIDATION_ERROR', true);
            }
            throw error;
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params;
            const validatedData = usuario_validator_1.atualizarUsuarioSchema.parse(req.body);
            logger_1.logger.debug(`Atualizando usuário com ID: ${id}`);
            const usuario = await this.usuarioRepository.update(id, validatedData);
            return res.status(200).json(usuario);
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                throw new app_error_1.AppError('Dados inválidos para atualização de usuário', 400, 'VALIDATION_ERROR', true);
            }
            throw error;
        }
    }
    async delete(req, res) {
        const { id } = req.params;
        logger_1.logger.debug(`Removendo usuário com ID: ${id}`);
        await this.usuarioRepository.delete(id);
        return res.status(204).send();
    }
    async login(req, res) {
        try {
            const validatedData = usuario_validator_1.loginUsuarioSchema.parse(req.body);
            logger_1.logger.debug(`Tentativa de login: ${validatedData.email}`);
            const usuarioComCredenciais = await this.usuarioRepository.findWithCredentials(validatedData.email);
            if (!usuarioComCredenciais) {
                throw new app_error_1.AppError('Email ou senha inválidos', 401, 'INVALID_CREDENTIALS');
            }
            const senhaCorreta = await (0, bcryptjs_1.compare)(validatedData.senha, usuarioComCredenciais.senha || '');
            if (!senhaCorreta) {
                throw new app_error_1.AppError('Email ou senha inválidos', 401, 'INVALID_CREDENTIALS');
            }
            const token = jsonwebtoken_1.default.sign({
                sub: usuarioComCredenciais.id,
                email: usuarioComCredenciais.email,
                name: usuarioComCredenciais.nome,
                role: usuarioComCredenciais.cargo,
            }, env_1.env.JWT_SECRET, {
                expiresIn: env_1.env.JWT_EXPIRATION,
            });
            return res.status(200).json({
                usuario: {
                    id: usuarioComCredenciais.id,
                    nome: usuarioComCredenciais.nome,
                    email: usuarioComCredenciais.email,
                    cargo: usuarioComCredenciais.cargo,
                },
                token,
            });
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                throw new app_error_1.AppError('Dados inválidos para login', 400, 'VALIDATION_ERROR', true);
            }
            throw error;
        }
    }
    async refreshToken(req, res) {
        try {
            const { token } = req.body;
            if (!token) {
                throw new app_error_1.AppError('Token não fornecido', 400, 'TOKEN_REQUIRED');
            }
            const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
            const usuario = await this.usuarioRepository.findById(decoded.sub);
            if (!usuario) {
                throw new app_error_1.AppError('Usuário não encontrado', 404, 'USER_NOT_FOUND');
            }
            const newToken = jsonwebtoken_1.default.sign({
                sub: usuario.id,
                email: usuario.email,
                name: usuario.nome,
                role: usuario.cargo,
            }, env_1.env.JWT_SECRET, {
                expiresIn: env_1.env.JWT_EXPIRATION,
            });
            return res.status(200).json({
                token: newToken,
            });
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                throw new app_error_1.AppError('Token inválido ou expirado', 401, 'INVALID_TOKEN');
            }
            throw error;
        }
    }
}
exports.UsuarioController = UsuarioController;
//# sourceMappingURL=usuario.controller.js.map