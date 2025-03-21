import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { IUseCase } from '../../application/interfaces/IUseCase';
import {
  ListarDificuldadesDTO,
  DificuldadeAprendizagem,
} from '../../application/dto/listar-dificuldades.dto';
import {
  DetalharDificuldadeDTO,
  DificuldadeAprendizagem as DetalhesDificuldade,
} from '../../application/dto/detalhar-dificuldade.dto';
import {
  CriarDificuldadeDTO,
  DificuldadeAprendizagem as NovaDificuldade,
} from '../../application/dto/criar-dificuldade.dto';
import {
  AtualizarDificuldadeDTO,
  DificuldadeAprendizagem as DificuldadeAtualizada,
} from '../../application/dto/atualizar-dificuldade.dto';
import {
  AssociarDificuldadeEstudanteDTO,
  EstudanteDificuldade,
} from '../../application/dto/associar-dificuldade-estudante.dto';
import { RemoverDificuldadeEstudanteDTO } from '../../application/dto/remover-dificuldade-estudante.dto';
import {
  ListarIntervencoesRecomendadasDTO,
  CatalogoIntervencao,
} from '../../application/dto/listar-intervencoes-recomendadas.dto';
import { ExcluirDificuldadeDTO } from '../../application/dto/excluir-dificuldade.dto';
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

/**
 * Controller para as rotas de dificuldades de aprendizagem
 */
export class DificuldadeController {
  /**
   * Listar dificuldades de aprendizagem
   */
  async listar(req: RequestWithUser, res: Response): Promise<Response> {
    const { categoria, tipo, status } = req.query;

    const listarDificuldadesUseCase = container.resolve<
      IUseCase<ListarDificuldadesDTO, DificuldadeAprendizagem[]>
    >('ListarDificuldadesUseCase');

    const dificuldades = await listarDificuldadesUseCase.execute({
      categoria: categoria as string,
      tipo: tipo as string,
      status: status as string,
      usuarioId: req.user.id,
    });

    return res.json(dificuldades);
  }

  /**
   * Obter detalhes de uma dificuldade
   */
  async detalhar(req: RequestWithUser, res: Response): Promise<Response> {
    const { id } = req.params;

    const detalharDificuldadeUseCase = container.resolve<
      IUseCase<DetalharDificuldadeDTO, DetalhesDificuldade>
    >('DetalharDificuldadeUseCase');

    const dificuldade = await detalharDificuldadeUseCase.execute({
      id,
      usuarioId: req.user.id,
    });

    return res.json(dificuldade);
  }

  /**
   * Criar uma nova dificuldade de aprendizagem
   */
  async criar(req: RequestWithUser, res: Response): Promise<Response> {
    const { nome, descricao, tipo, categoria, sintomas } = req.body;

    const criarDificuldadeUseCase =
      container.resolve<IUseCase<CriarDificuldadeDTO, NovaDificuldade>>('CriarDificuldadeUseCase');

    const dificuldade = await criarDificuldadeUseCase.execute({
      nome,
      descricao,
      sintomas,
      tipo,
      categoria,
      usuarioId: req.user.id,
    });

    return res.status(201).json(dificuldade);
  }

  /**
   * Atualizar uma dificuldade
   */
  async atualizar(req: RequestWithUser, res: Response): Promise<Response> {
    const { id } = req.params;
    const { nome, descricao, tipo, categoria, sintomas, status } = req.body;

    const atualizarDificuldadeUseCase = container.resolve<
      IUseCase<AtualizarDificuldadeDTO, DificuldadeAtualizada>
    >('AtualizarDificuldadeUseCase');

    const dificuldade = await atualizarDificuldadeUseCase.execute({
      id,
      nome,
      descricao,
      tipo,
      categoria,
      sintomas,
      status,
      usuarioId: req.user.id,
    });

    return res.json(dificuldade);
  }

  /**
   * Associar uma dificuldade a um estudante
   */
  async associarAEstudante(req: RequestWithUser, res: Response): Promise<Response> {
    const { id } = req.params;
    const { estudanteId, observacoes, dataIdentificacao } = req.body;

    const associarDificuldadeEstudanteUseCase = container.resolve<
      IUseCase<AssociarDificuldadeEstudanteDTO, EstudanteDificuldade>
    >('AssociarDificuldadeEstudanteUseCase');

    const associacao = await associarDificuldadeEstudanteUseCase.execute({
      dificuldadeId: id,
      estudanteId,
      observacoes,
      dataIdentificacao,
      usuarioId: req.user.id,
    });

    return res.status(201).json(associacao);
  }

  /**
   * Remover associação de dificuldade com estudante
   */
  async removerDeEstudante(req: RequestWithUser, res: Response): Promise<Response> {
    const { id, estudanteId } = req.params;
    const { motivo } = req.body;

    const removerDificuldadeEstudanteUseCase = container.resolve<
      IUseCase<RemoverDificuldadeEstudanteDTO, void>
    >('RemoverDificuldadeEstudanteUseCase');

    await removerDificuldadeEstudanteUseCase.execute({
      dificuldadeId: id,
      estudanteId,
      motivo,
      usuarioId: req.user.id,
    });

    return res.status(204).send();
  }

  /**
   * Listar intervenções recomendadas para uma dificuldade
   */
  async listarIntervencoesRecomendadas(req: RequestWithUser, res: Response): Promise<Response> {
    const { id } = req.params;
    const { estudanteId, limite } = req.query;

    const listarIntervencoesRecomendadasUseCase = container.resolve<
      IUseCase<ListarIntervencoesRecomendadasDTO, CatalogoIntervencao[]>
    >('ListarIntervencoesRecomendadasUseCase');

    const intervencoes = await listarIntervencoesRecomendadasUseCase.execute({
      dificuldadeId: id,
      estudanteId: estudanteId as string,
      limite: limite ? parseInt(limite as string, 10) : undefined,
      usuarioId: req.user.id,
    });

    return res.json(intervencoes);
  }

  /**
   * Excluir uma dificuldade
   */
  async excluir(req: RequestWithUser, res: Response): Promise<Response> {
    const { id } = req.params;

    const excluirDificuldadeUseCase = container.resolve<IUseCase<ExcluirDificuldadeDTO, void>>(
      'ExcluirDificuldadeUseCase',
    );

    await excluirDificuldadeUseCase.execute({
      id,
      usuarioId: req.user.id,
    });

    return res.status(204).send();
  }
}
