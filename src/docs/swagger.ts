import swaggerJsdoc from 'swagger-jsdoc';
import { version } from '../../package.json';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Innerview Ilhabela API',
      version,
      description:
        'API para o sistema Innerview Ilhabela - Acompanhamento e intervenção personalizada de estudantes',
      license: {
        name: 'MIT',
      },
      contact: {
        name: 'Equipe Innerview',
        email: 'contato@innerview.edu.br',
      },
    },
    servers: [
      {
        url: 'http://localhost:3333',
        description: 'Servidor de Desenvolvimento',
      },
      {
        url: 'https://api.innerview.edu.br',
        description: 'Servidor de Produção',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Usuario: {
          type: 'object',
          required: ['nome', 'email', 'cargo'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único do usuário',
            },
            nome: {
              type: 'string',
              description: 'Nome completo do usuário',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do usuário (único)',
            },
            cargo: {
              type: 'string',
              description: 'Cargo do usuário na instituição',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação do registro',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data da última atualização do registro',
            },
          },
        },
        Estudante: {
          type: 'object',
          required: [
            'nome',
            'dataNascimento',
            'genero',
            'anoEscolar',
            'turma',
            'turno',
            'instituicaoId',
          ],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único do estudante',
            },
            nome: {
              type: 'string',
              description: 'Nome completo do estudante',
            },
            dataNascimento: {
              type: 'string',
              format: 'date',
              description: 'Data de nascimento do estudante',
            },
            genero: {
              type: 'string',
              enum: ['M', 'F', 'OUTRO'],
              description: 'Gênero do estudante',
            },
            anoEscolar: {
              type: 'string',
              description: 'Ano escolar do estudante',
            },
            turma: {
              type: 'string',
              description: 'Turma do estudante',
            },
            turno: {
              type: 'string',
              enum: ['MANHA', 'TARDE', 'NOITE'],
              description: 'Turno escolar do estudante',
            },
            responsaveis: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  nome: {
                    type: 'string',
                    description: 'Nome do responsável',
                  },
                  telefone: {
                    type: 'string',
                    description: 'Telefone de contato',
                  },
                  email: {
                    type: 'string',
                    format: 'email',
                    description: 'Email do responsável',
                  },
                  tipo: {
                    type: 'string',
                    description: 'Tipo de responsável (Mãe, Pai, Outro)',
                  },
                },
              },
            },
            instituicaoId: {
              type: 'string',
              format: 'uuid',
              description: 'ID da instituição do estudante',
            },
            observacoes: {
              type: 'string',
              description: 'Observações gerais sobre o estudante',
            },
          },
        },
        Intervencao: {
          type: 'object',
          required: [
            'titulo',
            'descricao',
            'objetivos',
            'estrategias',
            'estudanteId',
            'dificuldadesIds',
            'responsaveisIds',
            'dataInicio',
          ],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único da intervenção',
            },
            titulo: {
              type: 'string',
              description: 'Título da intervenção',
            },
            descricao: {
              type: 'string',
              description: 'Descrição detalhada da intervenção',
            },
            objetivos: {
              type: 'string',
              description: 'Objetivos a serem alcançados',
            },
            estrategias: {
              type: 'string',
              description: 'Estratégias a serem utilizadas',
            },
            recursos: {
              type: 'string',
              description: 'Recursos necessários para a intervenção',
            },
            status: {
              type: 'string',
              enum: ['PLANEJADA', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA'],
              default: 'PLANEJADA',
              description: 'Status atual da intervenção',
            },
            dataInicio: {
              type: 'string',
              format: 'date',
              description: 'Data de início da intervenção',
            },
            dataFim: {
              type: 'string',
              format: 'date',
              description: 'Data de término prevista da intervenção',
            },
            estudanteId: {
              type: 'string',
              format: 'uuid',
              description: 'ID do estudante associado à intervenção',
            },
            dificuldadesIds: {
              type: 'array',
              items: {
                type: 'string',
                format: 'uuid',
              },
              description: 'IDs das dificuldades associadas à intervenção',
            },
            responsaveisIds: {
              type: 'array',
              items: {
                type: 'string',
                format: 'uuid',
              },
              description: 'IDs dos responsáveis pela intervenção',
            },
            observacoes: {
              type: 'string',
              description: 'Observações gerais sobre a intervenção',
            },
          },
        },
        DificuldadeAprendizagem: {
          type: 'object',
          required: ['nome', 'descricao', 'categoria', 'area', 'nivel'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único da dificuldade',
            },
            nome: {
              type: 'string',
              description: 'Nome da dificuldade de aprendizagem',
            },
            descricao: {
              type: 'string',
              description: 'Descrição detalhada da dificuldade',
            },
            categoria: {
              type: 'string',
              description: 'Categoria da dificuldade',
            },
            area: {
              type: 'string',
              description: 'Área de conhecimento afetada',
            },
            nivel: {
              type: 'string',
              enum: ['LEVE', 'MODERADA', 'GRAVE'],
              description: 'Nível de severidade da dificuldade',
            },
            sintomas: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Sintomas associados à dificuldade',
            },
            recomendacoes: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Recomendações para lidar com a dificuldade',
            },
          },
        },
        Equipe: {
          type: 'object',
          required: ['nome', 'tipo', 'instituicaoId'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único da equipe',
            },
            nome: {
              type: 'string',
              description: 'Nome da equipe',
            },
            descricao: {
              type: 'string',
              description: 'Descrição da equipe',
            },
            tipo: {
              type: 'string',
              description: 'Tipo de equipe (Multidisciplinar, Pedagógica, etc)',
            },
            status: {
              type: 'string',
              enum: ['ATIVA', 'INATIVA'],
              default: 'ATIVA',
              description: 'Status atual da equipe',
            },
            instituicaoId: {
              type: 'string',
              format: 'uuid',
              description: 'ID da instituição associada',
            },
            coordenadorId: {
              type: 'string',
              format: 'uuid',
              description: 'ID do coordenador da equipe',
            },
          },
        },
        Reuniao: {
          type: 'object',
          required: ['titulo', 'data', 'horaInicio', 'horaFim', 'local', 'pauta', 'equipeId'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único da reunião',
            },
            titulo: {
              type: 'string',
              description: 'Título da reunião',
            },
            data: {
              type: 'string',
              format: 'date',
              description: 'Data da reunião',
            },
            horaInicio: {
              type: 'string',
              pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
              description: 'Hora de início da reunião (HH:MM)',
            },
            horaFim: {
              type: 'string',
              pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
              description: 'Hora de término da reunião (HH:MM)',
            },
            local: {
              type: 'string',
              description: 'Local da reunião',
            },
            pauta: {
              type: 'string',
              description: 'Pauta da reunião',
            },
            status: {
              type: 'string',
              enum: ['AGENDADA', 'REALIZADA', 'CANCELADA'],
              default: 'AGENDADA',
              description: 'Status da reunião',
            },
            equipeId: {
              type: 'string',
              format: 'uuid',
              description: 'ID da equipe associada à reunião',
            },
            observacoes: {
              type: 'string',
              description: 'Observações gerais sobre a reunião',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error',
            },
            message: {
              type: 'string',
              example: 'Mensagem de erro',
            },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                  },
                  path: {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                  },
                  type: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Token de autenticação ausente, inválido ou expirado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                status: 'error',
                message: 'Token inválido ou expirado',
              },
            },
          },
        },
        ForbiddenError: {
          description: 'Acesso negado - usuário não possui permissão necessária',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                status: 'error',
                message: 'Acesso negado - Permissão insuficiente',
              },
            },
          },
        },
        NotFoundError: {
          description: 'Recurso não encontrado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                status: 'error',
                message: 'Recurso não encontrado',
              },
            },
          },
        },
        ValidationError: {
          description: 'Erro de validação nos dados enviados',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                status: 'error',
                message: 'Erro de validação',
                details: [
                  {
                    message: '"email" must be a valid email',
                    path: ['email'],
                    type: 'string.email',
                  },
                ],
              },
            },
          },
        },
        ServerError: {
          description: 'Erro interno do servidor',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                status: 'error',
                message: 'Erro interno do servidor',
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    './src/interfaces/routes/*.ts',
    './src/interfaces/controllers/*.ts',
    './src/docs/routes/*.yaml',
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerSpec };
