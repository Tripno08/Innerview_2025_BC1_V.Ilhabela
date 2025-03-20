import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { IUseCase } from '@application/interfaces/IUseCase';

/**
 * @swagger
 * tags:
 *   name: Intervenções
 *   description: Operações relacionadas às intervenções pedagógicas
 */

/**
 * Controller para as rotas de intervenção
 */
export class IntervencaoController {
  /**
   * @swagger
   * /intervencoes:
   *   get:
   *     summary: Listar intervenções
   *     tags: [Intervenções]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: estudanteId
   *         in: query
   *         description: ID do estudante
   *         schema:
   *           type: string
   *           format: uuid
   *       - name: equipeId
   *         in: query
   *         description: ID da equipe
   *         schema:
   *           type: string
   *           format: uuid
   *       - name: status
   *         in: query
   *         description: Status das intervenções
   *         schema:
   *           type: string
   *           enum: [EM_ANDAMENTO, CONCLUIDA, CANCELADA]
   *       - name: tipo
   *         in: query
   *         description: Tipo de intervenção
   *         schema:
   *           type: string
   *           enum: [PEDAGOGICA, COMPORTAMENTAL, PSICOLOGICA, SOCIAL, MULTIDISCIPLINAR, OUTRA]
   *     responses:
   *       200:
   *         description: Lista de intervenções
   */
  async listar(req: Request, res: Response): Promise<Response> {
    const { estudanteId, equipeId, status, tipo, page, limit } = req.query;

    const listarIntervencoesUseCase = container.resolve<IUseCase<any, any>>(
      'ListarIntervencoesUseCase',
    );

    const intervencoes = await listarIntervencoesUseCase.execute({
      estudanteId: estudanteId as string,
      equipeId: equipeId as string,
      status: status as string,
      tipo: tipo as string,
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 20,
      usuarioId: req.user.id,
    });

    return res.json(intervencoes);
  }

  /**
   * @swagger
   * /intervencoes/{id}:
   *   get:
   *     summary: Obter detalhes de uma intervenção
   *     tags: [Intervenções]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: ID da intervenção
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: Detalhes da intervenção
   *       404:
   *         description: Intervenção não encontrada
   */
  async detalhar(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const detalharIntervencaoUseCase = container.resolve<IUseCase<any, any>>(
      'DetalharIntervencaoUseCase',
    );

    const intervencao = await detalharIntervencaoUseCase.execute({
      id,
      usuarioId: req.user.id,
    });

    return res.json(intervencao);
  }

  /**
   * @swagger
   * /intervencoes:
   *   post:
   *     summary: Criar uma nova intervenção
   *     tags: [Intervenções]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - estudanteId
   *               - tipo
   *               - descricao
   *             properties:
   *               estudanteId:
   *                 type: string
   *                 format: uuid
   *                 description: ID do estudante
   *               intervencaoBaseId:
   *                 type: string
   *                 format: uuid
   *                 description: ID da intervenção base (modelo do catálogo)
   *               tipo:
   *                 type: string
   *                 enum: [PEDAGOGICA, COMPORTAMENTAL, PSICOLOGICA, SOCIAL, MULTIDISCIPLINAR, OUTRA]
   *                 description: Tipo da intervenção
   *               descricao:
   *                 type: string
   *                 description: Descrição da intervenção
   *               dataInicio:
   *                 type: string
   *                 format: date-time
   *                 description: Data de início da intervenção
   *               observacoes:
   *                 type: string
   *                 description: Observações adicionais
   *     responses:
   *       201:
   *         description: Intervenção criada com sucesso
   */
  async criar(req: Request, res: Response): Promise<Response> {
    const criarIntervencaoUseCase =
      container.resolve<IUseCase<any, any>>('CriarIntervencaoUseCase');

    const intervencao = await criarIntervencaoUseCase.execute({
      ...req.body,
      usuarioId: req.user.id,
    });

    return res.status(201).json(intervencao);
  }

