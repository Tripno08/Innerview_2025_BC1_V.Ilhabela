import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { IUseCase } from '../../application/interfaces/IUseCase';
import { Equipe, MembroEquipe, EstudanteEquipe } from '../../domain/entities/equipe.entity';
import { CargoUsuario } from '../../shared/enums';

// Interface personalizada para Request com usuário
interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
    cargo: CargoUsuario;
    nome?: string;
  };
}

// Interfaces para os DTOs
interface ListarEquipesDTO {
  instituicaoId?: string;
  usuarioId?: string;
  tipo?: string;
}

interface DetalharEquipeDTO {
  id: string;
  usuarioId: string;
}

interface CriarEquipeDTO {
  nome: string;
  descricao?: string;
  instituicaoId?: string;
  usuarioCriador: string;
}

interface AtualizarEquipeDTO {
  id: string;
  nome?: string;
  descricao?: string;
  status?: string;
  usuarioId: string;
}

interface AdicionarMembroDTO {
  equipeId: string;
  usuarioId: string;
  papelMembro: string;
}

interface RemoverMembroDTO {
  equipeId: string;
  membroId: string;
  usuarioId: string;
}

interface AdicionarEstudanteDTO {
  equipeId: string;
  estudanteId: string;
  usuarioId: string;
}

interface RemoverEstudanteDTO {
  equipeId: string;
  estudanteId: string;
  usuarioId: string;
}

interface ListarEstudantesDTO {
  equipeId: string;
  usuarioId: string;
}

interface ExcluirEquipeDTO {
  id: string;
  usuarioId: string;
}

/**
 * Controller para as rotas de equipe
 */
export class EquipeController {
  /**
   * Listar equipes com filtros
   */
  async listar(req: RequestWithUser, res: Response): Promise<Response> {
    const { instituicaoId, usuarioId, tipo } = req.query;

    const listarEquipesUseCase =
      container.resolve<IUseCase<ListarEquipesDTO, Equipe[]>>('ListarEquipesUseCase');

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
  async detalhar(req: RequestWithUser, res: Response): Promise<Response> {
    const { id } = req.params;

    const detalharEquipeUseCase =
      container.resolve<IUseCase<DetalharEquipeDTO, Equipe>>('DetalharEquipeUseCase');

    const equipe = await detalharEquipeUseCase.execute({
      id,
      usuarioId: req.user.id,
    });

    return res.json(equipe);
  }

  /**
   * Criar uma nova equipe
   */
  async criar(req: RequestWithUser, res: Response): Promise<Response> {
    const criarEquipeUseCase =
      container.resolve<IUseCase<CriarEquipeDTO, Equipe>>('CriarEquipeUseCase');

    const equipe = await criarEquipeUseCase.execute({
      ...req.body,
      usuarioCriador: req.user.id,
    });

    return res.status(201).json(equipe);
  }

  /**
   * Atualizar uma equipe existente
   */
  async atualizar(req: RequestWithUser, res: Response): Promise<Response> {
    const { id } = req.params;

    const atualizarEquipeUseCase =
      container.resolve<IUseCase<AtualizarEquipeDTO, Equipe>>('AtualizarEquipeUseCase');

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
  async adicionarMembro(req: RequestWithUser, res: Response): Promise<Response> {
    const { id } = req.params;

    const adicionarMembroEquipeUseCase = container.resolve<
      IUseCase<AdicionarMembroDTO, MembroEquipe>
    >('AdicionarMembroEquipeUseCase');

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
  async removerMembro(req: RequestWithUser, res: Response): Promise<Response> {
    const { id, membroId } = req.params;

    const removerMembroEquipeUseCase = container.resolve<IUseCase<RemoverMembroDTO, void>>(
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
  async adicionarEstudante(req: RequestWithUser, res: Response): Promise<Response> {
    const { id } = req.params;

    const adicionarEstudanteEquipeUseCase = container.resolve<
      IUseCase<AdicionarEstudanteDTO, EstudanteEquipe>
    >('AdicionarEstudanteEquipeUseCase');

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
  async removerEstudante(req: RequestWithUser, res: Response): Promise<Response> {
    const { id, estudanteId } = req.params;

    const removerEstudanteEquipeUseCase = container.resolve<IUseCase<RemoverEstudanteDTO, void>>(
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
  async listarEstudantes(req: RequestWithUser, res: Response): Promise<Response> {
    const { id } = req.params;

    const listarEstudantesEquipeUseCase = container.resolve<
      IUseCase<ListarEstudantesDTO, EstudanteEquipe[]>
    >('ListarEstudantesEquipeUseCase');

    const estudantes = await listarEstudantesEquipeUseCase.execute({
      equipeId: id,
      usuarioId: req.user.id,
    });

    return res.json(estudantes);
  }

  /**
   * Excluir equipe
   */
  async excluir(req: RequestWithUser, res: Response): Promise<Response> {
    const { id } = req.params;

    const excluirEquipeUseCase =
      container.resolve<IUseCase<ExcluirEquipeDTO, void>>('ExcluirEquipeUseCase');

    await excluirEquipeUseCase.execute({
      id,
      usuarioId: req.user.id,
    });

    return res.sendStatus(204);
  }
}
