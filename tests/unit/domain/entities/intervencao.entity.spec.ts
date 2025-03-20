import { 
  IntervencaoProps,
  IntervencaoBaseProps,
  IntervencaoInstanciaProps,
  TipoIntervencao,
  CatalogoIntervencao,
  Intervencao
} from '../../../../src/domain/entities/intervencao.entity';

// Mock para o enum Status para evitar dependência direta do Prisma
type StatusMock = 'ATIVO' | 'PENDENTE' | 'AGENDADO' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO';

const StatusMock = {
  ATIVO: 'ATIVO' as StatusMock,
  CANCELADO: 'CANCELADO' as StatusMock,
  CONCLUIDO: 'CONCLUIDO' as StatusMock
};

describe('Intervenção Entities', () => {
  // Fixtures de dados para reutilização
  const dadosIntervencaoBase: IntervencaoBaseProps = {
    id: 'intervencao-base-id-1',
    titulo: 'Técnicas de Leitura Facilitada',
    descricao: 'Conjunto de técnicas para apoiar o desenvolvimento da leitura em estudantes com dificuldades específicas.',
    tipo: TipoIntervencao.PEDAGOGICA,
    status: StatusMock.ATIVO as any,
    duracao: 90, // dias
    dificuldadesAlvo: ['Dislexia', 'Dificuldade de Leitura'],
    publico: ['Estudantes do 2º ao 5º ano'],
    recursos: ['Livros adaptados', 'Jogos de alfabetização', 'Cartões de apoio visual'],
    criadoEm: new Date('2023-01-01'),
    atualizadoEm: new Date('2023-01-01')
  };

  const dadosIntervencaoInstancia: IntervencaoInstanciaProps = {
    id: 'intervencao-id-1',
    titulo: 'Aplicação de Técnicas de Leitura para João',
    descricao: 'Intervenção de leitura adaptada para o estudante João, focando em fluência e compreensão.',
    tipo: TipoIntervencao.PEDAGOGICA,
    status: StatusMock.ATIVO as any,
    dataInicio: new Date('2023-03-01'),
    dataFim: new Date('2023-05-30'),
    estudanteId: 'estudante-id-1',
    intervencaoBaseId: 'intervencao-base-id-1',
    observacoes: 'O estudante tem mostrado bom progresso com textos visuais.',
    progresso: 65,
    criadoEm: new Date('2023-03-01'),
    atualizadoEm: new Date('2023-04-15')
  };

  describe('CatalogoIntervencao (Intervenção Base)', () => {
    describe('Criação', () => {
      it('deve criar uma intervenção base válida com todos os dados', () => {
        const intervencaoBase = CatalogoIntervencao.criar(dadosIntervencaoBase);

        expect(intervencaoBase).toBeDefined();
        expect(intervencaoBase.id).toEqual(dadosIntervencaoBase.id);
        expect(intervencaoBase.titulo).toEqual(dadosIntervencaoBase.titulo);
        expect(intervencaoBase.descricao).toEqual(dadosIntervencaoBase.descricao);
        expect(intervencaoBase.tipo).toEqual(dadosIntervencaoBase.tipo);
        expect(intervencaoBase.duracao).toEqual(dadosIntervencaoBase.duracao);
        expect(intervencaoBase.dificuldadesAlvo).toEqual(dadosIntervencaoBase.dificuldadesAlvo);
        expect(intervencaoBase.publico).toEqual(dadosIntervencaoBase.publico);
        expect(intervencaoBase.recursos).toEqual(dadosIntervencaoBase.recursos);
        expect(intervencaoBase.status).toEqual(dadosIntervencaoBase.status);
        expect(intervencaoBase.criadoEm).toEqual(dadosIntervencaoBase.criadoEm);
        expect(intervencaoBase.atualizadoEm).toEqual(dadosIntervencaoBase.atualizadoEm);
      });

      it('deve criar uma intervenção base com dados mínimos', () => {
        const dadosMinimos: IntervencaoBaseProps = {
          titulo: 'Técnicas de Apoio Emocional',
          descricao: 'Conjunto de estratégias para desenvolver suporte emocional a estudantes com dificuldades.',
          tipo: TipoIntervencao.PSICOLOGICA
        };

        const intervencaoBase = CatalogoIntervencao.criar(dadosMinimos);

        expect(intervencaoBase).toBeDefined();
        expect(intervencaoBase.id).toBeUndefined();
        expect(intervencaoBase.titulo).toEqual(dadosMinimos.titulo);
        expect(intervencaoBase.descricao).toEqual(dadosMinimos.descricao);
        expect(intervencaoBase.tipo).toEqual(dadosMinimos.tipo);
        expect(intervencaoBase.dificuldadesAlvo).toEqual([]);
        expect(intervencaoBase.publico).toEqual([]);
        expect(intervencaoBase.recursos).toEqual([]);
        expect(intervencaoBase.status).toBeDefined();
        expect(intervencaoBase.criadoEm).toBeInstanceOf(Date);
        expect(intervencaoBase.atualizadoEm).toBeInstanceOf(Date);
      });
    });

    describe('Validações', () => {
      it('deve lançar erro ao criar intervenção base com título inválido', () => {
        const dadosTituloInvalido: IntervencaoBaseProps = {
          ...dadosIntervencaoBase,
          titulo: 'AB' // Título com menos de 3 caracteres
        };

        expect(() => CatalogoIntervencao.criar(dadosTituloInvalido))
          .toThrow('Título deve ter pelo menos 3 caracteres');
      });

      it('deve lançar erro ao criar intervenção base com descrição inválida', () => {
        const dadosDescricaoInvalida: IntervencaoBaseProps = {
          ...dadosIntervencaoBase,
          descricao: 'Curta' // Descrição com menos de 10 caracteres
        };

        expect(() => CatalogoIntervencao.criar(dadosDescricaoInvalida))
          .toThrow('Descrição deve ter pelo menos 10 caracteres');
      });

      it('deve lançar erro ao criar intervenção base com tipo inválido', () => {
        const dadosTipoInvalido: IntervencaoBaseProps = {
          ...dadosIntervencaoBase,
          tipo: 'TIPO_INEXISTENTE' as TipoIntervencao
        };

        expect(() => CatalogoIntervencao.criar(dadosTipoInvalido))
          .toThrow('Tipo de intervenção inválido');
      });

      it('deve lançar erro ao criar intervenção base com duração inválida', () => {
        const dadosDuracaoInvalida: IntervencaoBaseProps = {
          ...dadosIntervencaoBase,
          duracao: -10 // Duração negativa
        };

        expect(() => CatalogoIntervencao.criar(dadosDuracaoInvalida))
          .toThrow('Duração deve ser um número positivo');
      });
    });

    describe('Atualização', () => {
      it('deve atualizar os dados da intervenção base', () => {
        const intervencaoBase = CatalogoIntervencao.criar(dadosIntervencaoBase);
        
        const dadosAtualizados = {
          titulo: 'Técnicas de Leitura Facilitada - Versão 2',
          descricao: 'Conjunto atualizado de técnicas para apoiar o desenvolvimento da leitura.',
          tipo: TipoIntervencao.PEDAGOGICA,
          duracao: 120,
          dificuldadesAlvo: ['Dislexia', 'Dificuldade de Leitura', 'TDAH'],
          publico: ['Estudantes do 2º ao 6º ano']
        };

        const agora = new Date();
        jest.spyOn(global, 'Date').mockImplementation(() => agora);
        
        const intervencaoAtualizada = intervencaoBase.atualizar(dadosAtualizados);
        
        expect(intervencaoAtualizada.id).toEqual(intervencaoBase.id);
        expect(intervencaoAtualizada.titulo).toEqual(dadosAtualizados.titulo);
        expect(intervencaoAtualizada.descricao).toEqual(dadosAtualizados.descricao);
        expect(intervencaoAtualizada.tipo).toEqual(dadosAtualizados.tipo);
        expect(intervencaoAtualizada.duracao).toEqual(dadosAtualizados.duracao);
        expect(intervencaoAtualizada.dificuldadesAlvo).toEqual(dadosAtualizados.dificuldadesAlvo);
        expect(intervencaoAtualizada.publico).toEqual(dadosAtualizados.publico);
        expect(intervencaoAtualizada.recursos).toEqual(intervencaoBase.recursos);
        expect(intervencaoAtualizada.criadoEm).toEqual(intervencaoBase.criadoEm);
        expect(intervencaoAtualizada.atualizadoEm).toEqual(agora);
        
        jest.restoreAllMocks();
      });
    });

    describe('Inativação', () => {
      it('deve inativar uma intervenção base', () => {
        const intervencaoBase = CatalogoIntervencao.criar({
          ...dadosIntervencaoBase,
          status: StatusMock.ATIVO as any
        });
        
        const agora = new Date();
        jest.spyOn(global, 'Date').mockImplementation(() => agora);
        
        const intervencaoInativada = intervencaoBase.inativar();
        
        expect(intervencaoInativada.status).toEqual(StatusMock.CANCELADO);
        expect(intervencaoInativada.atualizadoEm).toEqual(agora);
        
        jest.restoreAllMocks();
      });
    });

    describe('Criação de instância', () => {
      it('deve criar uma instância de intervenção a partir da base', () => {
        const intervencaoBase = CatalogoIntervencao.criar(dadosIntervencaoBase);
        
        const dataInicio = new Date('2023-06-01');
        const dataFim = new Date('2023-08-30');
        const estudanteId = 'estudante-id-2';
        
        const intervencaoInstancia = intervencaoBase.criarInstancia(estudanteId, dataInicio, dataFim);
        
        expect(intervencaoInstancia).toBeInstanceOf(Intervencao);
        expect(intervencaoInstancia.titulo).toEqual(intervencaoBase.titulo);
        expect(intervencaoInstancia.descricao).toEqual(intervencaoBase.descricao);
        expect(intervencaoInstancia.tipo).toEqual(intervencaoBase.tipo);
        expect(intervencaoInstancia.dataInicio).toEqual(dataInicio);
        expect(intervencaoInstancia.dataFim).toEqual(dataFim);
        expect(intervencaoInstancia.estudanteId).toEqual(estudanteId);
        expect(intervencaoInstancia.intervencaoBaseId).toEqual(intervencaoBase.id);
        expect(intervencaoInstancia.observacoes).toContain(intervencaoBase.titulo);
      });
    });
  });

  describe('Intervencao (Instância)', () => {
    describe('Criação', () => {
      it('deve criar uma instância de intervenção válida com todos os dados', () => {
        const intervencao = Intervencao.criar(dadosIntervencaoInstancia);

        expect(intervencao).toBeDefined();
        expect(intervencao.id).toEqual(dadosIntervencaoInstancia.id);
        expect(intervencao.titulo).toEqual(dadosIntervencaoInstancia.titulo);
        expect(intervencao.descricao).toEqual(dadosIntervencaoInstancia.descricao);
        expect(intervencao.tipo).toEqual(dadosIntervencaoInstancia.tipo);
        expect(intervencao.status).toEqual(dadosIntervencaoInstancia.status);
        expect(intervencao.dataInicio).toEqual(dadosIntervencaoInstancia.dataInicio);
        expect(intervencao.dataFim).toEqual(dadosIntervencaoInstancia.dataFim);
        expect(intervencao.estudanteId).toEqual(dadosIntervencaoInstancia.estudanteId);
        expect(intervencao.intervencaoBaseId).toEqual(dadosIntervencaoInstancia.intervencaoBaseId);
        expect(intervencao.observacoes).toEqual(dadosIntervencaoInstancia.observacoes);
        expect(intervencao.progresso).toEqual(dadosIntervencaoInstancia.progresso);
        expect(intervencao.criadoEm).toEqual(dadosIntervencaoInstancia.criadoEm);
        expect(intervencao.atualizadoEm).toEqual(dadosIntervencaoInstancia.atualizadoEm);
      });

      it('deve criar uma instância de intervenção com dados mínimos', () => {
        const dadosMinimos: IntervencaoInstanciaProps = {
          titulo: 'Reforço em Matemática',
          descricao: 'Intervenção para apoiar o desenvolvimento de habilidades matemáticas.',
          tipo: TipoIntervencao.PEDAGOGICA,
          dataInicio: new Date('2023-05-01'),
          estudanteId: 'estudante-id-3'
        };

        const intervencao = Intervencao.criar(dadosMinimos);

        expect(intervencao).toBeDefined();
        expect(intervencao.id).toBeUndefined();
        expect(intervencao.titulo).toEqual(dadosMinimos.titulo);
        expect(intervencao.descricao).toEqual(dadosMinimos.descricao);
        expect(intervencao.tipo).toEqual(dadosMinimos.tipo);
        expect(intervencao.dataInicio).toEqual(dadosMinimos.dataInicio);
        expect(intervencao.dataFim).toBeUndefined();
        expect(intervencao.estudanteId).toEqual(dadosMinimos.estudanteId);
        expect(intervencao.progresso).toEqual(0);
        expect(intervencao.status).toBeDefined();
        expect(intervencao.criadoEm).toBeInstanceOf(Date);
        expect(intervencao.atualizadoEm).toBeInstanceOf(Date);
      });
    });

    describe('Validações', () => {
      it('deve lançar erro ao criar intervenção com data de início futura', () => {
        const dataFutura = new Date();
        dataFutura.setDate(dataFutura.getDate() + 10);
        
        const dadosDataInicioInvalida: IntervencaoInstanciaProps = {
          ...dadosIntervencaoInstancia,
          dataInicio: dataFutura
        };

        expect(() => Intervencao.criar(dadosDataInicioInvalida))
          .toThrow('Data de início não pode ser futura');
      });

      it('deve lançar erro ao criar intervenção com data de fim anterior à data de início', () => {
        const dataInicio = new Date('2023-05-01');
        const dataFimAnterior = new Date('2023-04-01');
        
        const dadosDataFimInvalida: IntervencaoInstanciaProps = {
          ...dadosIntervencaoInstancia,
          dataInicio,
          dataFim: dataFimAnterior
        };

        expect(() => Intervencao.criar(dadosDataFimInvalida))
          .toThrow('Data de fim não pode ser anterior à data de início');
      });

      it('deve lançar erro ao criar intervenção com progresso inválido', () => {
        const dadosProgressoInvalido: IntervencaoInstanciaProps = {
          ...dadosIntervencaoInstancia,
          progresso: 120 // Acima de 100%
        };

        expect(() => Intervencao.criar(dadosProgressoInvalido))
          .toThrow('Progresso deve estar entre 0 e 100%');
      });
    });

    describe('Atualização', () => {
      it('deve atualizar os dados da intervenção', () => {
        const intervencao = Intervencao.criar(dadosIntervencaoInstancia);
        
        const dadosAtualizados = {
          titulo: 'Aplicação de Técnicas de Leitura - Fase 2',
          descricao: 'Continuação da intervenção de leitura, com foco em leitura de textos complexos.',
          progresso: 85,
          observacoes: 'O estudante avançou para textos mais complexos.'
        };

        const agora = new Date();
        jest.spyOn(global, 'Date').mockImplementation(() => agora);
        
        const intervencaoAtualizada = intervencao.atualizar(dadosAtualizados);
        
        expect(intervencaoAtualizada.id).toEqual(intervencao.id);
        expect(intervencaoAtualizada.titulo).toEqual(dadosAtualizados.titulo);
        expect(intervencaoAtualizada.descricao).toEqual(dadosAtualizados.descricao);
        expect(intervencaoAtualizada.progresso).toEqual(dadosAtualizados.progresso);
        expect(intervencaoAtualizada.observacoes).toEqual(dadosAtualizados.observacoes);
        expect(intervencaoAtualizada.atualizadoEm).toEqual(agora);
        
        jest.restoreAllMocks();
      });
    });

    describe('Atualização de progresso', () => {
      it('deve atualizar o progresso da intervenção', () => {
        const intervencao = Intervencao.criar({
          ...dadosIntervencaoInstancia,
          progresso: 50
        });
        
        const novoProgresso = 75;
        const intervencaoAtualizada = intervencao.atualizarProgresso(novoProgresso);
        
        expect(intervencaoAtualizada.progresso).toEqual(novoProgresso);
      });
      
      it('deve lançar erro ao atualizar com progresso inválido', () => {
        const intervencao = Intervencao.criar(dadosIntervencaoInstancia);
        
        expect(() => intervencao.atualizarProgresso(-10))
          .toThrow('Progresso deve estar entre 0 e 100%');
          
        expect(() => intervencao.atualizarProgresso(110))
          .toThrow('Progresso deve estar entre 0 e 100%');
      });
    });

    describe('Conclusão', () => {
      it('deve concluir uma intervenção', () => {
        const intervencao = Intervencao.criar({
          ...dadosIntervencaoInstancia,
          status: StatusMock.ATIVO as any,
          progresso: 90,
          dataFim: undefined
        });
        
        const agora = new Date();
        jest.spyOn(global, 'Date').mockImplementation(() => agora);
        
        const intervencaoConcluida = intervencao.concluir();
        
        expect(intervencaoConcluida.status).toEqual(StatusMock.CONCLUIDO);
        expect(intervencaoConcluida.progresso).toEqual(100);
        expect(intervencaoConcluida.dataFim).toEqual(agora);
        expect(intervencaoConcluida.atualizadoEm).toEqual(agora);
        
        jest.restoreAllMocks();
      });
      
      it('deve manter a data de fim original se já estiver definida', () => {
        const dataFimOriginal = new Date('2023-06-30');
        const intervencao = Intervencao.criar({
          ...dadosIntervencaoInstancia,
          status: StatusMock.ATIVO as any,
          progresso: 90,
          dataFim: dataFimOriginal
        });
        
        const intervencaoConcluida = intervencao.concluir();
        
        expect(intervencaoConcluida.dataFim).toEqual(dataFimOriginal);
      });
    });

    describe('Cancelamento', () => {
      it('deve cancelar uma intervenção', () => {
        const intervencao = Intervencao.criar({
          ...dadosIntervencaoInstancia,
          status: StatusMock.ATIVO as any,
          dataFim: undefined
        });
        
        const agora = new Date();
        jest.spyOn(global, 'Date').mockImplementation(() => agora);
        
        const intervencaoCancelada = intervencao.cancelar();
        
        expect(intervencaoCancelada.status).toEqual(StatusMock.CANCELADO);
        expect(intervencaoCancelada.dataFim).toEqual(agora);
        expect(intervencaoCancelada.atualizadoEm).toEqual(agora);
        
        jest.restoreAllMocks();
      });
    });

    describe('Verificações de estado', () => {
      it('deve verificar se a intervenção está concluída', () => {
        const intervencaoConcluida = Intervencao.criar({
          ...dadosIntervencaoInstancia,
          status: StatusMock.CONCLUIDO as any
        });
        
        const intervencaoAtiva = Intervencao.criar({
          ...dadosIntervencaoInstancia,
          status: StatusMock.ATIVO as any
        });
        
        expect(intervencaoConcluida.estaConcluida()).toBeTruthy();
        expect(intervencaoAtiva.estaConcluida()).toBeFalsy();
      });
      
      it('deve verificar se a intervenção está em andamento', () => {
        const intervencaoEmAndamento = Intervencao.criar({
          ...dadosIntervencaoInstancia,
          status: StatusMock.ATIVO as any,
          dataFim: undefined
        });
        
        const intervencaoComDataFim = Intervencao.criar({
          ...dadosIntervencaoInstancia,
          status: StatusMock.ATIVO as any,
          dataFim: new Date()
        });
        
        const intervencaoConcluida = Intervencao.criar({
          ...dadosIntervencaoInstancia,
          status: StatusMock.CONCLUIDO as any
        });
        
        expect(intervencaoEmAndamento.estaEmAndamento()).toBeTruthy();
        expect(intervencaoComDataFim.estaEmAndamento()).toBeFalsy();
        expect(intervencaoConcluida.estaEmAndamento()).toBeFalsy();
      });
    });

    describe('Cálculo de duração', () => {
      it('deve calcular a duração em dias corretamente', () => {
        const dataInicio = new Date('2023-05-01');
        const dataFim = new Date('2023-05-31');
        
        const intervencao = Intervencao.criar({
          ...dadosIntervencaoInstancia,
          dataInicio,
          dataFim
        });
        
        // Deve ser 30 dias (31 de maio - 1 de maio)
        expect(intervencao.calcularDuracao()).toEqual(30);
      });
      
      it('deve calcular a duração até a data atual se não tiver data de fim', () => {
        const dataInicio = new Date('2023-05-01');
        const dataAtual = new Date('2023-05-15');
        
        jest.spyOn(global, 'Date').mockImplementation(() => dataAtual);
        
        const intervencao = Intervencao.criar({
          ...dadosIntervencaoInstancia,
          dataInicio,
          dataFim: undefined
        });
        
        // Deve ser 14 dias (15 de maio - 1 de maio)
        expect(intervencao.calcularDuracao()).toEqual(14);
        
        jest.restoreAllMocks();
      });
    });
  });
}); 