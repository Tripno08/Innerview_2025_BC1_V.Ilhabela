import { Equipe, MembroEquipe, EstudanteEquipe, PapelMembro } from '../../../../src/domain/entities/equipe.entity';

// Vamos evitar importações e tipagens do Prisma criando nossos próprios tipos para os testes
type StatusMock = 'ATIVO' | 'PENDENTE' | 'AGENDADO' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO';

// Essa interface é apenas para o teste e não precisa corresponder exatamente à interface real
interface EquipePropsMock {
  id?: string;
  nome: string;
  descricao?: string;
  status?: StatusMock;
  membros?: any[];
  estudantes?: any[];
}

const StatusMock = {
  ATIVO: 'ATIVO' as StatusMock,
  CANCELADO: 'CANCELADO' as StatusMock
};

describe('Entidade Equipe', () => {
  let equipeDadosValidos: EquipePropsMock;

  beforeEach(() => {
    equipeDadosValidos = {
      id: 'equipe-id-1',
      nome: 'Equipe de Apoio Escolar',
      descricao: 'Equipe responsável pelo acompanhamento dos estudantes',
      status: StatusMock.ATIVO,
      membros: [],
      estudantes: []
    };
  });

  describe('Criação da Equipe', () => {
    it('deve criar uma equipe válida', () => {
      const equipe = Equipe.criar(equipeDadosValidos as any);

      expect(equipe).toBeDefined();
      expect(equipe.id).toBe(equipeDadosValidos.id);
      expect(equipe.nome).toBe(equipeDadosValidos.nome);
      expect(equipe.descricao).toBe(equipeDadosValidos.descricao);
      expect(equipe.membros).toEqual([]);
      expect(equipe.estudantes).toEqual([]);
      expect(equipe.criadoEm).toBeInstanceOf(Date);
      expect(equipe.atualizadoEm).toBeInstanceOf(Date);
    });

    it('deve criar uma equipe com valores padrão quando não fornecidos', () => {
      const equipeMinima = Equipe.criar({
        nome: 'Equipe Mínima',
      } as any);

      expect(equipeMinima).toBeDefined();
      expect(equipeMinima.descricao).toBe('');
      expect(equipeMinima.membros).toEqual([]);
      expect(equipeMinima.estudantes).toEqual([]);
    });

    it('deve lançar erro se o nome for inválido', () => {
      expect(() => {
        Equipe.criar({
          ...equipeDadosValidos,
          nome: '',
        } as any);
      }).toThrow('Nome deve ter pelo menos 3 caracteres');

      expect(() => {
        Equipe.criar({
          ...equipeDadosValidos,
          nome: 'AB',
        } as any);
      }).toThrow('Nome deve ter pelo menos 3 caracteres');
    });

    it('deve restaurar uma equipe a partir de dados existentes', () => {
      const equipe = Equipe.restaurar(equipeDadosValidos);

      expect(equipe).toBeDefined();
      expect(equipe.id).toBe(equipeDadosValidos.id);
      expect(equipe.nome).toBe(equipeDadosValidos.nome);
    });
  });

  describe('Gerenciamento de Membros', () => {
    it('deve adicionar um membro à equipe', () => {
      let equipe = Equipe.criar(equipeDadosValidos as any);
      
      const membro = {
        papelMembro: PapelMembro.COORDENADOR,
        usuarioId: 'usuario-id-1',
      };

      equipe = equipe.adicionarMembro(membro);

      expect(equipe.membros.length).toBe(1);
      expect(equipe.membros[0].papelMembro).toBe(PapelMembro.COORDENADOR);
      expect(equipe.membros[0].usuarioId).toBe('usuario-id-1');
    });

    it('deve lançar erro ao adicionar um membro que já existe', () => {
      let equipe = Equipe.criar(equipeDadosValidos as any);
      
      const membro = {
        papelMembro: PapelMembro.COORDENADOR,
        usuarioId: 'usuario-id-1',
      };

      equipe = equipe.adicionarMembro(membro);

      expect(() => {
        equipe.adicionarMembro(membro);
      }).toThrow('Usuário já é membro desta equipe');
    });

    it('deve remover um membro da equipe', () => {
      let equipe = Equipe.criar(equipeDadosValidos as any);
      
      const membro = {
        papelMembro: PapelMembro.COORDENADOR,
        usuarioId: 'usuario-id-1',
      };

      equipe = equipe.adicionarMembro(membro);
      expect(equipe.membros.length).toBe(1);

      equipe = equipe.removerMembro('usuario-id-1');
      expect(equipe.membros.length).toBe(0);
    });

    it('deve verificar se um usuário é membro da equipe', () => {
      let equipe = Equipe.criar(equipeDadosValidos as any);
      
      const membro = {
        papelMembro: PapelMembro.COORDENADOR,
        usuarioId: 'usuario-id-1',
      };

      equipe = equipe.adicionarMembro(membro);

      expect(equipe.temMembro('usuario-id-1')).toBe(true);
      expect(equipe.temMembro('usuario-inexistente')).toBe(false);
    });

    it('deve obter os coordenadores da equipe', () => {
      let equipe = Equipe.criar(equipeDadosValidos as any);
      
      equipe = equipe.adicionarMembro({
        papelMembro: PapelMembro.COORDENADOR,
        usuarioId: 'usuario-id-1',
      });

      equipe = equipe.adicionarMembro({
        papelMembro: PapelMembro.PROFESSOR,
        usuarioId: 'usuario-id-2',
      });

      equipe = equipe.adicionarMembro({
        papelMembro: PapelMembro.COORDENADOR,
        usuarioId: 'usuario-id-3',
      });

      const coordenadores = equipe.obterCoordenadores();
      expect(coordenadores.length).toBe(2);
      expect(coordenadores[0].usuarioId).toBe('usuario-id-1');
      expect(coordenadores[1].usuarioId).toBe('usuario-id-3');
    });

    it('deve calcular corretamente a quantidade de membros', () => {
      let equipe = Equipe.criar(equipeDadosValidos as any);
      expect(equipe.quantidadeMembros()).toBe(0);
      
      equipe = equipe.adicionarMembro({
        papelMembro: PapelMembro.COORDENADOR,
        usuarioId: 'usuario-id-1',
      });
      expect(equipe.quantidadeMembros()).toBe(1);

      equipe = equipe.adicionarMembro({
        papelMembro: PapelMembro.PROFESSOR,
        usuarioId: 'usuario-id-2',
      });
      expect(equipe.quantidadeMembros()).toBe(2);
    });
  });

  describe('Gerenciamento de Estudantes', () => {
    it('deve adicionar um estudante à equipe', () => {
      let equipe = Equipe.criar(equipeDadosValidos as any);
      
      const estudante = {
        estudanteId: 'estudante-id-1',
      };

      equipe = equipe.adicionarEstudante(estudante);

      expect(equipe.estudantes.length).toBe(1);
      expect(equipe.estudantes[0].estudanteId).toBe('estudante-id-1');
    });

    it('deve lançar erro ao adicionar um estudante que já existe', () => {
      let equipe = Equipe.criar(equipeDadosValidos as any);
      
      const estudante = {
        estudanteId: 'estudante-id-1',
      };

      equipe = equipe.adicionarEstudante(estudante);

      expect(() => {
        equipe.adicionarEstudante(estudante);
      }).toThrow('Estudante já está associado a esta equipe');
    });

    it('deve remover um estudante da equipe', () => {
      let equipe = Equipe.criar(equipeDadosValidos as any);
      
      const estudante = {
        estudanteId: 'estudante-id-1',
      };

      equipe = equipe.adicionarEstudante(estudante);
      expect(equipe.estudantes.length).toBe(1);

      equipe = equipe.removerEstudante('estudante-id-1');
      expect(equipe.estudantes.length).toBe(0);
    });

    it('deve verificar se um estudante está associado à equipe', () => {
      let equipe = Equipe.criar(equipeDadosValidos as any);
      
      const estudante = {
        estudanteId: 'estudante-id-1',
      };

      equipe = equipe.adicionarEstudante(estudante);

      expect(equipe.temEstudante('estudante-id-1')).toBe(true);
      expect(equipe.temEstudante('estudante-inexistente')).toBe(false);
    });

    it('deve calcular corretamente a quantidade de estudantes', () => {
      let equipe = Equipe.criar(equipeDadosValidos as any);
      expect(equipe.quantidadeEstudantes()).toBe(0);
      
      equipe = equipe.adicionarEstudante({
        estudanteId: 'estudante-id-1',
      });
      expect(equipe.quantidadeEstudantes()).toBe(1);

      equipe = equipe.adicionarEstudante({
        estudanteId: 'estudante-id-2',
      });
      expect(equipe.quantidadeEstudantes()).toBe(2);
    });
  });

  describe('Gerenciamento de Status', () => {
    it('deve atualizar os dados da equipe', () => {
      let equipe = Equipe.criar(equipeDadosValidos);
      
      equipe = equipe.atualizar({
        nome: 'Novo Nome da Equipe',
        descricao: 'Nova descrição',
      });

      expect(equipe.nome).toBe('Novo Nome da Equipe');
      expect(equipe.descricao).toBe('Nova descrição');
      expect(equipe.atualizadoEm).toBeInstanceOf(Date);
    });

    it('deve inativar a equipe', () => {
      let equipe = Equipe.criar(equipeDadosValidos);
      expect(equipe.status).toBe(StatusMock.ATIVO);
      
      equipe = equipe.inativar();
      
      expect(equipe.status).toBe(StatusMock.CANCELADO);
      expect(equipe.estaAtiva()).toBe(false);
    });

    it('deve verificar se a equipe está ativa', () => {
      const equipeAtiva = Equipe.criar({
        ...equipeDadosValidos,
        status: StatusMock.ATIVO
      });
      
      const equipeInativa = Equipe.criar({
        ...equipeDadosValidos,
        status: StatusMock.CANCELADO
      });

      expect(equipeAtiva.estaAtiva()).toBe(true);
      expect(equipeInativa.estaAtiva()).toBe(false);
    });
  });
});

