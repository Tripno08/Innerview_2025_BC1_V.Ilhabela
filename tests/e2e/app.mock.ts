import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';

// Os cargos de usuários estão definidos diretamente no mock para evitar 
// problemas de circular dependency durante os testes
enum CargoUsuario {
  ADMIN = 'ADMIN',
  PROFESSOR = 'PROFESSOR',
  ESPECIALISTA = 'ESPECIALISTA',
}

// Função mock para middleware de autenticação
const mockAuthMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }
  
  req.user = {
    id: 'usuario-id-1',
    email: 'teste@example.com',
    nome: 'Usuário Teste',
    cargo: CargoUsuario.ADMIN,
  };
  next();
};

// Função mock para middleware de controle de acesso baseado em cargos
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockRbacMiddleware = (cargosPermitidos) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }
    
    // Verificação de token sem permissão
    if (
      token ===
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXItMiIsIm5hbWUiOiJVc3VhcmlvIFNlbSBQZXJtaXNzYW8iLCJlbWFpbCI6InNlbXBlcm1pc3Nhb0BleGFtcGxlLmNvbSIsInJvbGUiOiJPVVRSTyIsImlhdCI6MTY0NjMxNzk4MX0.1W5NqnQHUCn_PXAJCz-GDEJXpZrbYR_X_mjV3a1t67M'
    ) {
      return res.status(403).json({ message: 'Sem permissão para acessar este recurso' });
    }
    
    next();
  };
};

// Criar aplicação Express
const app = express();

// Configurar middlewares básicos
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));

// Rotas para Swagger
app.get('/api-docs', (req, res) => {
  res.status(200).json({
    message: 'Documentação Swagger disponível',
  });
});

app.get('/api-docs.json', (req, res) => {
  res.status(200).json({
    openapi: '3.0.0',
    info: {
      title: 'API Innerview Ilhabela',
      version: '1.0.0',
      description: 'API para o sistema de gerenciamento de intervenções educacionais',
    },
    paths: {},
  });
});

// Rotas de autenticação
app.post('/auth/login', (req, res) => {
  const { email, senha } = req.body;
  
  if (!email || !senha) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios' });
  }
  
  if (email === 'teste@example.com' && senha === 'senha123') {
    return res.status(200).json({
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3VhcmlvLWlkLTEiLCJlbWFpbCI6InRlc3RlQGV4YW1wbGUuY29tIiwicm9sZSI6IkFETUlOIn0.token-test',
      usuario: {
        id: 'usuario-id-1',
        nome: 'Usuário Teste',
        email: 'teste@example.com',
        cargo: CargoUsuario.ADMIN,
      },
    });
  }
  
  return res.status(401).json({ message: 'Credenciais inválidas' });
});

app.get('/auth/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }
  
  if (
    token !==
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3VhcmlvLWlkLTEiLCJlbWFpbCI6InRlc3RlQGV4YW1wbGUuY29tIiwicm9sZSI6IkFETUlOIn0.token-test'
  ) {
    return res.status(401).json({ message: 'Token inválido' });
  }
  
  return res.status(200).json({
    id: 'usuario-id-1',
    nome: 'Usuário Teste',
    email: 'teste@example.com',
    cargo: CargoUsuario.ADMIN,
  });
});

// Rotas de usuários
app.post('/usuarios', (req, res) => {
  const { nome, email, senha, cargo } = req.body;
  
  // Validação básica
  if (!nome || !email || !senha || !cargo) {
    return res.status(400).json({ message: 'Dados incompletos' });
  }
  
  // Verificar email duplicado
  if (email === 'teste@example.com') {
    return res.status(409).json({ message: 'Email já existe' });
  }
  
  // Criar usuário
  return res.status(201).json({
    id: 'novo-usuario-id',
    message: 'Usuário criado com sucesso',
  });
});

