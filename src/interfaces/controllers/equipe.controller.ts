import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { IUseCase } from '@application/interfaces/IUseCase';

/**
 * Controller para as rotas de equipe
 */
export class EquipeController {
  /**
   * Listar equipes com filtros
   */
  async listar(req: Request, res: Response): Promise<Response> {
    const { instituicaoId, usuarioId, tipo } = req.query;

    const listarEquipesUseCase = container.resolve<IUseCase<any, any>>('ListarEquipesUseCase');

    const equipes = await listarEquipesUseCase.execute({
      instituicaoId: instituicaoId as string,
      usuarioId: (usuarioId as string) || req.user.id,
      tipo: tipo as string,
    });

    return res.json(equipes);
  }

  /**
   * Obter detalhes de uma equipe
   */
  async detalhar(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const detalharEquipeUseCase = container.resolve<IUseCase<any, any>>('DetalharEquipeUseCase');

    const equipe = await detalharEquipeUseCase.execute({
      id,
      usuarioId: req.user.id,
    });

    return res.json(equipe);
  }

  /**
   * Criar uma nova equipe
   */
  async criar(req: Request, res: Response): Promise<Response> {
    const criarEquipeUseCase = container.resolve<IUseCase<any, any>>('CriarEquipeUseCase');

    const equipe = await criarEquipeUseCase.execute({
      ...req.body,
      usuarioCriador: req.user.id,
    });

    return res.status(201).json(equipe);
  }

  /**
   * Atualizar uma equipe existente
   */
  async atualizar(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const atualizarEquipeUseCase = container.resolve<IUseCase<any, any>>('AtualizarEquipeUseCase');

    const equipe = await atualizarEquipeUseCase.execute({
      id,
      ...req.body,
      usuarioId: req.user.id,
    });

    return res.json(equipe);
  }

  /**
   * Adicionar membro na equipe
   */
  async adicionarMembro(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const adicionarMembroEquipeUseCase = container.resolve<IUseCase<any, any>>(
      'AdicionarMembroEquipeUseCase',
    );

    const membro = await adicionarMembroEquipeUseCase.execute({
      equipeId: id,
      ...req.body,
      usuarioId: req.user.id,
    });

    return res.status(201).json(membro);
  }

  /**
   * Remover membro da equipe
   */
  async removerMembro(req: Request, res: Response): Promise<Response> {
    const { id, membroId } = req.params;

    const removerMembroEquipeUseCase = container.resolve<IUseCase<any, any>>(
      'RemoverMembroEquipeUseCase',
    );

    await removerMembroEquipeUseCase.execute({
      equipeId: id,
      membroId,
      usuarioId: req.user.id,
    });

    return res.sendStatus(204);
  }

  /**
   * Adicionar estudante à equipe
   */
  async adicionarEstudante(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const adicionarEstudanteEquipeUseCase = container.resolve<IUseCase<any, any>>(
      'AdicionarEstudanteEquipeUseCase',
    );

    const estudanteEquipe = await adicionarEstudanteEquipeUseCase.execute({
      equipeId: id,
      ...req.body,
      usuarioId: req.user.id,
    });

    return res.status(201).json(estudanteEquipe);
  }

  /**
   * Remover estudante da equipe
   */
  async removerEstudante(req: Request, res: Response): Promise<Response> {
    const { id, estudanteId } = req.params;

    const removerEstudanteEquipeUseCase = container.resolve<IUseCase<any, any>>(
      'RemoverEstudanteEquipeUseCase',
    );

    await removerEstudanteEquipeUseCase.execute({
      equipeId: id,
      estudanteId,
      usuarioId: req.user.id,
    });

    return res.sendStatus(204);
  }

  /**
   * Listar estudantes da equipe
   */
  async listarEstudantes(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const listarEstudantesEquipeUseCase = container.resolve<IUseCase<any, any>>(
      'ListarEstudantesEquipeUseCase',
    );

    const estudantes = await listarEstudantesEquipeUseCase.execute({
      equipeId: id,
      usuarioId: req.user.id,
    });

    return res.json(estudantes);
  }

  /**
   * Excluir equipe
   */
  async excluir(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const excluirEquipeUseCase = container.resolve<IUseCase<any, any>>('ExcluirEquipeUseCase');

    await excluirEquipeUseCase.execute({
      id,
      usuarioId: req.user.id,
    });

    return res.sendStatus(204);
  }
}
