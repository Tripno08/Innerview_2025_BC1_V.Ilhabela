import { Request, Response } from 'express';
import { container } from 'tsyringe';
import {
  CadastrarEstudanteUseCase,
  AssociarDificuldadeUseCase,
  RegistrarAvaliacaoUseCase,
  RecomendarIntervencoesUseCase,
  AcompanharProgressoUseCase,
} from '../../application/use-cases/estudante';
import { IEstudanteRepository } from '../../domain/repositories/estudante-repository.interface';
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
 * Controller para as rotas de estudante
 */
export class EstudanteController {
  /**
   * Cadastrar um novo estudante
   */
  async cadastrar(req: RequestWithUser, res: Response): Promise<Response> {
    const { nome, serie, dataNascimento } = req.body;
    const usuarioId = req.user.id; // Professor logado

    const cadastrarEstudanteUseCase = container.resolve<CadastrarEstudanteUseCase>(
      'CadastrarEstudanteUseCase',
    );

    const { estudante } = await cadastrarEstudanteUseCase.execute({
      nome,
      serie,
      dataNascimento,
      usuarioId,
    });

    return res.status(201).json(estudante);
  }

  /**
   * Associar uma dificuldade de aprendizagem a um estudante
   */
  async associarDificuldade(req: RequestWithUser, res: Response): Promise<Response> {
    const { estudanteId, dificuldadeId } = req.body;

    const associarDificuldadeUseCase = container.resolve<AssociarDificuldadeUseCase>(
      'AssociarDificuldadeUseCase',
    );

    const { estudante } = await associarDificuldadeUseCase.execute({
      estudanteId,
      dificuldadeId,
    });

    return res.status(200).json(estudante);
  }

  /**
   * Registrar uma avaliação para um estudante
   */
  async registrarAvaliacao(req: RequestWithUser, res: Response): Promise<Response> {
    const { estudanteId, data, tipo, pontuacao, observacoes } = req.body;
    const avaliadorId = req.user.id; // Obter o ID do usuário logado

    const registrarAvaliacaoUseCase = container.resolve<RegistrarAvaliacaoUseCase>(
      'RegistrarAvaliacaoUseCase',
    );

    const resultado = await registrarAvaliacaoUseCase.execute({
      estudanteId,
      data,
      tipo,
      pontuacao,
      observacoes,
      avaliadorId,
    });

    return res.status(201).json(resultado);
  }

  /**
   * Recomendar intervenções para um estudante
   */
  async recomendarIntervencoes(req: RequestWithUser, res: Response): Promise<Response> {
    const { estudanteId } = req.params;

    const recomendarIntervencoesUseCase = container.resolve<RecomendarIntervencoesUseCase>(
      'RecomendarIntervencoesUseCase',
    );

    const { intervencoes } = await recomendarIntervencoesUseCase.execute({
      estudanteId,
    });

    return res.status(200).json({ intervencoes });
  }

  /**
   * Acompanhar o progresso de um estudante
   */
  async acompanharProgresso(req: RequestWithUser, res: Response): Promise<Response> {
    const { estudanteId } = req.params;

    const acompanharProgressoUseCase = container.resolve<AcompanharProgressoUseCase>(
      'AcompanharProgressoUseCase',
    );

    const progresso = await acompanharProgressoUseCase.execute({
      estudanteId,
    });

    return res.status(200).json(progresso);
  }

  /**
   * Listar estudantes do professor logado
   */
  async listarEstudantesProfessor(req: RequestWithUser, res: Response): Promise<Response> {
    const usuarioId = req.user.id;

    const estudanteRepository = container.resolve<IEstudanteRepository>('EstudanteRepository');
    const estudantes = await estudanteRepository.findByUsuarioId(usuarioId);

    return res.status(200).json(estudantes);
  }

  /**
   * Listar estudantes por usuário (professor)
   */
  async listarPorUsuario(req: RequestWithUser, res: Response): Promise<Response> {
    const usuarioId = req.user.id;

    // Resolver o repositório utilizando o tipo correto
    const estudanteRepository = container.resolve<IEstudanteRepository>('EstudanteRepository');

    // Usar o método findByUsuarioId do repositório
    const estudantes = await estudanteRepository.findByUsuarioId(usuarioId);

    return res.json(estudantes);
  }
}