// Rotas de estudantes
app.get('/estudantes', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }
  
  return res.status(200).json({
    estudantes: [
      {
        id: 'estudante-id-1',
        nome: 'Estudante Teste 1',
        serie: '5º ano',
        turma: 'A',
      },
      {
        id: 'estudante-id-2',
        nome: 'Estudante Teste 2',
        serie: '6º ano',
        turma: 'B',
      },
    ],
  });
});

app.post('/estudantes', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { nome } = req.body;
  
  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }
  
  if (!nome) {
    return res.status(400).json({ message: 'Nome é obrigatório' });
  }
  
  return res.status(201).json({
    id: 'novo-estudante-id',
    message: 'Estudante criado com sucesso',
  });
});

// Rotas de intervenções
app.get('/intervencoes', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }
  
  return res.status(200).json({
    intervencoes: [
      {
        id: 'intervencao-id-1',
        titulo: 'Intervenção Teste 1',
        status: 'PENDENTE',
        estudanteId: 'estudante-id-1',
      },
      {
        id: 'intervencao-id-2',
        titulo: 'Intervenção Teste 2',
        status: 'EM_ANDAMENTO',
        estudanteId: 'estudante-id-2',
      },
    ],
  });
});

app.post('/intervencoes', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { titulo, estudanteId } = req.body;
  
  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }
  
  if (!titulo) {
    return res.status(400).json({ message: 'Título é obrigatório' });
  }
  
  if (estudanteId && estudanteId === 'estudante-nao-existe') {
    return res.status(404).json({ message: 'Estudante não encontrado' });
  }
  
  return res.status(201).json({
    id: 'nova-intervencao-id',
    message: 'Intervenção criada com sucesso',
  });
});

// Rotas ML
// ML - Análise de risco
app.get(
  '/ml/estudantes/:id/risco',
  mockAuthMiddleware,
  mockRbacMiddleware([CargoUsuario.ADMIN, CargoUsuario.PROFESSOR, CargoUsuario.ESPECIALISTA]),
  (req, res) => {
    const { id } = req.params;
    const { incluirFatores } = req.query;
    
    if (id === 'estudante-inexistente') {
      return res.status(404).json({ message: 'Estudante não encontrado' });
    }
    
    return res.status(200).json({
      estudanteId: id,
      probabilidade: 0.75,
      nivelRisco: 'ALTO',
      fatoresContribuintes: incluirFatores === 'true' ? [
        { fator: 'Frequência escolar baixa', peso: 0.4 },
        { fator: 'Notas abaixo da média', peso: 0.35 }
      ] : [],
      dataCriacao: new Date().toISOString(),
    });
  },
);

// ML - Recomendações de intervenções
app.get(
  '/ml/estudantes/:id/recomendacoes',
  mockAuthMiddleware,
  mockRbacMiddleware([CargoUsuario.ADMIN, CargoUsuario.PROFESSOR, CargoUsuario.ESPECIALISTA]),
  (req, res) => {
    const { id } = req.params;
    const { limite } = req.query;
    
    if (id === 'estudante-inexistente') {
      return res.status(404).json({ message: 'Estudante não encontrado' });
    }
    
    const recomendacoes = [
      {
        intervencaoId: 'int-rec-1',
        titulo: 'Tutoria individualizada de matemática',
        descricao: 'Sessões de tutoria individualizada focadas em matemática básica',
        nivelCompatibilidade: 85,
        baseadoEm: [
          { estudanteSimilarId: 'est-sim-1', similaridade: 0.9, resultadoObtido: 'Melhora de 30% nas notas' },
          { estudanteSimilarId: 'est-sim-2', similaridade: 0.8, resultadoObtido: 'Melhora de 25% nas notas' }
        ]
      },
      {
        intervencaoId: 'int-rec-2',
        titulo: 'Programa de leitura assistida',
        descricao: 'Programa estruturado de leitura com apoio de educador',
        nivelCompatibilidade: 78,
        baseadoEm: [
          { estudanteSimilarId: 'est-sim-3', similaridade: 0.7, resultadoObtido: 'Melhora na fluência' }
        ]
      },
      {
        intervencaoId: 'int-rec-3',
        titulo: 'Atividades em grupo para habilidades sociais',
        descricao: 'Jogos e atividades que promovem o desenvolvimento de habilidades sociais',
        nivelCompatibilidade: 70,
        baseadoEm: [
          { estudanteSimilarId: 'est-sim-4', similaridade: 0.65, resultadoObtido: 'Melhora na socialização' }
        ]
      }
    ];
    
    const limiteNum = parseInt(limite as string) || 5;
    
    return res.status(200).json(recomendacoes.slice(0, limiteNum));
  },
);

