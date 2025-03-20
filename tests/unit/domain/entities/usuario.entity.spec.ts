import { Usuario, UsuarioProps } from '../../../../src/domain/entities/usuario.entity';

// Mock para o enum CargoUsuario para evitar dependência direta do Prisma
type CargoUsuarioMock = 'ADMIN' | 'PROFESSOR' | 'ESPECIALISTA' | 'COORDENADOR' | 'DIRETOR' | 'ADMINISTRADOR';

const CargoUsuarioMock = {
  ADMIN: 'ADMIN' as CargoUsuarioMock,
  PROFESSOR: 'PROFESSOR' as CargoUsuarioMock,
  ESPECIALISTA: 'ESPECIALISTA' as CargoUsuarioMock,
  COORDENADOR: 'COORDENADOR' as CargoUsuarioMock,
  DIRETOR: 'DIRETOR' as CargoUsuarioMock,
  ADMINISTRADOR: 'ADMINISTRADOR' as CargoUsuarioMock
};

describe('Usuario Entity', () => {
  // Fixture de dados válidos para reutilização
  const dadosUsuarioValido: UsuarioProps = {
    id: 'usuario-id-1',
    nome: 'João Silva',
    email: 'joao.silva@exemplo.com',
    cargo: CargoUsuarioMock.PROFESSOR as any,
    criadoEm: new Date('2023-01-01'),
    atualizadoEm: new Date('2023-01-01')
  };

  describe('Criação de usuário', () => {
    it('deve criar um usuário válido com todos os dados fornecidos', () => {
      const usuario = Usuario.criar(dadosUsuarioValido);

      expect(usuario).toBeDefined();
      expect(usuario.id).toEqual(dadosUsuarioValido.id);
      expect(usuario.nome).toEqual(dadosUsuarioValido.nome);
      expect(usuario.email).toEqual(dadosUsuarioValido.email);
      expect(usuario.cargo).toEqual(dadosUsuarioValido.cargo);
      expect(usuario.criadoEm).toEqual(dadosUsuarioValido.criadoEm);
      expect(usuario.atualizadoEm).toEqual(dadosUsuarioValido.atualizadoEm);
    });

    it('deve criar um usuário válido com dados mínimos', () => {
      const dadosMinimos: UsuarioProps = {
        nome: 'Ana Santos',
        email: 'ana.santos@exemplo.com',
        cargo: CargoUsuarioMock.COORDENADOR as any
      };
      
      const usuario = Usuario.criar(dadosMinimos);

      expect(usuario).toBeDefined();
      expect(usuario.id).toBeUndefined();
      expect(usuario.nome).toEqual(dadosMinimos.nome);
      expect(usuario.email).toEqual(dadosMinimos.email);
      expect(usuario.cargo).toEqual(dadosMinimos.cargo);
      expect(usuario.criadoEm).toBeInstanceOf(Date);
      expect(usuario.atualizadoEm).toBeInstanceOf(Date);
    });

    it('deve gerar datas de criação e atualização automaticamente', () => {
      const agora = new Date();
      jest.spyOn(global, 'Date').mockImplementation(() => agora);

      const dadosSemDatas: UsuarioProps = {
        nome: 'Carlos Oliveira',
        email: 'carlos.oliveira@exemplo.com',
        cargo: CargoUsuarioMock.PROFESSOR as any
      };

      const usuario = Usuario.criar(dadosSemDatas);

      expect(usuario.criadoEm).toEqual(agora);
      expect(usuario.atualizadoEm).toEqual(agora);

      jest.restoreAllMocks();
    });
  });

  describe('Validações', () => {
    it('deve lançar erro ao criar usuário com nome inválido', () => {
      const dadosNomeInvalido: UsuarioProps = {
        ...dadosUsuarioValido,
        nome: 'Jo' // Nome com menos de 3 caracteres
      };

      expect(() => Usuario.criar(dadosNomeInvalido)).toThrow('Nome deve ter pelo menos 3 caracteres');
    });

    it('deve lançar erro ao criar usuário com email inválido', () => {
      const dadosEmailInvalido: UsuarioProps = {
        ...dadosUsuarioValido,
        email: 'email-invalido'
      };

      expect(() => Usuario.criar(dadosEmailInvalido)).toThrow('Email inválido');
    });

    it('deve lançar erro ao criar usuário com cargo inválido', () => {
      const dadosCargoInvalido: UsuarioProps = {
        ...dadosUsuarioValido,
        cargo: 'CARGO_INEXISTENTE' as any
      };

      expect(() => Usuario.criar(dadosCargoInvalido)).toThrow('Cargo inválido');
    });
  });

  describe('Restauração', () => {
    it('deve restaurar um usuário a partir de dados persistidos', () => {
      const usuarioRestaurado = Usuario.restaurar(dadosUsuarioValido);
      
      expect(usuarioRestaurado).toBeDefined();
      expect(usuarioRestaurado.id).toEqual(dadosUsuarioValido.id);
      expect(usuarioRestaurado.nome).toEqual(dadosUsuarioValido.nome);
      expect(usuarioRestaurado.email).toEqual(dadosUsuarioValido.email);
      expect(usuarioRestaurado.cargo).toEqual(dadosUsuarioValido.cargo);
      expect(usuarioRestaurado.criadoEm).toEqual(dadosUsuarioValido.criadoEm);
      expect(usuarioRestaurado.atualizadoEm).toEqual(dadosUsuarioValido.atualizadoEm);
    });
  });

  describe('Atualização', () => {
    it('deve atualizar os dados do usuário', () => {
      const usuario = Usuario.criar(dadosUsuarioValido);
      
      const dadosAtualizados = {
        nome: 'João Silva Atualizado',
        email: 'joao.atualizado@exemplo.com',
        cargo: CargoUsuarioMock.DIRETOR as any
      };

      const agora = new Date();
      jest.spyOn(global, 'Date').mockImplementation(() => agora);
      
      const usuarioAtualizado = usuario.atualizar(dadosAtualizados);
      
      expect(usuarioAtualizado.id).toEqual(usuario.id);
      expect(usuarioAtualizado.nome).toEqual(dadosAtualizados.nome);
      expect(usuarioAtualizado.email).toEqual(dadosAtualizados.email);
      expect(usuarioAtualizado.cargo).toEqual(dadosAtualizados.cargo);
      expect(usuarioAtualizado.criadoEm).toEqual(usuario.criadoEm);
      expect(usuarioAtualizado.atualizadoEm).toEqual(agora);
      
      jest.restoreAllMocks();
    });
    
    it('deve atualizar apenas os campos fornecidos', () => {
      const usuario = Usuario.criar(dadosUsuarioValido);
      
      const dadosAtualizados = {
        nome: 'João Silva Atualizado'
      };
      
      const usuarioAtualizado = usuario.atualizar(dadosAtualizados);
      
      expect(usuarioAtualizado.nome).toEqual(dadosAtualizados.nome);
      expect(usuarioAtualizado.email).toEqual(usuario.email);
      expect(usuarioAtualizado.cargo).toEqual(usuario.cargo);
    });
  });

  describe('Verificação de permissões', () => {
    it('deve verificar corretamente se o usuário tem uma permissão específica', () => {
      const usuario = Usuario.criar({
        nome: 'Admin',
        email: 'admin@exemplo.com',
        cargo: CargoUsuarioMock.ADMINISTRADOR as any
      });
      
      expect(usuario.temPermissao([CargoUsuarioMock.ADMINISTRADOR as any])).toBeTruthy();
      expect(usuario.temPermissao([CargoUsuarioMock.DIRETOR as any])).toBeFalsy();
      expect(usuario.temPermissao([CargoUsuarioMock.DIRETOR as any, CargoUsuarioMock.ADMINISTRADOR as any])).toBeTruthy();
    });
    
    it('deve identificar corretamente usuários administradores', () => {
      const admin = Usuario.criar({
        nome: 'Admin',
        email: 'admin@exemplo.com',
        cargo: CargoUsuarioMock.ADMINISTRADOR as any
      });
      
      const professor = Usuario.criar({
        nome: 'Professor',
        email: 'professor@exemplo.com',
        cargo: CargoUsuarioMock.PROFESSOR as any
      });
      
      expect(admin.ehAdministrador()).toBeTruthy();
      expect(professor.ehAdministrador()).toBeFalsy();
    });
    
    it('deve verificar permissão para gerenciar usuários', () => {
      const admin = Usuario.criar({
        nome: 'Admin',
        email: 'admin@exemplo.com',
        cargo: CargoUsuarioMock.ADMINISTRADOR as any
      });
      
      const diretor = Usuario.criar({
        nome: 'Diretor',
        email: 'diretor@exemplo.com',
        cargo: CargoUsuarioMock.DIRETOR as any
      });
      
      const coordenador = Usuario.criar({
        nome: 'Coordenador',
        email: 'coordenador@exemplo.com',
        cargo: CargoUsuarioMock.COORDENADOR as any
      });
      
      const professor = Usuario.criar({
        nome: 'Professor',
        email: 'professor@exemplo.com',
        cargo: CargoUsuarioMock.PROFESSOR as any
      });
      
      expect(admin.podeGerenciarUsuarios()).toBeTruthy();
      expect(diretor.podeGerenciarUsuarios()).toBeTruthy();
      expect(coordenador.podeGerenciarUsuarios()).toBeTruthy();
      expect(professor.podeGerenciarUsuarios()).toBeFalsy();
    });
  });
}); 