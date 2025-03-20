import { Request, Response } from 'express';
import { container } from 'tsyringe';
import {
  CadastrarEstudanteUseCase,
  AssociarDificuldadeUseCase,
  RegistrarAvaliacaoUseCase,
  RecomendarIntervencoesUseCase,
  AcompanharProgressoUseCase,
} from '@application/use-cases/estudante';
import { AppError } from '@shared/errors/app-error';
import { IEstudanteRepository } from '@domain/repositories/estudante-repository.interface';

/**
 * Controller para as rotas de estudante
 */
export class EstudanteController {
  /**
   * Cadastrar um novo estudante
   */
  async cadastrar(req: Request, res: Response): Promise<Response> {
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
  async associarDificuldade(req: Request, res: Response): Promise<Response> {
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
  async registrarAvaliacao(req: Request, res: Response): Promise<Response> {
    const { estudanteId, data, tipo, pontuacao, observacoes } = req.body;
    // @ts-expect-error - req.usuario é adicionado pelo middleware de autenticação
    const avaliadorId = req.usuario?.id; // Obter o ID do usuário logado

    if (!avaliadorId) {
      throw new AppError('Usuário não autenticado', 401);
    }

    const registrarAvaliacaoUseCase = container.resolve<RegistrarAvaliacaoUseCase>(
      'RegistrarAvaliacaoUseCase',
    );

    const resultado = await registrarAvaliacaoUseCase.execute({
      estudanteId,
      data,
      tipo,
      pontuacao,
      observacoes,
      avaliadorId, // Adicionar o ID do avaliador
    });

    return res.status(201).json(resultado);
  }

  /**
   * Recomendar intervenções para um estudante
   */
  async recomendarIntervencoes(req: Request, res: Response): Promise<Response> {
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
  async acompanharProgresso(req: Request, res: Response): Promise<Response> {
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
  async listarEstudantesProfessor(req: Request, res: Response): Promise<Response> {
    const usuarioId = req.user.id;

    const estudanteRepository = container.resolve('EstudanteRepository');
    const estudantes = await estudanteRepository.findByUsuarioId(usuarioId);

    return res.status(200).json(estudantes);
  }

  /**
   * Listar estudantes por usuário (professor)
   */
  async listarPorUsuario(req: Request, res: Response): Promise<Response> {
    // @ts-expect-error - req.usuario é adicionado pelo middleware de autenticação
    const usuarioId = req.usuario?.id;

    if (!usuarioId) {
      throw new AppError('Usuário não autenticado', 401);
    }

    // Resolver o repositório utilizando o tipo correto
    const estudanteRepository = container.resolve<IEstudanteRepository>('EstudanteRepository');

    // Usar o método findByUsuarioId do repositório
    const estudantes = await estudanteRepository.findByUsuarioId(usuarioId);

    return res.json(estudantes);
  }
}