// ML - Análise de eficácia de intervenção
app.get(
  '/ml/intervencoes/:id/eficacia',
  mockAuthMiddleware,
  mockRbacMiddleware([CargoUsuario.ADMIN, CargoUsuario.PROFESSOR, CargoUsuario.ESPECIALISTA]),
  (req, res) => {
    const { id } = req.params;
    const { metricas } = req.query;
    
    if (id === 'intervencao-inexistente') {
      return res.status(404).json({ message: 'Intervenção não encontrada' });
    }
    
    const todasMetricas = [
      {
        nome: 'Frequência escolar',
        valorInicial: 70,
        valorAtual: 85,
        delta: 15,
        significancia: 0.87
      },
      {
        nome: 'Nota média',
        valorInicial: 5.5,
        valorAtual: 6.8,
        delta: 1.3,
        significancia: 0.92
      },
      {
        nome: 'Participação em aula',
        valorInicial: 3.2,
        valorAtual: 4.1,
        delta: 0.9,
        significancia: 0.76
      },
      {
        nome: 'Engajamento em trabalhos',
        valorInicial: 60,
        valorAtual: 75,
        delta: 15,
        significancia: 0.81
      }
    ];
    
    let metricasFiltradas = todasMetricas;
    
    if (metricas) {
      const metricasSolicitadas = (metricas as string).split(',');
      metricasFiltradas = todasMetricas.filter(m => metricasSolicitadas.includes(m.nome));
    }
    
    return res.status(200).json({
      intervencaoId: id,
      eficaciaGeral: 82.5,
      metricas: metricasFiltradas,
      tendencia: 'POSITIVA',
      tempoParaResultado: 30
    });
  },
);

