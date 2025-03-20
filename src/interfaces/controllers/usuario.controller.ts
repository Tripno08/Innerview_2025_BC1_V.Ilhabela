import { Request, Response } from 'express';
import { container } from 'tsyringe';
import {
  RegistrarUsuarioUseCase,
  AutenticarUsuarioUseCase,
  AtualizarPerfilUseCase,
  AssociarUsuarioInstituicaoUseCase,
} from '@application/use-cases/usuario';

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Operações relacionadas aos usuários do sistema
 */

/**
 * Controller para as rotas de usuário
 */
export class UsuarioController {
  /**
   * @swagger
   * /usuarios:
   *   post:
   *     summary: Registrar novo usuário
   *     tags: [Usuários]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - nome
   *               - email
   *               - senha
   *               - cargo
   *             properties:
   *               nome:
   *                 type: string
   *               email:
   *                 type: string
   *                 format: email
   *               senha:
   *                 type: string
   *                 format: password
   *               cargo:
   *                 type: string
   *     responses:
   *       201:
   *         description: Usuário registrado com sucesso
   *       400:
   *         description: Dados inválidos
   *       409:
   *         description: Email já está em uso
   */
  async registrar(req: Request, res: Response): Promise<Response> {
    const { nome, email, senha, cargo } = req.body;

    const registrarUsuarioUseCase =
      container.resolve<RegistrarUsuarioUseCase>('RegistrarUsuarioUseCase');

    const { usuario } = await registrarUsuarioUseCase.execute({
      nome,
      email,
      senha,
      cargo,
    });

    return res.status(201).json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      cargo: usuario.cargo,
    });
  }

  /**
   * @swagger
   * /usuarios/autenticacao:
   *   post:
   *     summary: Autenticar usuário
   *     tags: [Usuários]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - senha
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               senha:
   *                 type: string
   *                 format: password
   *     responses:
   *       200:
   *         description: Usuário autenticado com sucesso
   *       400:
   *         description: Dados inválidos
   *       401:
   *         description: Credenciais inválidas
   */
  async autenticar(req: Request, res: Response): Promise<Response> {
    const { email, senha } = req.body;

    const autenticarUsuarioUseCase = container.resolve<AutenticarUsuarioUseCase>(
      'AutenticarUsuarioUseCase',
    );

    const { usuario, token } = await autenticarUsuarioUseCase.execute({
      email,
      senha,
    });

    return res.json({
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        cargo: usuario.cargo,
      },
      token,
    });
  }

  /**
   * @swagger
   * /usuarios/perfil:
   *   get:
   *     summary: Obter perfil do usuário
   *     tags: [Usuários]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Perfil do usuário
   *       401:
   *         description: Não autenticado
   */
  async obterPerfil(req: Request, res: Response): Promise<Response> {
    return res.json({
      id: req.user.id,
      email: req.user.email,
      cargo: req.user.cargo,
    });
  }

  /**
   * @swagger
   * /usuarios/perfil:
   *   put:
   *     summary: Atualizar perfil
   *     tags: [Usuários]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               nome:
   *                 type: string
   *               email:
   *                 type: string
   *                 format: email
   *               senhaAtual:
   *                 type: string
   *                 format: password
   *               novaSenha:
   *                 type: string
   *                 format: password
   *               cargo:
   *                 type: string
   *     responses:
   *       200:
   *         description: Perfil atualizado com sucesso
   *       400:
   *         description: Dados inválidos
   *       401:
   *         description: Não autenticado
   *       403:
   *         description: Senha atual incorreta
   *       409:
   *         description: Email já está em uso
   */
  async atualizarPerfil(req: Request, res: Response): Promise<Response> {
    const { nome, email, senhaAtual, novaSenha, cargo } = req.body;

    const atualizarPerfilUseCase =
      container.resolve<AtualizarPerfilUseCase>('AtualizarPerfilUseCase');

    const usuarioAtualizado = await atualizarPerfilUseCase.execute({
      usuarioId: req.user.id,
      nome,
      email,
      senhaAtual,
      novaSenha,
      cargo,
    });

    return res.json({
      id: usuarioAtualizado.id,
      nome: usuarioAtualizado.nome,
      email: usuarioAtualizado.email,
      cargo: usuarioAtualizado.cargo,
    });
  }

  /**
   * @swagger
   * /usuarios/instituicao:
   *   post:
   *     summary: Associar usuário a uma instituição
   *     tags: [Usuários]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - instituicaoId
   *             properties:
   *               instituicaoId:
   *                 type: string
   *                 format: uuid
   *               usuarioId:
   *                 type: string
   *                 format: uuid
   *               cargo:
   *                 type: string
   *     responses:
   *       204:
   *         description: Usuário associado com sucesso
   *       400:
   *         description: Dados inválidos
   *       401:
   *         description: Não autenticado
   *       403:
   *         description: Não autorizado
   *       404:
   *         description: Instituição ou usuário não encontrado
   *       409:
   *         description: Usuário já está associado a esta instituição
   */
  async associarAInstituicao(req: Request, res: Response): Promise<Response> {
    const { instituicaoId, usuarioId, cargo } = req.body;

    const associarUsuarioInstituicaoUseCase = container.resolve<AssociarUsuarioInstituicaoUseCase>(
      'AssociarUsuarioInstituicaoUseCase',
    );

    await associarUsuarioInstituicaoUseCase.execute({
      usuarioId: usuarioId || req.user.id,
      instituicaoId,
      cargo,
    });

    return res.status(204).json();
  }
}
