import { Request, Response, NextFunction } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import { AppError } from '@shared/errors/app-error';

/**
 * Middleware para validação de dados utilizando o celebrate
 */
export const ValidationMiddleware = {
  /**
   * Valida o corpo da requisição
   */
  validateBody: (schema: Joi.ObjectSchema) => celebrate({ [Segments.BODY]: schema }),

  /**
   * Valida os parâmetros da requisição
   */
  validateParams: (schema: Joi.ObjectSchema | Record<string, Joi.ObjectSchema>) => {
    if ('id' in schema && typeof schema.id !== 'string') {
      // É um objeto de esquemas, como { id: schema, outroParam: schema }
      return celebrate({ [Segments.PARAMS]: schema });
    }
    // É um esquema diretamente, como schemas.id
    return celebrate({ [Segments.PARAMS]: schema });
  },

  /**
   * Valida as query strings da requisição
   */
  validateQuery: (schema: Joi.ObjectSchema) => celebrate({ [Segments.QUERY]: schema }),

  /**
   * Middleware para tratar erros de validação
   */
  handleValidationErrors: (
    err: Error & { joi?: { details: Array<{ message: string; path: string[]; type: string }> } },
    req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    if (err.joi) {
      const errorDetails = err.joi.details.map((detail) => ({
        message: detail.message,
        path: detail.path,
        type: detail.type,
      }));

      return res.status(400).json({
        status: 'error',
        message: 'Erro de validação',
        details: errorDetails,
      });
    }

    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        status: 'error',
        message: err.message,
      });
    }

    console.error(err);

    return res.status(500).json({
      status: 'error',
      message: 'Erro interno do servidor',
    });
  },

  /**
   * Esquemas de validação comuns
   */
  schemas: {
    id: Joi.object({
      id: Joi.string().uuid().required(),
    }),

    pagination: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(10),
    }),

    periodo: Joi.object({
      dataInicio: Joi.date().iso(),
      dataFim: Joi.date().iso().min(Joi.ref('dataInicio')),
    }),

    usuario: {
      registro: Joi.object({
        nome: Joi.string().min(3).max(100).required(),
        email: Joi.string().email().required(),
        senha: Joi.string().min(6).required(),
        cargo: Joi.string().required(),
      }),

      autenticacao: Joi.object({
        email: Joi.string().email().required(),
        senha: Joi.string().required(),
      }),

      atualizacao: Joi.object({
        nome: Joi.string().min(3).max(100),
        email: Joi.string().email(),
        senhaAtual: Joi.string().when('novaSenha', {
          is: Joi.exist(),
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),
        novaSenha: Joi.string().min(6),
        cargo: Joi.string(),
      }),
    },

    estudante: {
      criacao: Joi.object({
        nome: Joi.string().min(3).max(100).required(),
        dataNascimento: Joi.date().iso().required(),
        genero: Joi.string().valid('M', 'F', 'OUTRO').required(),
        anoEscolar: Joi.string().required(),
        turma: Joi.string().required(),
        turno: Joi.string().valid('MANHA', 'TARDE', 'NOITE').required(),
        responsaveis: Joi.array()
          .items(
            Joi.object({
              nome: Joi.string().min(3).max(100).required(),
              telefone: Joi.string().required(),
              email: Joi.string().email(),
              tipo: Joi.string().required(),
            }),
          )
          .min(1),
        instituicaoId: Joi.string().uuid().required(),
        observacoes: Joi.string(),
      }),
    },

    intervencao: {
      criacao: Joi.object({
        titulo: Joi.string().min(3).max(100).required(),
        descricao: Joi.string().required(),
        objetivos: Joi.string().required(),
        estrategias: Joi.string().required(),
        recursos: Joi.string(),
        estudanteId: Joi.string().uuid().required(),
        dificuldadesIds: Joi.array().items(Joi.string().uuid()).min(1).required(),
        responsaveisIds: Joi.array().items(Joi.string().uuid()).min(1).required(),
        dataInicio: Joi.date().iso().required(),
        dataFim: Joi.date().iso().min(Joi.ref('dataInicio')),
        observacoes: Joi.string(),
      }),

      progresso: Joi.object({
        data: Joi.date().iso().required(),
        descricao: Joi.string().required(),
        resultados: Joi.string(),
        observacoes: Joi.string(),
      }),
    },

    equipe: {
      criacao: Joi.object({
        nome: Joi.string().min(3).max(100).required(),
        descricao: Joi.string(),
        tipo: Joi.string().required(),
        instituicaoId: Joi.string().uuid().required(),
        coordenadorId: Joi.string().uuid(),
        membrosIds: Joi.array().items(Joi.string().uuid()),
      }),

      membro: Joi.object({
        usuarioId: Joi.string().uuid().required(),
        funcao: Joi.string().required(),
        permissoes: Joi.array().items(Joi.string()),
      }),
    },

    reuniao: {
      criacao: Joi.object({
        titulo: Joi.string().min(3).max(100).required(),
        data: Joi.date().iso().required(),
        horaInicio: Joi.string()
          .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
          .required(),
        horaFim: Joi.string()
          .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
          .required(),
        local: Joi.string().required(),
        pauta: Joi.string().required(),
        equipeId: Joi.string().uuid().required(),
        participantesIds: Joi.array().items(Joi.string().uuid()).min(1),
        observacoes: Joi.string(),
      }),
    },

    dificuldade: {
      criacao: Joi.object({
        nome: Joi.string().min(3).max(100).required(),
        descricao: Joi.string().required(),
        tipo: Joi.string().required(),
        categoria: Joi.string().required(),
        sintomas: Joi.string().required(),
      }),

      associacao: Joi.object({
        observacoes: Joi.string(),
        dataIdentificacao: Joi.date().iso(),
      }),
    },
  },
};