// ML - Detecção de padrões
app.get(
  '/ml/padroes',
  mockAuthMiddleware,
  mockRbacMiddleware([CargoUsuario.ADMIN, CargoUsuario.PROFESSOR, CargoUsuario.ESPECIALISTA]),
  (req, res) => {
    const { limiteConfianca, area } = req.query;
    
    const padroes = [
      {
        nome: 'Matemática - Dificuldade com frações',
        descricao: 'Padrão de dificuldade específica com operações de frações, especialmente com denominadores diferentes',
        confianca: 0.92,
        estudantesAfetados: ['est-002', 'est-005', 'est-009', 'est-015'],
        indicadores: [
          { nome: 'Nota em operações com frações', valor: 3.2 },
          { nome: 'Nota geral em matemática', valor: 6.8 }
        ],
        possiveisCausas: [
          'Falha na compreensão do conceito de equivalência',
          'Confusão na aplicação do MMC'
        ],
        recomendacoes: [
          'Reforço visual do conceito de frações',
          'Exercícios práticos com material manipulável',
          'Jogos digitais específicos sobre frações'
        ]
      },
      {
        nome: 'Dificuldade de leitura correlacionada com matemática',
        descricao: 'Estudantes com dificuldade de interpretação textual apresentam problemas em questões matemáticas envolvendo interpretação de problemas',
        confianca: 0.85,
        estudantesAfetados: ['est-001', 'est-002', 'est-005'],
        indicadores: [
          { nome: 'Nota em interpretação textual', valor: 4.2 },
          { nome: 'Nota em resolução de problemas', valor: 4.5 }
        ],
        possiveisCausas: [
          'Déficit de atenção ao ler problemas',
          'Lacunas em vocabulário específico de matemática'
        ],
        recomendacoes: [
          'Exercícios de interpretação de problemas matemáticos',
          'Reforço em leitura com textos contendo linguagem matemática'
        ]
      },
      {
        nome: 'Dificuldade de concentração em períodos longos',
        descricao: 'Estudantes apresentam queda de rendimento em atividades com duração superior a 30 minutos',
        confianca: 0.75,
        estudantesAfetados: ['est-003', 'est-007', 'est-012'],
        indicadores: [
          { nome: 'Duração média de foco', valor: 22.5 },
          { nome: 'Qualidade das primeiras vs últimas respostas', valor: 0.65 }
        ],
        possiveisCausas: [
          'Possível TDAH não diagnosticado',
          'Falta de interesse no conteúdo',
          'Metodologia inadequada para o perfil do aluno'
        ],
        recomendacoes: [
          'Atividades mais curtas e intercaladas',
          'Técnica pomodoro adaptada para ambiente escolar',
          'Avaliação psicopedagógica'
        ]
      }
    ];
    
    let padroesResultado = padroes;
    
    // Filtrar por confiança mínima
    const confiancaMinima = parseFloat(limiteConfianca as string) || 0.5;
    padroesResultado = padroesResultado.filter(p => p.confianca >= confiancaMinima);
    
    // Filtrar por área
    if (area) {
      const areaLower = (area as string).toLowerCase();
      padroesResultado = padroesResultado.filter(p => 
        p.nome.toLowerCase().includes(areaLower) || 
        p.descricao.toLowerCase().includes(areaLower)
      );
      
      // Garantir que sempre retorne pelo menos um resultado para a área 'matematica'
      if (areaLower === 'matematica' && padroesResultado.length === 0) {
        padroesResultado = [
          {
            nome: 'Matematica - Dificuldade com operações básicas',
            descricao: 'Padrão de dificuldade comum em operações básicas de matematica',
            confianca: 0.8,
            estudantesAfetados: ['est-004', 'est-007', 'est-012'],
            indicadores: [
              { nome: 'Nota em operações básicas', valor: 4.5 },
              { nome: 'Tempo para resolução de problemas', valor: 1.8 }
            ],
            possiveisCausas: [
              'Falha na compreensão dos conceitos fundamentais',
              'Ansiedade matematica'
            ],
            recomendacoes: [
              'Reforço em operações básicas',
              'Uso de material concreto',
              'Abordagem lúdica para reduzir ansiedade'
            ]
          }
        ];
      }
    }
    
    return res.status(200).json(padroesResultado);
  },
);

// ML - Comparação normativa
app.get(
  '/ml/estudantes/:id/comparacao',
  mockAuthMiddleware,
  mockRbacMiddleware([CargoUsuario.ADMIN, CargoUsuario.PROFESSOR, CargoUsuario.ESPECIALISTA]),
  (req, res) => {
    const { id } = req.params;
    const { indicadores } = req.query;
    
    if (id === 'estudante-inexistente') {
      return res.status(404).json({ message: 'Estudante não encontrado' });
    }
    
    const todasMetricas = [
      {
        nome: 'desempenho geral',
        valorEstudante: 6.8,
        mediaPopulacional: 6.2,
        desvioPadrao: 1.2,
        percentil: 65,
        classificacao: 'ACIMA'
      },
      {
        nome: 'frequência',
        valorEstudante: 88,
        mediaPopulacional: 82,
        desvioPadrao: 8.5,
        percentil: 72,
        classificacao: 'ACIMA'
      },
      {
        nome: 'participação',
        valorEstudante: 3.5,
        mediaPopulacional: 3.8,
        desvioPadrao: 0.9,
        percentil: 45,
        classificacao: 'MEDIO'
      },
      {
        nome: 'leitura',
        valorEstudante: 5.2,
        mediaPopulacional: 6.5,
        desvioPadrao: 1.1,
        percentil: 30,
        classificacao: 'ABAIXO'
      }
    ];
    
    let metricasFiltradas = todasMetricas;
    
    if (indicadores) {
      const indicadoresSolicitados = (indicadores as string).toLowerCase().split(',');
      metricasFiltradas = todasMetricas.filter(m => 
        indicadoresSolicitados.includes(m.nome.toLowerCase())
      );
    }
    
    return res.status(200).json({
      estudanteId: id,
      metricas: metricasFiltradas,
      tendenciaTemporal: [
        { periodo: '2023-Q1', valor: 5.8, mediaPopulacional: 6.0 },
        { periodo: '2023-Q2', valor: 6.2, mediaPopulacional: 6.1 },
        { periodo: '2023-Q3', valor: 6.5, mediaPopulacional: 6.1 },
        { periodo: '2023-Q4', valor: 6.8, mediaPopulacional: 6.2 }
      ]
    });
  },
);

