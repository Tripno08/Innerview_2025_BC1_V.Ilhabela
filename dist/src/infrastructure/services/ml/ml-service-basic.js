"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MLServiceBasic = void 0;
const tsyringe_1 = require("tsyringe");
const crypto_1 = require("crypto");
let MLServiceBasic = class MLServiceBasic {
    estudanteRepository;
    intervencaoRepository;
    dadosTreinamento = [];
    modelos = [
        {
            id: (0, crypto_1.randomUUID)(),
            nome: 'Modelo Básico de Previsão de Risco',
            tipo: 'CLASSIFICACAO',
            versao: '1.0.0',
            dataAtualizacao: new Date(),
            metricas: { acuracia: 0.75, precisao: 0.7, recall: 0.65, f1: 0.67 },
            status: 'ATIVO',
        },
        {
            id: (0, crypto_1.randomUUID)(),
            nome: 'Modelo Básico de Recomendação',
            tipo: 'RECOMENDACAO',
            versao: '1.0.0',
            dataAtualizacao: new Date(),
            metricas: { ndcg: 0.68, map: 0.65, cobertura: 0.72 },
            status: 'ATIVO',
        },
    ];
    constructor(estudanteRepository, intervencaoRepository) {
        this.estudanteRepository = estudanteRepository;
        this.intervencaoRepository = intervencaoRepository;
    }
    async preverRiscoAcademico(estudante, incluirFatores = false) {
        const fatores = this.analisarFatoresRisco(estudante);
        const pontuacaoRisco = fatores.reduce((sum, fator) => sum + fator.peso * 100, 0) / fatores.length;
        let nivelRisco = 'BAIXO';
        if (pontuacaoRisco >= 75)
            nivelRisco = 'CRITICO';
        else if (pontuacaoRisco >= 50)
            nivelRisco = 'ALTO';
        else if (pontuacaoRisco >= 25)
            nivelRisco = 'MEDIO';
        return {
            estudanteId: estudante.id,
            probabilidade: pontuacaoRisco,
            nivelRisco,
            fatoresContribuintes: incluirFatores ? fatores : [],
            dataCriacao: new Date(),
        };
    }
    async recomendarIntervencoes(estudante, dificuldades, limite = 5) {
        const recomendacoes = [];
        const intervencoesPossiveis = [
            {
                id: (0, crypto_1.randomUUID)(),
                titulo: 'Tutoria individualizada de matemática',
                descricao: 'Sessões de tutoria individualizada focadas em matemática básica',
                compatibilidade: this.calcularCompatibilidade(estudante, 'matematica'),
                estudantesSimulares: this.encontrarEstudantesSimilares(estudante, 3),
            },
            {
                id: (0, crypto_1.randomUUID)(),
                titulo: 'Programa de leitura assistida',
                descricao: 'Programa estruturado de leitura com apoio de educador',
                compatibilidade: this.calcularCompatibilidade(estudante, 'leitura'),
                estudantesSimulares: this.encontrarEstudantesSimilares(estudante, 2),
            },
            {
                id: (0, crypto_1.randomUUID)(),
                titulo: 'Sessões de terapia cognitivo-comportamental',
                descricao: 'Terapia focada em ansiedade e problemas comportamentais',
                compatibilidade: this.calcularCompatibilidade(estudante, 'comportamento'),
                estudantesSimulares: this.encontrarEstudantesSimilares(estudante, 2),
            },
            {
                id: (0, crypto_1.randomUUID)(),
                titulo: 'Atividades em grupo para habilidades sociais',
                descricao: 'Jogos e atividades que promovem o desenvolvimento de habilidades sociais',
                compatibilidade: this.calcularCompatibilidade(estudante, 'social'),
                estudantesSimulares: this.encontrarEstudantesSimilares(estudante, 2),
            },
            {
                id: (0, crypto_1.randomUUID)(),
                titulo: 'Monitoramento diário de presença e participação',
                descricao: 'Sistema de checkin/checkout diário com feedback imediato',
                compatibilidade: this.calcularCompatibilidade(estudante, 'presenca'),
                estudantesSimulares: this.encontrarEstudantesSimilares(estudante, 1),
            },
        ];
        let intervencoesFiltradas = intervencoesPossiveis;
        if (dificuldades && dificuldades.length > 0) {
            const areas = dificuldades.map((d) => d.nome.toLowerCase());
            intervencoesFiltradas = intervencoesPossiveis.filter((i) => {
                return areas.some((area) => i.titulo.toLowerCase().includes(area) || i.descricao.toLowerCase().includes(area));
            });
        }
        intervencoesFiltradas
            .sort((a, b) => b.compatibilidade - a.compatibilidade)
            .slice(0, limite)
            .forEach((i) => {
            recomendacoes.push({
                intervencaoId: i.id,
                titulo: i.titulo,
                descricao: i.descricao,
                nivelCompatibilidade: i.compatibilidade,
                baseadoEm: i.estudantesSimulares,
            });
        });
        return recomendacoes;
    }
    async analisarEficaciaIntervencao(intervencao, metricas) {
        const metricasComparativas = [
            {
                nome: 'Frequência escolar',
                valorInicial: 70,
                valorAtual: 85,
                delta: 15,
                significancia: 0.87,
            },
            {
                nome: 'Nota média',
                valorInicial: 5.5,
                valorAtual: 6.8,
                delta: 1.3,
                significancia: 0.92,
            },
            {
                nome: 'Participação em aula',
                valorInicial: 3.2,
                valorAtual: 4.1,
                delta: 0.9,
                significancia: 0.76,
            },
            {
                nome: 'Engajamento em trabalhos',
                valorInicial: 60,
                valorAtual: 75,
                delta: 15,
                significancia: 0.81,
            },
        ];
        const metricasFiltradas = metricas && metricas.length > 0
            ? metricasComparativas.filter((m) => metricas.includes(m.nome))
            : metricasComparativas;
        const eficaciaGeral = metricasFiltradas.reduce((sum, m) => {
            const pontuacaoDelta = Math.min((m.delta / m.valorInicial) * 100, 100);
            return sum + pontuacaoDelta * m.significancia;
        }, 0) / metricasFiltradas.reduce((sum, m) => sum + m.significancia, 0);
        const mediaDelta = metricasFiltradas.reduce((sum, m) => sum + m.delta, 0) / metricasFiltradas.length;
        let tendencia = 'NEUTRA';
        if (mediaDelta > 1)
            tendencia = 'POSITIVA';
        else if (mediaDelta < -0.5)
            tendencia = 'NEGATIVA';
        return {
            intervencaoId: intervencao.id,
            eficaciaGeral,
            metricas: metricasFiltradas,
            tendencia,
            tempoParaResultado: 30,
        };
    }
    async detectarPadroes(filtros, limiteConfianca = 0.7) {
        const padroesPredefinidos = [
            {
                nome: 'Dificuldade de leitura correlacionada com matemática',
                descricao: 'Estudantes com dificuldade de interpretação textual apresentam problemas em questões matemáticas envolvendo interpretação de problemas',
                confianca: 0.85,
                estudantesAfetados: ['est-001', 'est-002', 'est-005'],
                indicadores: [
                    { nome: 'Nota em interpretação textual', valor: 4.2 },
                    { nome: 'Nota em resolução de problemas', valor: 4.5 },
                ],
                possiveisCausas: [
                    'Déficit de atenção ao ler problemas',
                    'Lacunas em vocabulário específico de matemática',
                ],
                recomendacoes: [
                    'Exercícios de interpretação de problemas matemáticos',
                    'Reforço em leitura com textos contendo linguagem matemática',
                ],
            },
            {
                nome: 'Absenteísmo correlacionado com baixo suporte familiar',
                descricao: 'Estudantes com alto índice de faltas tendem a ter menos suporte e acompanhamento da família',
                confianca: 0.78,
                estudantesAfetados: ['est-003', 'est-007', 'est-012'],
                indicadores: [
                    { nome: 'Taxa de absenteísmo', valor: 22.3 },
                    { nome: 'Índice de participação dos pais', valor: 2.1 },
                ],
                possiveisCausas: ['Pais com múltiplos empregos', 'Falta de comunicação escola-família'],
                recomendacoes: [
                    'Programa de comunicação família-escola',
                    'Grupo de apoio para pais/responsáveis',
                ],
            },
            {
                nome: 'Dificuldade motora fina afetando escrita',
                descricao: 'Estudantes com dificuldades na coordenação motora fina apresentam caligrafia ilegível e lentidão na escrita',
                confianca: 0.72,
                estudantesAfetados: ['est-004', 'est-009'],
                indicadores: [
                    { nome: 'Avaliação de coordenação motora', valor: 3.8 },
                    { nome: 'Tempo médio de escrita (palavras/min)', valor: 8.5 },
                ],
                possiveisCausas: [
                    'Desenvolvimento motor tardio',
                    'Falta de atividades de coordenação motora',
                ],
                recomendacoes: [
                    'Terapia ocupacional',
                    'Atividades específicas para coordenação motora fina',
                ],
            },
        ];
        let padroesFiltrados = padroesPredefinidos.filter((p) => p.confianca >= limiteConfianca);
        if (filtros) {
            if (filtros.area) {
                padroesFiltrados = padroesFiltrados.filter((p) => p.nome.toLowerCase().includes(filtros.area.toLowerCase()) ||
                    p.descricao.toLowerCase().includes(filtros.area.toLowerCase()));
            }
            if (filtros.estudanteId) {
                padroesFiltrados = padroesFiltrados.filter((p) => p.estudantesAfetados.includes(filtros.estudanteId));
            }
        }
        return padroesFiltrados;
    }
    async compararComNormas(estudante, indicadores) {
        const metricas = indicadores.map((indicador) => {
            const valorEstudante = this.simularValorEstudante(estudante, indicador);
            const mediaPop = this.simularMediaPopulacional(indicador);
            const desvioPadrao = mediaPop * 0.15;
            const zScore = (valorEstudante - mediaPop) / desvioPadrao;
            const percentil = this.zScoreParaPercentil(zScore);
            let classificacao = 'MEDIO';
            if (percentil >= 95)
                classificacao = 'MUITO_ACIMA';
            else if (percentil >= 75)
                classificacao = 'ACIMA';
            else if (percentil <= 5)
                classificacao = 'MUITO_ABAIXO';
            else if (percentil <= 25)
                classificacao = 'ABAIXO';
            return {
                nome: indicador,
                valorEstudante,
                mediaPopulacional: mediaPop,
                desvioPadrao,
                percentil,
                classificacao,
            };
        });
        const periodosAnalise = ['1º Bimestre', '2º Bimestre', '3º Bimestre', 'Atual'];
        const tendenciaTemporal = periodosAnalise.map((periodo) => {
            const baseIndex = periodosAnalise.indexOf(periodo);
            const valorBase = metricas[0]?.valorEstudante * 0.7 || 5;
            return {
                periodo,
                valor: valorBase + baseIndex * 0.5,
                mediaPopulacional: metricas[0]?.mediaPopulacional || 6,
            };
        });
        return {
            estudanteId: estudante.id,
            metricas,
            tendenciaTemporal,
        };
    }
    async registrarDadosTreinamento(dados) {
        this.dadosTreinamento.push(...dados);
        console.log(`Registrados ${dados.length} novos dados para treinamento`);
    }
    async listarModelos(tipo) {
        if (tipo) {
            return this.modelos.filter((m) => m.tipo === tipo);
        }
        return this.modelos;
    }
    async treinarModelo(modeloId, _configuracao) {
        const modelo = this.modelos.find((m) => m.id === modeloId);
        if (!modelo) {
            throw new Error(`Modelo com ID ${modeloId} não encontrado`);
        }
        console.log(`Iniciando treinamento do modelo ${modelo.nome}`);
        modelo.status = 'TREINANDO';
        return new Promise((resolve) => {
            setTimeout(() => {
                Object.keys(modelo.metricas).forEach((key) => {
                    modelo.metricas[key] = Math.min(modelo.metricas[key] + Math.random() * 0.05, 1.0);
                });
                const versionParts = modelo.versao.split('.');
                versionParts[2] = (parseInt(versionParts[2]) + 1).toString();
                modelo.versao = versionParts.join('.');
                modelo.dataAtualizacao = new Date();
                modelo.status = 'ATIVO';
                resolve(modelo);
            }, 1000);
        });
    }
    analisarFatoresRisco(estudante) {
        const fatores = [];
        const idade = this.calcularIdade(estudante.dataNascimento);
        if (idade > 12) {
            fatores.push({
                fator: 'Idade acima da média para a série',
                peso: Math.min((idade - 12) * 0.05, 0.3),
            });
        }
        const temHistoricoReprovacao = Math.random() > 0.7;
        if (temHistoricoReprovacao) {
            fatores.push({
                fator: 'Histórico de reprovação',
                peso: 0.4,
            });
        }
        const frequencia = 70 + Math.random() * 30;
        if (frequencia < 85) {
            fatores.push({
                fator: 'Baixa frequência escolar',
                peso: (85 - frequencia) / 100,
            });
        }
        const ocorrencias = Math.floor(Math.random() * 5);
        if (ocorrencias > 2) {
            fatores.push({
                fator: 'Múltiplas ocorrências disciplinares',
                peso: ocorrencias * 0.1,
            });
        }
        const desempenho = 4 + Math.random() * 6;
        if (desempenho < 6) {
            fatores.push({
                fator: 'Desempenho abaixo da média',
                peso: (6 - desempenho) / 10,
            });
        }
        return fatores;
    }
    calcularIdade(dataNascimento) {
        const hoje = new Date();
        let idade = hoje.getFullYear() - dataNascimento.getFullYear();
        const m = hoje.getMonth() - dataNascimento.getMonth();
        if (m < 0 || (m === 0 && hoje.getDate() < dataNascimento.getDate())) {
            idade--;
        }
        return idade;
    }
    calcularCompatibilidade(estudante, area) {
        const baseCompatibilidade = 50 + Math.random() * 30;
        let ajuste = 0;
        switch (area) {
            case 'matematica':
                ajuste = Math.max(0, 20 - this.calcularIdade(estudante.dataNascimento));
                break;
            case 'leitura':
                ajuste = estudante.serie ? parseInt(estudante.serie.charAt(0)) * 3 : 0;
                break;
            case 'comportamento':
                ajuste = Math.random() > 0.5 ? 10 : -10;
                break;
            case 'social':
                ajuste = Math.min(20, this.calcularIdade(estudante.dataNascimento) * 2);
                break;
            case 'presenca':
                ajuste = Math.random() * 15;
                break;
        }
        return Math.min(100, Math.max(0, baseCompatibilidade + ajuste));
    }
    encontrarEstudantesSimilares(estudante, quantidade) {
        const estudantesSimilares = [];
        for (let i = 0; i < quantidade; i++) {
            estudantesSimilares.push({
                estudanteSimilarId: `est-${1000 + Math.floor(Math.random() * 1000)}`,
                similaridade: 0.5 + Math.random() * 0.4,
                resultadoObtido: Math.random() > 0.7 ? 'Melhoria significativa' : 'Melhoria moderada',
            });
        }
        return estudantesSimilares.sort((a, b) => b.similaridade - a.similaridade);
    }
    simularValorEstudante(estudante, indicador) {
        switch (indicador.toLowerCase()) {
            case 'desempenho geral':
                return 4 + Math.random() * 6;
            case 'frequência':
                return 70 + Math.random() * 30;
            case 'participação':
                return 1 + Math.random() * 4;
            case 'comportamento':
                return 2 + Math.random() * 3;
            case 'interação social':
                return 1 + Math.random() * 5;
            default:
                return 5 + Math.random() * 5;
        }
    }
    simularMediaPopulacional(indicador) {
        switch (indicador.toLowerCase()) {
            case 'desempenho geral':
                return 6.5;
            case 'frequência':
                return 85;
            case 'participação':
                return 3.2;
            case 'comportamento':
                return 3.8;
            case 'interação social':
                return 3.5;
            default:
                return 6;
        }
    }
    zScoreParaPercentil(zScore) {
        const z = Math.max(-4, Math.min(4, zScore));
        let percentil = 50;
        if (z > 0) {
            percentil = 50 + z * 10;
        }
        else if (z < 0) {
            percentil = 50 - Math.abs(z) * 10;
        }
        return Math.max(0, Math.min(100, percentil));
    }
    async treinarModeloPersonalizado(_configuracao) {
        return {
            id: (0, crypto_1.randomUUID)(),
            nome: 'Modelo Personalizado',
            tipo: 'CLASSIFICACAO',
            versao: '1.0.0',
            dataAtualizacao: new Date(),
            metricas: { acuracia: 0.8, precisao: 0.78, recall: 0.76, f1: 0.77 },
            status: 'ATIVO',
        };
    }
};
exports.MLServiceBasic = MLServiceBasic;
exports.MLServiceBasic = MLServiceBasic = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [Object, Object])
], MLServiceBasic);
//# sourceMappingURL=ml-service-basic.js.map