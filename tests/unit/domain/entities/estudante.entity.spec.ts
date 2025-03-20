import { 
  Estudante, 
  EstudanteProps, 
  Avaliacao, 
  AvaliacaoProps 
} from '../../../../src/domain/entities/estudante.entity';
import { 
  DificuldadeAprendizagem,
  TipoDificuldade,
  CategoriaDificuldade 
} from '../../../../src/domain/entities/dificuldade-aprendizagem.entity';

// Mock para o enum Status para evitar dependência direta do Prisma
type StatusMock = 'ATIVO' | 'PENDENTE' | 'AGENDADO' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO';

const StatusMock = {
  ATIVO: 'ATIVO' as StatusMock,
  CANCELADO: 'CANCELADO' as StatusMock
};

describe('Estudante Entity', () => {
  // Fixture de dados válidos
  const dataNascimento = new Date('2010-05-15');
  
  const dadosEstudanteValido: EstudanteProps = {
    id: 'estudante-id-1',
    nome: 'Pedro Santos',
    serie: '5º Ano',
    dataNascimento,
    status: StatusMock.ATIVO as any,
    usuarioId: 'usuario-id-1',
    criadoEm: new Date('2023-01-01'),
    atualizadoEm: new Date('2023-01-01')
  };

  // Mock para DificuldadeAprendizagem
  const mockDificuldade = {
    id: 'dificuldade-id-1',
    nome: 'Dislexia',
    descricao: 'Dificuldade na leitura',
    tipo: TipoDificuldade.LEITURA,
    categoria: CategoriaDificuldade.MODERADA,
    status: StatusMock.ATIVO,
    criadoEm: new Date('2023-01-01'),
    atualizadoEm: new Date('2023-01-01'),
    estaAtiva: jest.fn().mockReturnValue(true),
    ehGrave: jest.fn().mockReturnValue(false)
  } as unknown as DificuldadeAprendizagem;

  const mockDificuldadeGrave = {
    ...mockDificuldade,
    id: 'dificuldade-id-2',
    categoria: CategoriaDificuldade.GRAVE,
    ehGrave: jest.fn().mockReturnValue(true)
  } as unknown as DificuldadeAprendizagem;

  // Mock para Avaliação
  const dadosAvaliacaoValida: AvaliacaoProps = {
    id: 'avaliacao-id-1',
    data: new Date('2023-06-15'),
    tipo: 'Leitura',
    pontuacao: 7.5,
    observacoes: 'Progresso na fluência de leitura',
    criadoEm: new Date('2023-06-15'),
    atualizadoEm: new Date('2023-06-15')
  };

  describe('Criação de estudante', () => {
    it('deve criar um estudante válido com todos os dados fornecidos', () => {
      const estudante = Estudante.criar(dadosEstudanteValido);

      expect(estudante).toBeDefined();
      expect(estudante.id).toEqual(dadosEstudanteValido.id);
      expect(estudante.nome).toEqual(dadosEstudanteValido.nome);
      expect(estudante.serie).toEqual(dadosEstudanteValido.serie);
      expect(estudante.dataNascimento).toEqual(dadosEstudanteValido.dataNascimento);
      expect(estudante.status).toEqual(dadosEstudanteValido.status);
      expect(estudante.usuarioId).toEqual(dadosEstudanteValido.usuarioId);
      expect(estudante.dificuldades).toEqual([]);
      expect(estudante.avaliacoes).toEqual([]);
      expect(estudante.criadoEm).toEqual(dadosEstudanteValido.criadoEm);
      expect(estudante.atualizadoEm).toEqual(dadosEstudanteValido.atualizadoEm);
    });

    it('deve criar um estudante com dificuldades e avaliações', () => {
      const estudanteComRelacionamentos = Estudante.criar({
        ...dadosEstudanteValido,
        dificuldades: [mockDificuldade],
        avaliacoes: [dadosAvaliacaoValida]
      });

      expect(estudanteComRelacionamentos.dificuldades).toHaveLength(1);
      expect(estudanteComRelacionamentos.dificuldades[0]).toEqual(mockDificuldade);
      
      expect(estudanteComRelacionamentos.avaliacoes).toHaveLength(1);
      expect(estudanteComRelacionamentos.avaliacoes[0]).toBeInstanceOf(Avaliacao);
      expect(estudanteComRelacionamentos.avaliacoes[0].id).toEqual(dadosAvaliacaoValida.id);
    });

    it('deve gerar datas automaticamente', () => {
      const agora = new Date();
      jest.spyOn(global, 'Date').mockImplementation(() => agora);

      const dadosSemDatas: EstudanteProps = {
        nome: 'Maria Silva',
        serie: '3º Ano',
        dataNascimento: new Date('2012-02-10'),
        usuarioId: 'usuario-id-2'
      };

      const estudante = Estudante.criar(dadosSemDatas);

      expect(estudante.criadoEm).toEqual(agora);
      expect(estudante.atualizadoEm).toEqual(agora);

      jest.restoreAllMocks();
    });
  });

  describe('Validações', () => {
    it('deve lançar erro ao criar estudante com nome inválido', () => {
      const dadosNomeInvalido: EstudanteProps = {
        ...dadosEstudanteValido,
        nome: 'Jo' // Nome com menos de 3 caracteres
      };

      expect(() => Estudante.criar(dadosNomeInvalido)).toThrow('Nome deve ter pelo menos 3 caracteres');
    });

    it('deve lançar erro ao criar estudante com série vazia', () => {
      const dadosSerieInvalida: EstudanteProps = {
        ...dadosEstudanteValido,
        serie: ''
      };

      expect(() => Estudante.criar(dadosSerieInvalida)).toThrow('Série é obrigatória');
    });

    it('deve lançar erro ao criar estudante com data de nascimento futura', () => {
      const dataFutura = new Date();
      dataFutura.setFullYear(dataFutura.getFullYear() + 1);
      
      const dadosDataInvalida: EstudanteProps = {
        ...dadosEstudanteValido,
        dataNascimento: dataFutura
      };

      expect(() => Estudante.criar(dadosDataInvalida)).toThrow('Data de nascimento não pode ser futura');
    });

    it('deve lançar erro ao criar estudante com data de nascimento muito antiga', () => {
      const dataAntiga = new Date();
      dataAntiga.setFullYear(dataAntiga.getFullYear() - 101);
      
      const dadosDataInvalida: EstudanteProps = {
        ...dadosEstudanteValido,
        dataNascimento: dataAntiga
      };

      expect(() => Estudante.criar(dadosDataInvalida)).toThrow('Data de nascimento muito antiga');
    });
  });

  describe('Restauração', () => {
    it('deve restaurar um estudante a partir de dados persistidos', () => {
      const estudanteRestaurado = Estudante.restaurar(dadosEstudanteValido);
      
      expect(estudanteRestaurado).toBeDefined();
      expect(estudanteRestaurado.id).toEqual(dadosEstudanteValido.id);
      expect(estudanteRestaurado.nome).toEqual(dadosEstudanteValido.nome);
    });
  });

  describe('Manipulação de dificuldades', () => {
    it('deve adicionar uma dificuldade ao estudante', () => {
      const estudante = Estudante.criar(dadosEstudanteValido);
      const estudanteComDificuldade = estudante.adicionarDificuldade(mockDificuldade);
      
      expect(estudanteComDificuldade.dificuldades).toHaveLength(1);
      expect(estudanteComDificuldade.dificuldades[0]).toEqual(mockDificuldade);
    });
    
    it('não deve adicionar dificuldade duplicada', () => {
      const estudante = Estudante.criar(dadosEstudanteValido);
      const estudanteComDificuldade = estudante.adicionarDificuldade(mockDificuldade);
      const estudanteComMesmaDificuldade = estudanteComDificuldade.adicionarDificuldade(mockDificuldade);
      
      expect(estudanteComMesmaDificuldade.dificuldades).toHaveLength(1);
    });
    
    it('deve remover uma dificuldade do estudante', () => {
      const estudante = Estudante.criar({
        ...dadosEstudanteValido,
        dificuldades: [mockDificuldade, mockDificuldadeGrave]
      });
      
      expect(estudante.dificuldades).toHaveLength(2);
      
      const estudanteSemDificuldade = estudante.removerDificuldade(mockDificuldade.id);
      
      expect(estudanteSemDificuldade.dificuldades).toHaveLength(1);
      expect(estudanteSemDificuldade.dificuldades[0].id).toEqual(mockDificuldadeGrave.id);
    });
    
    it('deve verificar se o estudante possui alguma dificuldade grave', () => {
      const estudanteSemDificuldadeGrave = Estudante.criar({
        ...dadosEstudanteValido,
        dificuldades: [mockDificuldade]
      });
      
      const estudanteComDificuldadeGrave = Estudante.criar({
        ...dadosEstudanteValido,
        dificuldades: [mockDificuldade, mockDificuldadeGrave]
      });
      
      expect(estudanteSemDificuldadeGrave.possuiDificuldadeGrave()).toBeFalsy();
      expect(estudanteComDificuldadeGrave.possuiDificuldadeGrave()).toBeTruthy();
    });
  });

  describe('Manipulação de avaliações', () => {
    it('deve adicionar uma avaliação ao estudante', () => {
      const estudante = Estudante.criar(dadosEstudanteValido);
      const novaAvaliacao: AvaliacaoProps = {
        data: new Date('2023-05-10'),
        tipo: 'Matemática',
        pontuacao: 8.5,
        observacoes: 'Ótimo desempenho em cálculos'
      };
      
      const estudanteComAvaliacao = estudante.adicionarAvaliacao(novaAvaliacao);
      
      expect(estudanteComAvaliacao.avaliacoes).toHaveLength(1);
      expect(estudanteComAvaliacao.avaliacoes[0].tipo).toEqual(novaAvaliacao.tipo);
      expect(estudanteComAvaliacao.avaliacoes[0].pontuacao).toEqual(novaAvaliacao.pontuacao);
    });
    
    it('deve calcular a média das avaliações corretamente', () => {
      const avaliacoes: AvaliacaoProps[] = [
        {
          data: new Date('2023-01-15'),
          tipo: 'Português',
          pontuacao: 7.0
        },
        {
          data: new Date('2023-02-20'),
          tipo: 'Matemática',
          pontuacao: 8.0
        },
        {
          data: new Date('2023-03-25'),
          tipo: 'Ciências',
          pontuacao: 9.0
        }
      ];
      
      const estudante = Estudante.criar({
        ...dadosEstudanteValido,
        avaliacoes
      });
      
      expect(estudante.calcularMediaAvaliacoes()).toEqual(8.0);
    });
    
    it('deve retornar 0 como média quando não há avaliações', () => {
      const estudante = Estudante.criar(dadosEstudanteValido);
      
      expect(estudante.calcularMediaAvaliacoes()).toEqual(0);
    });
  });

  describe('Atualização', () => {
    it('deve atualizar os dados do estudante', () => {
      const estudante = Estudante.criar(dadosEstudanteValido);
      
      const dadosAtualizados = {
        nome: 'Pedro Santos Silva',
        serie: '6º Ano',
        dataNascimento: new Date('2010-05-15'),
        status: StatusMock.ATIVO as any,
        usuarioId: 'usuario-id-3'
      };

      const agora = new Date();
      jest.spyOn(global, 'Date').mockImplementation(() => agora);
      
      const estudanteAtualizado = estudante.atualizar(dadosAtualizados);
      
      expect(estudanteAtualizado.id).toEqual(estudante.id);
      expect(estudanteAtualizado.nome).toEqual(dadosAtualizados.nome);
      expect(estudanteAtualizado.serie).toEqual(dadosAtualizados.serie);
      expect(estudanteAtualizado.dataNascimento).toEqual(dadosAtualizados.dataNascimento);
      expect(estudanteAtualizado.status).toEqual(dadosAtualizados.status);
      expect(estudanteAtualizado.usuarioId).toEqual(dadosAtualizados.usuarioId);
      expect(estudanteAtualizado.atualizadoEm).toEqual(agora);
      
      jest.restoreAllMocks();
    });
  });

  describe('Inativação e status', () => {
    it('deve inativar um estudante', () => {
      const estudante = Estudante.criar({
        ...dadosEstudanteValido,
        status: StatusMock.ATIVO as any
      });
      
      const agora = new Date();
      jest.spyOn(global, 'Date').mockImplementation(() => agora);
      
      const estudanteInativado = estudante.inativar();
      
      expect(estudanteInativado.status).toEqual(StatusMock.CANCELADO);
      expect(estudanteInativado.atualizadoEm).toEqual(agora);
      
      jest.restoreAllMocks();
    });
    
    it('deve verificar se o estudante está ativo', () => {
      const estudanteAtivo = Estudante.criar({
        ...dadosEstudanteValido,
        status: StatusMock.ATIVO as any
      });
      
      const estudanteInativo = Estudante.criar({
        ...dadosEstudanteValido,
        status: StatusMock.CANCELADO as any
      });
      
      expect(estudanteAtivo.estaAtivo()).toBeTruthy();
      expect(estudanteInativo.estaAtivo()).toBeFalsy();
    });
  });

  describe('Cálculo de idade', () => {
    it('deve calcular a idade corretamente', () => {
      // Mockando Date.now para ter uma data fixa para o teste
      const dataAtual = new Date('2023-10-10');
      jest.spyOn(global, 'Date').mockImplementation(() => dataAtual);
      
      // Estudante nascido em 15/05/2010
      const estudante = Estudante.criar(dadosEstudanteValido);
      
      // Em 10/10/2023, o estudante teria 13 anos
      expect(estudante.calcularIdade()).toEqual(13);
      
      jest.restoreAllMocks();
    });
    
    it('deve ajustar a idade quando ainda não fez aniversário no ano atual', () => {
      // Data atual antes do aniversário do estudante no ano
      const dataAtual = new Date('2023-05-10'); // 10/05/2023, antes do aniversário em 15/05
      jest.spyOn(global, 'Date').mockImplementation(() => dataAtual);
      
      // Estudante nascido em 15/05/2010
      const estudante = Estudante.criar(dadosEstudanteValido);
      
      // Em 10/05/2023, o estudante teria 12 anos (ainda não completou 13)
      expect(estudante.calcularIdade()).toEqual(12);
      
      jest.restoreAllMocks();
    });
  });
}); 