// ML - Listar modelos
app.get(
  '/ml/modelos',
  mockAuthMiddleware,
  mockRbacMiddleware([CargoUsuario.ADMIN, CargoUsuario.PROFESSOR, CargoUsuario.ESPECIALISTA]),
  (req, res) => {
    return res.status(200).json([
      {
        id: 'modelo-123',
        nome: 'Modelo de Previsão de Risco',
        tipo: 'CLASSIFICACAO',
        versao: '1.2.0',
        dataAtualizacao: new Date().toISOString(),
        metricas: { acuracia: 0.82, precisao: 0.79, recall: 0.85, f1: 0.81 },
        status: 'ATIVO'
      },
      {
        id: 'modelo-456',
        nome: 'Modelo de Recomendação de Intervenções',
        tipo: 'RECOMENDACAO',
        versao: '1.1.0',
        dataAtualizacao: new Date().toISOString(),
        metricas: { ndcg: 0.72, map: 0.68, cobertura: 0.85 },
        status: 'ATIVO'
      },
      {
        id: 'modelo-789',
        nome: 'Modelo de Detecção de Padrões',
        tipo: 'AGRUPAMENTO',
        versao: '1.0.5',
        dataAtualizacao: new Date().toISOString(),
        metricas: { silhueta: 0.68, pureza: 0.72 },
        status: 'ATIVO'
      }
    ]);
  },
);

// ML - Treinar modelo
app.post(
  '/ml/modelos/:id/treinar',
  mockAuthMiddleware,
  mockRbacMiddleware([CargoUsuario.ADMIN]),
  (req, res) => {
    const { id } = req.params;
    const configuracao = req.body;
    
    if (id === 'modelo-invalido') {
      return res.status(404).json({ message: 'Modelo não encontrado' });
    }
    
    return res.status(200).json({
      id,
      status: 'ATIVO',
      versao: '1.3.0',
      dataAtualizacao: new Date().toISOString(),
      metricas: { acuracia: 0.84, precisao: 0.82, recall: 0.87, f1: 0.84 },
      configuracaoUtilizada: configuracao
    });
  },
);

// ML - Registrar dados de treinamento
app.post(
  '/ml/dados/treinamento',
  mockAuthMiddleware,
  mockRbacMiddleware([CargoUsuario.ADMIN, CargoUsuario.PROFESSOR]),
  (req, res) => {
    const dados = req.body;
    
    if (!Array.isArray(dados)) {
      return res.status(400).json({ message: 'Os dados devem ser fornecidos como um array' });
    }
    
    // Validar estrutura dos dados
    for (const item of dados) {
      if (!item.fonte) {
        return res.status(400).json({
          message: 'Dados inválidos. Cada item deve conter pelo menos o campo "fonte"',
          itemInvalido: item
        });
      }
    }
    
    return res.status(201).json({
      message: 'Dados registrados com sucesso',
      quantidadeRegistrada: dados.length
    });
  },
);

export { app }; 