describe('Entidade MembroEquipe', () => {
  it('deve criar um membro válido', () => {
    const membro = MembroEquipe.criar({
      papelMembro: PapelMembro.COORDENADOR,
      usuarioId: 'usuario-id-1',
    });

    expect(membro).toBeDefined();
    expect(membro.papelMembro).toBe(PapelMembro.COORDENADOR);
    expect(membro.usuarioId).toBe('usuario-id-1');
    expect(membro.criadoEm).toBeInstanceOf(Date);
    expect(membro.atualizadoEm).toBeInstanceOf(Date);
  });

  it('deve lançar erro se o papel for inválido', () => {
    expect(() => {
      MembroEquipe.criar({
        papelMembro: 'PAPEL_INVALIDO' as PapelMembro,
        usuarioId: 'usuario-id-1',
      });
    }).toThrow('Papel de membro inválido');
  });

  it('deve lançar erro se o usuarioId não for fornecido', () => {
    expect(() => {
      MembroEquipe.criar({
        papelMembro: PapelMembro.COORDENADOR,
        usuarioId: '',
      });
    }).toThrow('ID do usuário é obrigatório');
  });

  it('deve verificar se o membro é coordenador', () => {
    const coordenador = MembroEquipe.criar({
      papelMembro: PapelMembro.COORDENADOR,
      usuarioId: 'usuario-id-1',
    });

    const professor = MembroEquipe.criar({
      papelMembro: PapelMembro.PROFESSOR,
      usuarioId: 'usuario-id-2',
    });

    expect(coordenador.eCoordenador()).toBe(true);
    expect(professor.eCoordenador()).toBe(false);
  });

  it('deve verificar se o membro tem um papel específico', () => {
    const membro = MembroEquipe.criar({
      papelMembro: PapelMembro.PSICOLOGO,
      usuarioId: 'usuario-id-1',
    });

    expect(membro.temPapel(PapelMembro.PSICOLOGO)).toBe(true);
    expect(membro.temPapel(PapelMembro.PROFESSOR)).toBe(false);
  });
});

describe('Entidade EstudanteEquipe', () => {
  it('deve criar um relacionamento estudante-equipe válido', () => {
    const estudanteEquipe = EstudanteEquipe.criar({
      estudanteId: 'estudante-id-1',
    });

    expect(estudanteEquipe).toBeDefined();
    expect(estudanteEquipe.estudanteId).toBe('estudante-id-1');
    expect(estudanteEquipe.criadoEm).toBeInstanceOf(Date);
    expect(estudanteEquipe.atualizadoEm).toBeInstanceOf(Date);
  });

  it('deve lançar erro se o estudanteId não for fornecido', () => {
    expect(() => {
      EstudanteEquipe.criar({
        estudanteId: '',
      });
    }).toThrow('ID do estudante é obrigatório');
  });
}); 