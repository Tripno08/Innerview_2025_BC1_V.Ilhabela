import { Request, Response } from 'express';
import { container } from 'tsyringe';
import {
  ListarReunioesUseCase,
  ListarReunioesPorEquipeUseCase,
  ListarReunioesPorPeriodoUseCase,
  ListarReunioesPorStatusUseCase,
} from '@application/use-cases/reuniao/listar-reunioes.usecase';
import { ObterDetalhesReuniaoUseCase } from '@application/use-cases/reuniao/obter-detalhes-reuniao.usecase';
import {
  CriarReuniaoUseCase,
  CriarReuniaoDTO,
} from '@application/use-cases/reuniao/criar-reuniao.usecase';
import { AppError } from '@shared/errors/app-error';

/**
 * Controlador para rotas de Reunião
 */
export class ReuniaoController {
  /**
   * Listar todas as reuniões
   */
  async listar(request: Request, response: Response): Promise<Response> {
    try {
      const listarReunioesUseCase = container.resolve(ListarReunioesUseCase);
      const reunioes = await listarReunioesUseCase.execute();

      return response.json(reunioes);
    } catch (error) {
      if (error instanceof AppError) {
        return response.status(error.statusCode).json({
          status: 'error',
          code: error.code,
          message: error.message,
        });
      }

      return response.status(500).json({
        status: 'error',
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro interno do servidor',
      });
    }
  }

  /**
   * Listar reuniões por equipe
   */
  async listarPorEquipe(request: Request, response: Response): Promise<Response> {
    try {
      const { equipeId } = request.params;

      if (!equipeId) {
        return response.status(400).json({
          status: 'error',
          code: 'INVALID_INPUT',
          message: 'ID da equipe é obrigatório',
        });
      }

      const listarReunioesPorEquipeUseCase = container.resolve(ListarReunioesPorEquipeUseCase);
      const reunioes = await listarReunioesPorEquipeUseCase.execute(equipeId);

      return response.json(reunioes);
    } catch (error) {
      if (error instanceof AppError) {
        return response.status(error.statusCode).json({
          status: 'error',
          code: error.code,
          message: error.message,
        });
      }

      return response.status(500).json({
        status: 'error',
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro interno do servidor',
      });
    }
  }

  /**
   * Listar reuniões por período
   */
  async listarPorPeriodo(request: Request, response: Response): Promise<Response> {
    try {
      const { dataInicio, dataFim } = request.query;

      if (!dataInicio || !dataFim) {
        return response.status(400).json({
          status: 'error',
          code: 'INVALID_INPUT',
          message: 'Data de início e data de fim são obrigatórias',
        });
      }

      const dataInicioObj = new Date(dataInicio as string);
      const dataFimObj = new Date(dataFim as string);

      if (isNaN(dataInicioObj.getTime()) || isNaN(dataFimObj.getTime())) {
        return response.status(400).json({
          status: 'error',
          code: 'INVALID_INPUT',
          message: 'Formato de data inválido',
        });
      }

      const listarReunioesPorPeriodoUseCase = container.resolve(ListarReunioesPorPeriodoUseCase);
      const reunioes = await listarReunioesPorPeriodoUseCase.execute(dataInicioObj, dataFimObj);

      return response.json(reunioes);
    } catch (error) {
      if (error instanceof AppError) {
        return response.status(error.statusCode).json({
          status: 'error',
          code: error.code,
          message: error.message,
        });
      }

      return response.status(500).json({
        status: 'error',
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro interno do servidor',
      });
    }
  }

  /**
   * Listar reuniões por status
   */
  async listarPorStatus(request: Request, response: Response): Promise<Response> {
    try {
      const { status } = request.params;

      if (!status) {
        return response.status(400).json({
          status: 'error',
          code: 'INVALID_INPUT',
          message: 'Status é obrigatório',
        });
      }

      const listarReunioesPorStatusUseCase = container.resolve(ListarReunioesPorStatusUseCase);
      const reunioes = await listarReunioesPorStatusUseCase.execute(status);

      return response.json(reunioes);
    } catch (error) {
      if (error instanceof AppError) {
        return response.status(error.statusCode).json({
          status: 'error',
          code: error.code,
          message: error.message,
        });
      }

      return response.status(500).json({
        status: 'error',
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro interno do servidor',
      });
    }
  }

  /**
   * Obter detalhes de uma reunião
   */
  async obterDetalhes(request: Request, response: Response): Promise<Response> {
    try {
      const { id } = request.params;

      if (!id) {
        return response.status(400).json({
          status: 'error',
          code: 'INVALID_INPUT',
          message: 'ID da reunião é obrigatório',
        });
      }

      const obterDetalhesReuniaoUseCase = container.resolve(ObterDetalhesReuniaoUseCase);
      const detalhes = await obterDetalhesReuniaoUseCase.execute(id);

      return response.json(detalhes);
    } catch (error) {
      if (error instanceof AppError) {
        return response.status(error.statusCode).json({
          status: 'error',
          code: error.code,
          message: error.message,
        });
      }

      return response.status(500).json({
        status: 'error',
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro interno do servidor',
      });
    }
  }

  /**
   * Criar uma nova reunião
   */
  async criar(request: Request, response: Response): Promise<Response> {
    try {
      const { titulo, data, local, equipeId, observacoes, status, participantes } = request.body;

      const reuniaoData: CriarReuniaoDTO = {
        titulo,
        data: new Date(data),
        local,
        equipeId,
        observacoes,
        status,
        participantes,
      };

      // Validar dados
      if (!reuniaoData.titulo) {
        return response.status(400).json({
          status: 'error',
          code: 'INVALID_INPUT',
          message: 'Título da reunião é obrigatório',
        });
      }

      if (!reuniaoData.data || isNaN(reuniaoData.data.getTime())) {
        return response.status(400).json({
          status: 'error',
          code: 'INVALID_INPUT',
          message: 'Data da reunião é obrigatória e deve estar em formato válido',
        });
      }

      if (!reuniaoData.equipeId) {
        return response.status(400).json({
          status: 'error',
          code: 'INVALID_INPUT',
          message: 'ID da equipe é obrigatório',
        });
      }

      const criarReuniaoUseCase = container.resolve(CriarReuniaoUseCase);
      const reuniao = await criarReuniaoUseCase.execute(reuniaoData);

      return response.status(201).json(reuniao);
    } catch (error) {
      if (error instanceof AppError) {
        return response.status(error.statusCode).json({
          status: 'error',
          code: error.code,
          message: error.message,
        });
      }

      return response.status(500).json({
        status: 'error',
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro interno do servidor',
      });
    }
  }
}
