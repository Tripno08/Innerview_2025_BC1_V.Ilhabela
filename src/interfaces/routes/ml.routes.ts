import { Router } from 'express';
import { container } from 'tsyringe';
import { IMLService } from '@domain/services/ml/ml-service.interface';
import { EstudanteRepository } from '@infrastructure/repositories/estudante.repository';
import { IntervencaoRepository } from '@infrastructure/repositories/intervencao.repository';
import { authMiddleware } from '@interfaces/middlewares/auth.middleware';
import { rbacMiddleware } from '@interfaces/middlewares/rbac.middleware';
import { CargoUsuario } from '@shared/enums';

const mlRoutes = Router();
const mlService = container.resolve<IMLService>('MLService');
const estudanteRepository = container.resolve(EstudanteRepository);
const intervencaoRepository = container.resolve(IntervencaoRepository);

// Middleware de autenticação para todas as rotas
mlRoutes.use(authMiddleware);

// Rota para análise de risco acadêmico
mlRoutes.get(
  '/estudantes/:estudanteId/risco',
  rbacMiddleware([CargoUsuario.ADMIN, CargoUsuario.PROFESSOR, CargoUsuario.ESPECIALISTA]),
  async (req, res) => {
    try {
      const { estudanteId } = req.params;
      const { incluirFatores } = req.query;

      const estudante = await estudanteRepository.obterPorId(estudanteId);

      if (!estudante) {
        return res.status(404).json({ message: 'Estudante não encontrado' });
      }

      const analiseRisco = await mlService.preverRiscoAcademico(
        estudante,
        incluirFatores === 'true',
      );

      return res.json(analiseRisco);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao analisar risco acadêmico' });
    }
  },
);

// Rota para recomendação de intervenções
mlRoutes.get(
  '/estudantes/:estudanteId/recomendacoes',
  rbacMiddleware([CargoUsuario.ADMIN, CargoUsuario.PROFESSOR, CargoUsuario.ESPECIALISTA]),
  async (req, res) => {
    try {
      const { estudanteId } = req.params;
      const { limite } = req.query;

      const estudante = await estudanteRepository.obterPorId(estudanteId);

      if (!estudante) {
        return res.status(404).json({ message: 'Estudante não encontrado' });
      }

      // Buscar dificuldades do estudante
      const dificuldades = await estudanteRepository.obterDificuldades(estudanteId);

      const recomendacoes = await mlService.recomendarIntervencoes(
        estudante,
        dificuldades,
        limite ? parseInt(limite as string) : undefined,
      );

      return res.json(recomendacoes);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao gerar recomendações' });
    }
  },
);

// Rota para análise de eficácia de intervenção
mlRoutes.get(
  '/intervencoes/:intervencaoId/eficacia',
  rbacMiddleware([CargoUsuario.ADMIN, CargoUsuario.PROFESSOR, CargoUsuario.ESPECIALISTA]),
  async (req, res) => {
    try {
      const { intervencaoId } = req.params;
      const { metricas } = req.query;

      const intervencao = await intervencaoRepository.obterPorId(intervencaoId);

      if (!intervencao) {
        return res.status(404).json({ message: 'Intervenção não encontrada' });
      }

      const metricasArray = metricas ? (metricas as string).split(',') : undefined;

      const analiseEficacia = await mlService.analisarEficaciaIntervencao(
        intervencao,
        metricasArray,
      );

      return res.json(analiseEficacia);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao analisar eficácia da intervenção' });
    }
  },
);

// Rota para detecção de padrões
mlRoutes.get(
  '/padroes',
  rbacMiddleware([CargoUsuario.ADMIN, CargoUsuario.PROFESSOR, CargoUsuario.ESPECIALISTA]),
  async (req, res) => {
    try {
      const { limiteConfianca, area, estudanteId } = req.query;

      const filtros: Record<string, unknown> = {};

      // Adicionar filtros se fornecidos
      if (area) filtros.area = area;
      if (estudanteId) filtros.estudanteId = estudanteId;

      const padroes = await mlService.detectarPadroes(
        Object.keys(filtros).length > 0 ? filtros : undefined,
        limiteConfianca ? parseFloat(limiteConfianca as string) : undefined,
      );

      return res.json(padroes);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao detectar padrões' });
    }
  },
);

// Rota para comparação normativa
mlRoutes.get(
  '/estudantes/:estudanteId/comparacao',
  rbacMiddleware([CargoUsuario.ADMIN, CargoUsuario.PROFESSOR, CargoUsuario.ESPECIALISTA]),
  async (req, res) => {
    try {
      const { estudanteId } = req.params;
      const { indicadores } = req.query;

      const estudante = await estudanteRepository.obterPorId(estudanteId);

      if (!estudante) {
        return res.status(404).json({ message: 'Estudante não encontrado' });
      }

      if (!indicadores) {
        return res.status(400).json({ message: 'É necessário fornecer pelo menos um indicador' });
      }

      const indicadoresArray = (indicadores as string).split(',');

      const comparacao = await mlService.compararComNormas(estudante, indicadoresArray);

      return res.json(comparacao);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao gerar comparação normativa' });
    }
  },
);

// Rotas para modelos de ML (acesso restrito a administradores)

// Listar modelos disponíveis
mlRoutes.get('/modelos', rbacMiddleware([CargoUsuario.ADMIN]), async (req, res) => {
  try {
    const { tipo } = req.query;

    const modelos = await mlService.listarModelos(tipo as string);

    return res.json(modelos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao listar modelos' });
  }
});

// Treinar modelo específico
mlRoutes.post(
  '/modelos/:modeloId/treinar',
  rbacMiddleware([CargoUsuario.ADMIN]),
  async (req, res) => {
    try {
      const { modeloId } = req.params;
      const configuracao = req.body;

      const modeloAtualizado = await mlService.treinarModelo(modeloId, configuracao);

      return res.json(modeloAtualizado);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao treinar modelo' });
    }
  },
);

// Registrar dados para treinamento
mlRoutes.post('/dados/treinamento', rbacMiddleware([CargoUsuario.ADMIN]), async (req, res) => {
  try {
    const dados = req.body;

    if (!Array.isArray(dados)) {
      return res
        .status(400)
        .json({ message: 'O corpo da requisição deve ser um array de dados de treinamento' });
    }

    await mlService.registrarDadosTreinamento(dados);

    return res.status(201).json({ message: 'Dados de treinamento registrados com sucesso' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao registrar dados de treinamento' });
  }
});

export { mlRoutes };