  /**
   * @swagger
   * /intervencoes/{id}:
   *   put:
   *     summary: Atualizar uma intervenção
   *     tags: [Intervenções]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: ID da intervenção
   *         schema:
   *           type: string
   *           format: uuid
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               tipo:
   *                 type: string
   *                 enum: [PEDAGOGICA, COMPORTAMENTAL, PSICOLOGICA, SOCIAL, MULTIDISCIPLINAR, OUTRA]
   *                 description: Tipo da intervenção
   *               descricao:
   *                 type: string
   *                 description: Descrição da intervenção
   *               dataInicio:
   *                 type: string
   *                 format: date-time
   *                 description: Data de início da intervenção
   *               dataFim:
   *                 type: string
   *                 format: date-time
   *                 description: Data de término da intervenção
   *               status:
   *                 type: string
   *                 enum: [EM_ANDAMENTO, CONCLUIDA, CANCELADA]
   *                 description: Status da intervenção
   *               observacoes:
   *                 type: string
   *                 description: Observações adicionais
   *     responses:
   *       200:
   *         description: Intervenção atualizada com sucesso
   *       404:
   *         description: Intervenção não encontrada
   */
  async atualizar(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const atualizarIntervencaoUseCase = container.resolve<IUseCase<any, any>>(
      'AtualizarIntervencaoUseCase',
    );

    const intervencao = await atualizarIntervencaoUseCase.execute({
      id,
      ...req.body,
      usuarioId: req.user.id,
    });

    return res.json(intervencao);
  }

  /**
   * @swagger
   * /intervencoes/{id}/progresso:
   *   post:
   *     summary: Registrar progresso de uma intervenção
   *     tags: [Intervenções]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: ID da intervenção
   *         schema:
   *           type: string
   *           format: uuid
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - valor
   *             properties:
   *               valor:
   *                 type: number
   *                 description: Valor do progresso (0-100)
   *                 minimum: 0
   *                 maximum: 100
   *               observacao:
   *                 type: string
   *                 description: Observação sobre o progresso
   *     responses:
   *       200:
   *         description: Progresso registrado com sucesso
   *       404:
   *         description: Intervenção não encontrada
   */
  async registrarProgresso(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { valor, observacao } = req.body;

    const registrarProgressoIntervencaoUseCase = container.resolve<IUseCase<any, any>>(
      'RegistrarProgressoIntervencaoUseCase',
    );

    const progresso = await registrarProgressoIntervencaoUseCase.execute({
      intervencaoId: id,
      valor,
      observacao,
      usuarioId: req.user.id,
    });

    return res.json(progresso);
  }

  /**
   * @swagger
   * /intervencoes/{id}/avaliar:
   *   post:
   *     summary: Avaliar eficácia de uma intervenção
   *     tags: [Intervenções]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: ID da intervenção
   *         schema:
   *           type: string
   *           format: uuid
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - nota
   *             properties:
   *               nota:
   *                 type: number
   *                 description: Nota de eficácia (1-5)
   *                 minimum: 1
   *                 maximum: 5
   *               observacao:
   *                 type: string
   *                 description: Observação sobre a avaliação
   *     responses:
   *       200:
   *         description: Avaliação registrada com sucesso
   *       404:
   *         description: Intervenção não encontrada
   */
  async avaliarEficacia(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { nota, observacao } = req.body;

    const avaliarEficaciaIntervencaoUseCase = container.resolve<IUseCase<any, any>>(
      'AvaliarEficaciaIntervencaoUseCase',
    );

    const avaliacao = await avaliarEficaciaIntervencaoUseCase.execute({
      intervencaoId: id,
      nota,
      observacao,
      usuarioId: req.user.id,
    });

    return res.json(avaliacao);
  }

  /**
   * @swagger
   * /intervencoes/{id}:
   *   delete:
   *     summary: Excluir uma intervenção
   *     tags: [Intervenções]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: ID da intervenção
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       204:
   *         description: Intervenção excluída com sucesso
   *       404:
   *         description: Intervenção não encontrada
   */
  async excluir(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const excluirIntervencaoUseCase = container.resolve<IUseCase<any, any>>(
      'ExcluirIntervencaoUseCase',
    );

    await excluirIntervencaoUseCase.execute({
      id,
      usuarioId: req.user.id,
    });

    return res.status(204).send();
  }
}
