import { Request, Response } from 'express';
import { logger } from '@shared/logger';
import { UsuarioRepository } from '@infrastructure/repositories/usuario.repository';
import { CriarUsuarioUseCase } from '@application/use-cases/usuario/criar-usuario.use-case';
import { AppError } from '@shared/errors/app-error';
import { ZodError } from 'zod';
import {
  criarUsuarioSchema,
  atualizarUsuarioSchema,
  loginUsuarioSchema,
} from '@interfaces/http/validators/usuario.validator';
import jwt from 'jsonwebtoken';
import { compare } from 'bcryptjs';
import { env } from '@config/env';
import type { StringValue } from 'ms';

export class UsuarioController {
  private usuarioRepository: UsuarioRepository;

  constructor() {
    this.usuarioRepository = new UsuarioRepository();
  }

  /**
   * Buscar todos os usuários
   */
  async findAll(_req: Request, res: Response): Promise<Response> {
    logger.debug('Buscando todos os usuários');

    const usuarios = await this.usuarioRepository.findAll();

    return res.status(200).json(usuarios);
  }

  /**
   * Buscar usuário por ID
   */
  async findById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    logger.debug(`Buscando usuário com ID: ${id}`);

    const usuario = await this.usuarioRepository.findById(id);

    if (!usuario) {
      throw new AppError('Usuário não encontrado', 404, 'USER_NOT_FOUND');
    }

    return res.status(200).json(usuario);
  }

  /**
   * Criar um novo usuário
   */
  async create(req: Request, res: Response): Promise<Response> {
    try {
      // Validar dados de entrada
      const validatedData = criarUsuarioSchema.parse(req.body);

      logger.debug(`Criando novo usuário: ${validatedData.email}`);

      // Executar caso de uso
      const criarUsuarioUseCase = new CriarUsuarioUseCase(this.usuarioRepository);
      const usuario = await criarUsuarioUseCase.execute(validatedData);

      return res.status(201).json(usuario);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new AppError(
          'Dados inválidos para criação de usuário',
          400,
          'VALIDATION_ERROR',
          true,
        );
      }
      throw error;
    }
  }

  /**
   * Atualizar um usuário existente
   */
  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const validatedData = atualizarUsuarioSchema.parse(req.body);

      logger.debug(`Atualizando usuário com ID: ${id}`);

      const usuario = await this.usuarioRepository.update(id, validatedData);

      return res.status(200).json(usuario);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new AppError(
          'Dados inválidos para atualização de usuário',
          400,
          'VALIDATION_ERROR',
          true,
        );
      }
      throw error;
    }
  }

  /**
   * Remover um usuário
   */
  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    logger.debug(`Removendo usuário com ID: ${id}`);

    await this.usuarioRepository.delete(id);

    return res.status(204).send();
  }

  /**
   * Login de usuário
   */
  async login(req: Request, res: Response): Promise<Response> {
    try {
      const validatedData = loginUsuarioSchema.parse(req.body);

      logger.debug(`Tentativa de login: ${validatedData.email}`);

      // Buscar usuário com credenciais pelo email
      const usuarioComCredenciais = await this.usuarioRepository.findWithCredentials(
        validatedData.email,
      );

      if (!usuarioComCredenciais) {
        throw new AppError('Email ou senha inválidos', 401, 'INVALID_CREDENTIALS');
      }

      // Verificar senha
      const senhaCorreta = await compare(validatedData.senha, usuarioComCredenciais.senha || '');

      if (!senhaCorreta) {
        throw new AppError('Email ou senha inválidos', 401, 'INVALID_CREDENTIALS');
      }

      // Gerar token JWT
      const token = jwt.sign(
        {
          sub: usuarioComCredenciais.id,
          email: usuarioComCredenciais.email,
          name: usuarioComCredenciais.nome,
          role: usuarioComCredenciais.cargo,
        },
        env.JWT_SECRET,
        {
          expiresIn: env.JWT_EXPIRATION as StringValue | number,
        },
      );

      return res.status(200).json({
        usuario: {
          id: usuarioComCredenciais.id,
          nome: usuarioComCredenciais.nome,
          email: usuarioComCredenciais.email,
          cargo: usuarioComCredenciais.cargo,
        },
        token,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        throw new AppError('Dados inválidos para login', 400, 'VALIDATION_ERROR', true);
      }
      throw error;
    }
  }

  /**
   * Refresh token
   */
  async refreshToken(req: Request, res: Response): Promise<Response> {
    try {
      const { token } = req.body;

      if (!token) {
        throw new AppError('Token não fornecido', 400, 'TOKEN_REQUIRED');
      }

      // Verificar token
      const decoded = jwt.verify(token, env.JWT_SECRET) as {
        sub: string;
        email: string;
        name: string;
        role: string;
      };

      // Buscar usuário
      const usuario = await this.usuarioRepository.findById(decoded.sub);

      if (!usuario) {
        throw new AppError('Usuário não encontrado', 404, 'USER_NOT_FOUND');
      }

      // Gerar novo token
      const newToken = jwt.sign(
        {
          sub: usuario.id,
          email: usuario.email,
          name: usuario.nome,
          role: usuario.cargo,
        },
        env.JWT_SECRET,
        {
          expiresIn: env.JWT_EXPIRATION as StringValue | number,
        },
      );

      return res.status(200).json({
        token: newToken,
      });
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError('Token inválido ou expirado', 401, 'INVALID_TOKEN');
      }
      throw error;
    }
  }
}
