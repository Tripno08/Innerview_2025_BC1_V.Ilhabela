import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { IUseCase } from '../../application/interfaces/IUseCase';
import {
  ListarReunioesDTO,
  Reuniao,
  ReuniaoDetalhada,
  CriarReuniaoDTO,
  AtualizarReuniaoDTO,
  AdicionarParticipanteDTO,
  ParticipanteReuniao,
  RegistrarPresencaDTO,
  AdicionarEncaminhamentoDTO,
  EncaminhamentoReuniao,
  RemoverParticipanteDTO,
  ExcluirReuniaoDTO,
} from '../../domain/entities';

/**
 * Controller para as rotas de reunião
 */
export class ReuniaoController {
  /**
   * Listar reuniões com filtros
   */
  async listar(req: Request, res: Response): Promise<Response> {
    const { equipeId, periodo, status } = req.query;

    const listarReunioesUseCase =
      container.resolve<IUseCase<ListarReunioesDTO, Reuniao[]>>('ListarReunioesUseCase');

    const reunioes = await listarReunioesUseCase.execute({
      equipeId: equipeId as string,
      periodo: periodo as string,
      status: status as string,
    });

    return res.json(reunioes);
  }

  /**
   * Obter detalhes de uma reunião
   */
  async detalhar(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const obterDetalhesReuniaoUseCase = container.resolve<IUseCase<string, ReuniaoDetalhada>>(
      'ObterDetalhesReuniaoUseCase',
    );

    const reuniao = await obterDetalhesReuniaoUseCase.execute({
      reuniaoId: id,
    });

    return res.json(reuniao);
  }

  /**
   * Criar uma nova reunião
   */
  async criar(req: Request, res: Response): Promise<Response> {
    const {
      titulo,
      descricao,
      dataHora,
      duracao,
      local,
      modalidade,
      equipeId,
      participantes,
      pauta,
    } = req.body;

    const criarReuniaoUseCase =
      container.resolve<IUseCase<CriarReuniaoDTO, Reuniao>>('CriarReuniaoUseCase');

    const reuniao = await criarReuniaoUseCase.execute({
      titulo,
      descricao,
      dataHora,
      duracao,
      local,
      modalidade,
      equipeId,
      participantes,
      pauta,
      criadoPorId: req.user.id,
    });

    return res.status(201).json(reuniao);
  }

  /**
   * Atualizar uma reunião
   */
  async atualizar(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { titulo, descricao, dataHora, duracao, local, modalidade, status, pauta } = req.body;

    const atualizarReuniaoUseCase =
      container.resolve<IUseCase<AtualizarReuniaoDTO, Reuniao>>('AtualizarReuniaoUseCase');

    const reuniao = await atualizarReuniaoUseCase.execute({
      reuniaoId: id,
      titulo,
      descricao,
      dataHora,
      duracao,
      local,
      modalidade,
      status,
      pauta,
      atualizadoPorId: req.user.id,
    });

    return res.json(reuniao);
  }

  /**
   * Adicionar participante a uma reunião
   */
  async adicionarParticipante(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { usuarioId, obrigatorio, papel } = req.body;

    const adicionarParticipanteUseCase = container.resolve<
      IUseCase<AdicionarParticipanteDTO, ParticipanteReuniao>
    >('AdicionarParticipanteReuniaoUseCase');

    const participante = await adicionarParticipanteUseCase.execute({
      reuniaoId: id,
      usuarioId,
      obrigatorio,
      papel,
      adicionadoPorId: req.user.id,
    });

    return res.status(201).json(participante);
  }

  /**
   * Remover participante de uma reunião
   */
  async removerParticipante(req: Request, res: Response): Promise<Response> {
    const { id, participanteId } = req.params;

    const removerParticipanteUseCase = container.resolve<IUseCase<RemoverParticipanteDTO, void>>(
      'RemoverParticipanteReuniaoUseCase',
    );

    await removerParticipanteUseCase.execute({
      reuniaoId: id,
      participanteId,
      removidoPorId: req.user.id,
    });

    return res.status(204).send();
  }

  /**
   * Registrar presença em uma reunião
   */
  async registrarPresenca(req: Request, res: Response): Promise<Response> {
    const { id, participanteId } = req.params;
    const { presente, justificativa } = req.body;

    const registrarPresencaUseCase = container.resolve<
      IUseCase<RegistrarPresencaDTO, ParticipanteReuniao>
    >('RegistrarPresencaReuniaoUseCase');

    const participante = await registrarPresencaUseCase.execute({
      reuniaoId: id,
      participanteId,
      presente,
      justificativa,
      registradoPorId: req.user.id,
    });

    return res.json(participante);
  }

  /**
   * Adicionar encaminhamento a uma reunião
   */
  async adicionarEncaminhamento(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { descricao, prazo, responsavelId, prioridade } = req.body;

    const adicionarEncaminhamentoUseCase = container.resolve<
      IUseCase<AdicionarEncaminhamentoDTO, EncaminhamentoReuniao>
    >('AdicionarEncaminhamentoReuniaoUseCase');

    const encaminhamento = await adicionarEncaminhamentoUseCase.execute({
      reuniaoId: id,
      descricao,
      prazo,
      responsavelId,
      prioridade,
      criadoPorId: req.user.id,
    });

    return res.status(201).json(encaminhamento);
  }

  /**
   * Atualizar encaminhamento de uma reunião
   */
  async atualizarEncaminhamento(req: Request, res: Response): Promise<Response> {
    const { id, encaminhamentoId } = req.params;
    const { descricao, prazo, responsavelId, prioridade, status, observacoes } = req.body;

    const atualizarEncaminhamentoUseCase = container.resolve<
      IUseCase<AtualizarEncaminhamentoDTO, EncaminhamentoReuniao>
    >('AtualizarEncaminhamentoReuniaoUseCase');

    const encaminhamento = await atualizarEncaminhamentoUseCase.execute({
      reuniaoId: id,
      encaminhamentoId,
      descricao,
      prazo,
      responsavelId,
      prioridade,
      status,
      observacoes,
      atualizadoPorId: req.user.id,
    });

    return res.json(encaminhamento);
  }

  /**
   * Excluir uma reunião
   */
  async excluir(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const excluirReuniaoUseCase =
      container.resolve<IUseCase<ExcluirReuniaoDTO, void>>('ExcluirReuniaoUseCase');

    await excluirReuniaoUseCase.execute({
      reuniaoId: id,
      excluidoPorId: req.user.id,
    });

    return res.status(204).send();
  }
}
