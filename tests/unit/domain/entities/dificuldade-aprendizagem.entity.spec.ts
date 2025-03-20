import { 
  DificuldadeAprendizagem, 
  DificuldadeAprendizagemProps, 
  TipoDificuldade, 
  CategoriaDificuldade 
} from '../../../../src/domain/entities/dificuldade-aprendizagem.entity';

// Mock para o enum Status para evitar dependência direta do Prisma
type StatusMock = 'ATIVO' | 'PENDENTE' | 'AGENDADO' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO';

const StatusMock = {
  ATIVO: 'ATIVO' as StatusMock,
  CANCELADO: 'CANCELADO' as StatusMock
};

describe('DificuldadeAprendizagem Entity', () => {
  // Fixture de dados para reutilização
  const dadosDificuldadeValida: DificuldadeAprendizagemProps = {
    id: 'dificuldade-id-1',
    nome: 'Dislexia',
    descricao: 'Dificuldade específica na aprendizagem da leitura, com maior prevalência no período escolar.',
    tipo: TipoDificuldade.LEITURA,
    categoria: CategoriaDificuldade.MODERADA,
    status: StatusMock.ATIVO as any,
    criadoEm: new Date('2023-01-01'),
    atualizadoEm: new Date('2023-01-01')
  };

  describe('Criação', () => {
    it('deve criar uma dificuldade de aprendizagem válida com todos os dados', () => {
      const dificuldade = DificuldadeAprendizagem.criar(dadosDificuldadeValida);

      expect(dificuldade).toBeDefined();
      expect(dificuldade.id).toEqual(dadosDificuldadeValida.id);
      expect(dificuldade.nome).toEqual(dadosDificuldadeValida.nome);
      expect(dificuldade.descricao).toEqual(dadosDificuldadeValida.descricao);
      expect(dificuldade.tipo).toEqual(dadosDificuldadeValida.tipo);
      expect(dificuldade.categoria).toEqual(dadosDificuldadeValida.categoria);
      expect(dificuldade.status).toEqual(dadosDificuldadeValida.status);
      expect(dificuldade.criadoEm).toEqual(dadosDificuldadeValida.criadoEm);
      expect(dificuldade.atualizadoEm).toEqual(dadosDificuldadeValida.atualizadoEm);
    });

    it('deve criar uma dificuldade de aprendizagem com dados mínimos', () => {
      const dadosMinimos: DificuldadeAprendizagemProps = {
        nome: 'Discalculia',
        descricao: 'Dificuldade específica na aprendizagem da matemática e habilidades aritméticas.',
        tipo: TipoDificuldade.MATEMATICA,
        categoria: CategoriaDificuldade.LEVE
      };

      const dificuldade = DificuldadeAprendizagem.criar(dadosMinimos);

      expect(dificuldade).toBeDefined();
      expect(dificuldade.id).toBeUndefined();
      expect(dificuldade.nome).toEqual(dadosMinimos.nome);
      expect(dificuldade.descricao).toEqual(dadosMinimos.descricao);
      expect(dificuldade.tipo).toEqual(dadosMinimos.tipo);
      expect(dificuldade.categoria).toEqual(dadosMinimos.categoria);
      expect(dificuldade.status).toBeDefined(); // Status padrão
      expect(dificuldade.criadoEm).toBeInstanceOf(Date);
      expect(dificuldade.atualizadoEm).toBeInstanceOf(Date);
    });

    it('deve gerar datas automaticamente', () => {
      const agora = new Date();
      jest.spyOn(global, 'Date').mockImplementation(() => agora);

      const dadosSemDatas: DificuldadeAprendizagemProps = {
        nome: 'TDAH',
        descricao: 'Transtorno do Déficit de Atenção e Hiperatividade, afetando atenção, controle de impulsos e atividade motora.',
        tipo: TipoDificuldade.ATENCAO,
        categoria: CategoriaDificuldade.MODERADA
      };

      const dificuldade = DificuldadeAprendizagem.criar(dadosSemDatas);

      expect(dificuldade.criadoEm).toEqual(agora);
      expect(dificuldade.atualizadoEm).toEqual(agora);

      jest.restoreAllMocks();
    });
  });

  describe('Validações', () => {
    it('deve lançar erro ao criar dificuldade com nome inválido', () => {
      const dadosNomeInvalido: DificuldadeAprendizagemProps = {
        ...dadosDificuldadeValida,
        nome: 'TD' // Nome com menos de 3 caracteres
      };

      expect(() => DificuldadeAprendizagem.criar(dadosNomeInvalido))
        .toThrow('Nome deve ter pelo menos 3 caracteres');
    });

    it('deve lançar erro ao criar dificuldade com descrição inválida', () => {
      const dadosDescricaoInvalida: DificuldadeAprendizagemProps = {
        ...dadosDificuldadeValida,
        descricao: 'Curta' // Descrição com menos de 10 caracteres
      };

      expect(() => DificuldadeAprendizagem.criar(dadosDescricaoInvalida))
        .toThrow('Descrição deve ter pelo menos 10 caracteres');
    });

    it('deve lançar erro ao criar dificuldade com tipo inválido', () => {
      const dadosTipoInvalido: DificuldadeAprendizagemProps = {
        ...dadosDificuldadeValida,
        tipo: 'TIPO_INEXISTENTE' as TipoDificuldade
      };

      expect(() => DificuldadeAprendizagem.criar(dadosTipoInvalido))
        .toThrow('Tipo de dificuldade inválido');
    });

    it('deve lançar erro ao criar dificuldade com categoria inválida', () => {
      const dadosCategoriaInvalida: DificuldadeAprendizagemProps = {
        ...dadosDificuldadeValida,
        categoria: 'CATEGORIA_INEXISTENTE' as CategoriaDificuldade
      };

      expect(() => DificuldadeAprendizagem.criar(dadosCategoriaInvalida))
        .toThrow('Categoria de dificuldade inválida');
    });
  });

  describe('Restauração', () => {
    it('deve restaurar uma dificuldade a partir de dados persistidos', () => {
      const dificuldadeRestaurada = DificuldadeAprendizagem.restaurar(dadosDificuldadeValida);
      
      expect(dificuldadeRestaurada).toBeDefined();
      expect(dificuldadeRestaurada.id).toEqual(dadosDificuldadeValida.id);
      expect(dificuldadeRestaurada.nome).toEqual(dadosDificuldadeValida.nome);
      expect(dificuldadeRestaurada.descricao).toEqual(dadosDificuldadeValida.descricao);
      expect(dificuldadeRestaurada.tipo).toEqual(dadosDificuldadeValida.tipo);
      expect(dificuldadeRestaurada.categoria).toEqual(dadosDificuldadeValida.categoria);
    });
  });

  describe('Atualização', () => {
    it('deve atualizar os dados da dificuldade', () => {
      const dificuldade = DificuldadeAprendizagem.criar(dadosDificuldadeValida);
      
      const dadosAtualizados = {
        nome: 'Dislexia Severa',
        descricao: 'Dificuldade específica na aprendizagem da leitura, com manifestação severa',
        tipo: TipoDificuldade.LEITURA,
        categoria: CategoriaDificuldade.GRAVE
      };

      const agora = new Date();
      jest.spyOn(global, 'Date').mockImplementation(() => agora);
      
      const dificuldadeAtualizada = dificuldade.atualizar(dadosAtualizados);
      
      expect(dificuldadeAtualizada.id).toEqual(dificuldade.id);
      expect(dificuldadeAtualizada.nome).toEqual(dadosAtualizados.nome);
      expect(dificuldadeAtualizada.descricao).toEqual(dadosAtualizados.descricao);
      expect(dificuldadeAtualizada.tipo).toEqual(dadosAtualizados.tipo);
      expect(dificuldadeAtualizada.categoria).toEqual(dadosAtualizados.categoria);
      expect(dificuldadeAtualizada.criadoEm).toEqual(dificuldade.criadoEm);
      expect(dificuldadeAtualizada.atualizadoEm).toEqual(agora);
      
      jest.restoreAllMocks();
    });

    it('deve atualizar apenas os campos fornecidos', () => {
      const dificuldade = DificuldadeAprendizagem.criar(dadosDificuldadeValida);
      
      const dadosAtualizados = {
        nome: 'Dislexia Atualizada'
      };
      
      const dificuldadeAtualizada = dificuldade.atualizar(dadosAtualizados);
      
      expect(dificuldadeAtualizada.nome).toEqual(dadosAtualizados.nome);
      expect(dificuldadeAtualizada.descricao).toEqual(dificuldade.descricao);
      expect(dificuldadeAtualizada.tipo).toEqual(dificuldade.tipo);
      expect(dificuldadeAtualizada.categoria).toEqual(dificuldade.categoria);
    });
  });

  describe('Mudança de status', () => {
    it('deve inativar uma dificuldade de aprendizagem', () => {
      const dificuldade = DificuldadeAprendizagem.criar(dadosDificuldadeValida);
      
      const agora = new Date();
      jest.spyOn(global, 'Date').mockImplementation(() => agora);
      
      const dificuldadeInativada = dificuldade.inativar();
      
      expect(dificuldadeInativada.status).toEqual(StatusMock.CANCELADO);
      expect(dificuldadeInativada.atualizadoEm).toEqual(agora);
      
      jest.restoreAllMocks();
    });
  });

  describe('Verificações de estado', () => {
    it('deve verificar se a dificuldade está ativa', () => {
      const dificuldadeAtiva = DificuldadeAprendizagem.criar({
        ...dadosDificuldadeValida,
        status: StatusMock.ATIVO as any
      });
      
      const dificuldadeInativa = DificuldadeAprendizagem.criar({
        ...dadosDificuldadeValida,
        status: StatusMock.CANCELADO as any
      });
      
      expect(dificuldadeAtiva.estaAtiva()).toBeTruthy();
      expect(dificuldadeInativa.estaAtiva()).toBeFalsy();
    });
    
    it('deve verificar se a dificuldade é grave', () => {
      const dificuldadeLeve = DificuldadeAprendizagem.criar({
        ...dadosDificuldadeValida,
        categoria: CategoriaDificuldade.LEVE
      });
      
      const dificuldadeGrave = DificuldadeAprendizagem.criar({
        ...dadosDificuldadeValida,
        categoria: CategoriaDificuldade.GRAVE
      });
      
      expect(dificuldadeLeve.ehGrave()).toBeFalsy();
      expect(dificuldadeGrave.ehGrave()).toBeTruthy();
    });
  });
}); 