import { Request, Response } from 'express';
import { GerenciarEquipeUseCase } from '../../application/use-cases/equipe/gerenciar-equipe.use-case';
import { AppError } from '../../shared/errors/app-error';
import { MembroEquipeDTO, EstudanteEquipeDTO } from '../../domain/dtos/equipe.dto';

export class EquipeController {
  constructor(private gerenciarEquipeUseCase: GerenciarEquipeUseCase) {}

  public async listar(req: Request, res: Response): Promise<Response> {
    try {
      const filtro = req.query;
      const equipes = await this.gerenciarEquipeUseCase.listarEquipes(filtro);
      return res.status(200).json({ data: equipes });
    } catch (error) {
      console.error('Erro ao listar equipes:', error);
      return res.status(500).json({
        erro: 'Erro interno do servidor',
        mensagem: error instanceof Error ? error.message : 'Erro ao listar equipes',
      });
    }
  }

  public async obterPorId(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const equipe = await this.gerenciarEquipeUseCase.obterEquipePorId(id);
      return res.status(200).json({ data: equipe });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          erro: error.statusCode === 404 ? 'Not Found' : 'Bad Request',
          mensagem: error.message,
        });
      }
      console.error('Erro ao obter equipe:', error);
      return res.status(500).json({
        erro: 'Erro interno do servidor',
        mensagem: error instanceof Error ? error.message : 'Erro ao obter equipe',
      });
    }
  }

  public async criar(req: Request, res: Response): Promise<Response> {
    try {
      const dadosCriacao = req.body;
      const equipe = await this.gerenciarEquipeUseCase.criarEquipe(dadosCriacao);
      return res.status(201).json({ data: equipe });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          erro: error.statusCode === 400 ? 'Bad Request' : 'Erro interno',
          mensagem: error.message,
        });
      }
      console.error('Erro ao criar equipe:', error);
      return res.status(500).json({
        erro: 'Erro interno do servidor',
        mensagem: error instanceof Error ? error.message : 'Erro ao criar equipe',
      });
    }
  }

  public async atualizar(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const dadosAtualizacao = req.body;
      const equipe = await this.gerenciarEquipeUseCase.atualizarEquipe(id, dadosAtualizacao);
      return res.status(200).json({ data: equipe });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          erro: error.statusCode === 404 ? 'Not Found' : 'Bad Request',
          mensagem: error.message,
        });
      }
      console.error('Erro ao atualizar equipe:', error);
      return res.status(500).json({
        erro: 'Erro interno do servidor',
        mensagem: error instanceof Error ? error.message : 'Erro ao atualizar equipe',
      });
    }
  }

  public async excluir(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      await this.gerenciarEquipeUseCase.excluirEquipe(id);
      return res.status(204).json();
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          erro: error.statusCode === 404 ? 'Not Found' : 'Bad Request',
          mensagem: error.message,
        });
      }
      console.error('Erro ao excluir equipe:', error);
      return res.status(500).json({
        erro: 'Erro interno do servidor',
        mensagem: error instanceof Error ? error.message : 'Erro ao excluir equipe',
      });
    }
  }

  public async adicionarMembro(req: Request, res: Response): Promise<Response> {
    try {
      const { id: equipeId } = req.params;
      const { usuarioId } = req.body;

      const dadosMembro: MembroEquipeDTO = {
        equipeId,
        usuarioId,
      };

      const membro = await this.gerenciarEquipeUseCase.adicionarMembro(dadosMembro);
      return res.status(201).json({ data: membro });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          erro: error.statusCode === 404 ? 'Not Found' : 'Bad Request',
          mensagem: error.message,
        });
      }
      console.error('Erro ao adicionar membro:', error);
      return res.status(500).json({
        erro: 'Erro interno do servidor',
        mensagem: error instanceof Error ? error.message : 'Erro ao adicionar membro',
      });
    }
  }

  public async removerMembro(req: Request, res: Response): Promise<Response> {
    try {
      const { id: equipeId, membroId } = req.params;
      await this.gerenciarEquipeUseCase.removerMembro(equipeId, membroId);
      return res.status(204).json();
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          erro: error.statusCode === 404 ? 'Not Found' : 'Bad Request',
          mensagem: error.message,
        });
      }
      console.error('Erro ao remover membro:', error);
      return res.status(500).json({
        erro: 'Erro interno do servidor',
        mensagem: error instanceof Error ? error.message : 'Erro ao remover membro',
      });
    }
  }

  public async adicionarEstudante(req: Request, res: Response): Promise<Response> {
    try {
      const { id: equipeId } = req.params;
      const { estudanteId } = req.body;

      const dadosEstudante: EstudanteEquipeDTO = {
        equipeId,
        estudanteId,
      };

      const estudante = await this.gerenciarEquipeUseCase.adicionarEstudante(dadosEstudante);
      return res.status(201).json({ data: estudante });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          erro: error.statusCode === 404 ? 'Not Found' : 'Bad Request',
          mensagem: error.message,
        });
      }
      console.error('Erro ao adicionar estudante:', error);
      return res.status(500).json({
        erro: 'Erro interno do servidor',
        mensagem: error instanceof Error ? error.message : 'Erro ao adicionar estudante',
      });
    }
  }

  public async removerEstudante(req: Request, res: Response): Promise<Response> {
    try {
      const { id: equipeId, estudanteId } = req.params;
      await this.gerenciarEquipeUseCase.removerEstudante(equipeId, estudanteId);
      return res.status(204).json();
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          erro: error.statusCode === 404 ? 'Not Found' : 'Bad Request',
          mensagem: error.message,
        });
      }
      console.error('Erro ao remover estudante:', error);
      return res.status(500).json({
        erro: 'Erro interno do servidor',
        mensagem: error instanceof Error ? error.message : 'Erro ao remover estudante',
      });
    }
  }
}
