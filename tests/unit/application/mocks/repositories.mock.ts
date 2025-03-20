import { IUsuarioRepository, ResultadoPertencimento } from '@domain/repositories/usuario-repository.interface';
import { IEstudanteRepository } from '@domain/repositories/estudante-repository.interface';
import { IDificuldadeRepository } from '@domain/repositories/dificuldade-repository.interface';
import { IIntervencaoRepository } from '@domain/repositories/intervencao-repository.interface';
import { Usuario } from '@domain/entities/usuario.entity';
import { Estudante, Avaliacao } from '@domain/entities/estudante.entity';
import { DificuldadeAprendizagem, CategoriaDificuldade, TipoDificuldade } from '@domain/entities/dificuldade-aprendizagem.entity';
import { Intervencao, CatalogoIntervencao, TipoIntervencao } from '@domain/entities/intervencao.entity';
import { Status } from '@prisma/client';
import { CargoUsuario } from '@shared/enums';

// Mock para repositório de usuários
export class UsuarioRepositoryMock implements IUsuarioRepository {
  private usuarios: Map<string, any> = new Map();
  private emails: Map<string, string> = new Map();

  async findAll(): Promise<Usuario[]> {
    return Array.from(this.usuarios.values()).map(u => Usuario.restaurar(u));
  }

  async findById(id: string): Promise<Usuario | null> {
    const usuario = this.usuarios.get(id);
    return usuario ? Usuario.restaurar(usuario) : null;
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    const id = this.emails.get(email);
    if (!id) return null;
    return this.findById(id);
  }

  async findWithCredentials(email: string): Promise<any | null> {
    const id = this.emails.get(email);
    if (!id) return null;
    return this.usuarios.get(id);
  }

  async create(data: any): Promise<Usuario> {
    const id = data.id || `usuario-${Date.now()}-${Math.random()}`;
    const novoUsuario = { ...data, id, criadoEm: new Date(), atualizadoEm: new Date() };
    
    this.usuarios.set(id, novoUsuario);
    this.emails.set(data.email, id);
    
    return Usuario.restaurar(novoUsuario);
  }

  async update(id: string, data: any): Promise<Usuario> {
    const usuario = this.usuarios.get(id);
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    const usuarioAtualizado = { 
      ...usuario, 
      ...data, 
      id, 
      atualizadoEm: new Date() 
    };
    
    this.usuarios.set(id, usuarioAtualizado);

    // Se email foi atualizado, atualizar o mapa de emails
    if (data.email && data.email !== usuario.email) {
      this.emails.delete(usuario.email);
      this.emails.set(data.email, id);
    }
    
    return Usuario.restaurar(usuarioAtualizado);
  }

  async delete(id: string): Promise<void> {
    const usuario = this.usuarios.get(id);
    if (usuario) {
      this.emails.delete(usuario.email);
      this.usuarios.delete(id);
    }
  }

  async associarAInstituicao(usuarioId: string, instituicaoId: string): Promise<void> {
    // Simulação simplificada
    return Promise.resolve();
  }

  async removerDeInstituicao(usuarioId: string, instituicaoId: string): Promise<void> {
    // Simulação simplificada
    return Promise.resolve();
  }

  async listarInstituicoesDoUsuario(usuarioId: string): Promise<any[]> {
    // Simulação simplificada
    return [];
  }

  async verificarPertencimentoInstituicao(usuarioId: string, instituicaoId: string): Promise<ResultadoPertencimento> {
    // Simulação simplificada
    return { pertence: true, cargo: CargoUsuario.PROFESSOR };
  }
}

// Mock para repositório de estudantes
export class EstudanteRepositoryMock implements IEstudanteRepository {
  private estudantes: Map<string, any> = new Map();
  private estudantesPorUsuario: Map<string, string[]> = new Map();
  private dificuldades: Map<string, Map<string, DificuldadeAprendizagem>> = new Map();
  private avaliacoes: Map<string, Avaliacao[]> = new Map();

  async findAll(): Promise<Estudante[]> {
    return Array.from(this.estudantes.values()).map(e => this.mapToEstudante(e));
  }

  async findById(id: string): Promise<Estudante | null> {
    const estudante = this.estudantes.get(id);
    return estudante ? this.mapToEstudante(estudante) : null;
  }

  async findByUsuarioId(usuarioId: string): Promise<Estudante[]> {
    const estudanteIds = this.estudantesPorUsuario.get(usuarioId) || [];
    return Promise.all(estudanteIds.map(id => this.findById(id))).then(
      estudantes => estudantes.filter(Boolean) as Estudante[]
    );
  }

  async create(data: any): Promise<Estudante> {
    const id = data.id || `estudante-${Date.now()}-${Math.random()}`;
    const novoEstudante = { 
      ...data, 
      id, 
      status: data.status || Status.ATIVO,
      criadoEm: new Date(), 
      atualizadoEm: new Date() 
    };
    
    this.estudantes.set(id, novoEstudante);
    
    // Associar ao usuário
    if (data.usuarioId) {
      const estudantesUsuario = this.estudantesPorUsuario.get(data.usuarioId) || [];
      estudantesUsuario.push(id);
      this.estudantesPorUsuario.set(data.usuarioId, estudantesUsuario);
    }
    
    // Inicializar coleções
    this.dificuldades.set(id, new Map());
    this.avaliacoes.set(id, []);
    
    return this.mapToEstudante(novoEstudante);
  }

  async update(id: string, data: any): Promise<Estudante> {
    const estudante = this.estudantes.get(id);
    if (!estudante) {
      throw new Error('Estudante não encontrado');
    }

    const estudanteAtualizado = { 
      ...estudante, 
      ...data, 
      id, 
      atualizadoEm: new Date() 
    };
    
    this.estudantes.set(id, estudanteAtualizado);
    
    return this.mapToEstudante(estudanteAtualizado);
  }

  async delete(id: string): Promise<void> {
    const estudante = this.estudantes.get(id);
    if (estudante) {
      // Remover das associações com usuário
      if (estudante.usuarioId) {
        const estudantesUsuario = this.estudantesPorUsuario.get(estudante.usuarioId) || [];
        const index = estudantesUsuario.indexOf(id);
        if (index >= 0) {
          estudantesUsuario.splice(index, 1);
          this.estudantesPorUsuario.set(estudante.usuarioId, estudantesUsuario);
        }
      }
      
      // Limpar coleções relacionadas
      this.dificuldades.delete(id);
      this.avaliacoes.delete(id);
      
      // Remover o estudante
      this.estudantes.delete(id);
    }
  }

  async adicionarDificuldade(estudanteId: string, dificuldadeId: string): Promise<Estudante> {
    const dificuldadesEstudante = this.dificuldades.get(estudanteId) || new Map();
    dificuldadesEstudante.set(dificuldadeId, {} as DificuldadeAprendizagem);
    this.dificuldades.set(estudanteId, dificuldadesEstudante);
    return this.findById(estudanteId) as Promise<Estudante>;
  }

  async removerDificuldade(estudanteId: string, dificuldadeId: string): Promise<Estudante> {
    const dificuldadesEstudante = this.dificuldades.get(estudanteId);
    if (dificuldadesEstudante) {
      dificuldadesEstudante.delete(dificuldadeId);
    }
    return this.findById(estudanteId) as Promise<Estudante>;
  }

  async adicionarAvaliacao(estudanteId: string, avaliacaoData: any): Promise<Estudante> {
    const id = `avaliacao-${Date.now()}-${Math.random()}`;
    const avaliacao = {
      id,
      ...avaliacaoData,
      criadoEm: new Date(),
      atualizadoEm: new Date()
    } as Avaliacao;
    
    const avaliacoesEstudante = this.avaliacoes.get(estudanteId) || [];
    avaliacoesEstudante.push(avaliacao);
    this.avaliacoes.set(estudanteId, avaliacoesEstudante);
    
    return this.findById(estudanteId) as Promise<Estudante>;
  }

  async buscarEstudantesComNecessidadesSimilares(dificuldadeIds: string[]): Promise<Estudante[]> {
    // Lógica simplificada para testes
    return this.findAll();
  }

  // Método auxiliar para mapear dados para objeto Estudante
  private mapToEstudante(dados: any): Estudante {
    const dificuldadesEstudante = Array.from(this.dificuldades.get(dados.id)?.values() || []);
    const avaliacoesEstudante = this.avaliacoes.get(dados.id) || [];
    
    return Estudante.restaurar({
      ...dados,
      dificuldades: dificuldadesEstudante,
      avaliacoes: avaliacoesEstudante
    });
  }
}

// Mock para repositório de dificuldades
export class DificuldadeRepositoryMock implements IDificuldadeRepository {
  private dificuldades: Map<string, DificuldadeAprendizagem> = new Map();
  private dificuldadesPorTipo: Map<TipoDificuldade, string[]> = new Map();
  private dificuldadesPorEstudante: Map<string, string[]> = new Map();

  async findAll(): Promise<DificuldadeAprendizagem[]> {
    return Array.from(this.dificuldades.values());
  }

  async findById(id: string): Promise<DificuldadeAprendizagem | null> {
    return this.dificuldades.get(id) || null;
  }

  async findByTipo(tipo: TipoDificuldade): Promise<DificuldadeAprendizagem[]> {
    const ids = this.dificuldadesPorTipo.get(tipo) || [];
    return ids.map(id => this.dificuldades.get(id)).filter(Boolean) as DificuldadeAprendizagem[];
  }

  async findByEstudanteId(estudanteId: string): Promise<DificuldadeAprendizagem[]> {
    const ids = this.dificuldadesPorEstudante.get(estudanteId) || [];
    return ids.map(id => this.dificuldades.get(id)).filter(Boolean) as DificuldadeAprendizagem[];
  }

  async create(data: any): Promise<DificuldadeAprendizagem> {
    const id = data.id || `dificuldade-${Date.now()}-${Math.random()}`;
    const novaDificuldade = DificuldadeAprendizagem.criar({
      ...data,
      id,
      criadoEm: new Date(),
      atualizadoEm: new Date()
    });
    
    this.dificuldades.set(id, novaDificuldade);
    
    // Indexar por tipo
    const dificuldadesPorTipo = this.dificuldadesPorTipo.get(novaDificuldade.tipo) || [];
    dificuldadesPorTipo.push(id);
    this.dificuldadesPorTipo.set(novaDificuldade.tipo, dificuldadesPorTipo);
    
    return novaDificuldade;
  }

  async update(id: string, data: any): Promise<DificuldadeAprendizagem> {
    const dificuldade = await this.findById(id);
    if (!dificuldade) {
      throw new Error('Dificuldade não encontrada');
    }
    
    const dificuldadeAtualizada = dificuldade.atualizar(data);
    this.dificuldades.set(id, dificuldadeAtualizada);
    
    return dificuldadeAtualizada;
  }

  async delete(id: string): Promise<void> {
    this.dificuldades.delete(id);
  }

  // Método auxiliar para testes
  associarDificuldadeAEstudante(dificuldadeId: string, estudanteId: string): void {
    const dificuldadesEstudante = this.dificuldadesPorEstudante.get(estudanteId) || [];
    if (!dificuldadesEstudante.includes(dificuldadeId)) {
      dificuldadesEstudante.push(dificuldadeId);
      this.dificuldadesPorEstudante.set(estudanteId, dificuldadesEstudante);
    }
  }
}

// Mock para repositório de intervenções
export class IntervencaoRepositoryMock implements IIntervencaoRepository {
  private catalogoIntervencoes: Map<string, CatalogoIntervencao> = new Map();
  private intervencoes: Map<string, Intervencao> = new Map();
  private intervencoesPorEstudante: Map<string, string[]> = new Map();
  private intervencoesPorTipo: Map<TipoIntervencao, string[]> = new Map();
  private intervencoesPorDificuldade: Map<string, string[]> = new Map();

  async findAllCatalogo(): Promise<CatalogoIntervencao[]> {
    return Array.from(this.catalogoIntervencoes.values());
  }

  async findCatalogoById(id: string): Promise<CatalogoIntervencao | null> {
    return this.catalogoIntervencoes.get(id) || null;
  }

  async findCatalogoByTipo(tipo: TipoIntervencao): Promise<CatalogoIntervencao[]> {
    const ids = this.intervencoesPorTipo.get(tipo) || [];
    return ids.map(id => this.catalogoIntervencoes.get(id)).filter(Boolean) as CatalogoIntervencao[];
  }

  async findCatalogoByDificuldade(dificuldadeId: string): Promise<CatalogoIntervencao[]> {
    const ids = this.intervencoesPorDificuldade.get(dificuldadeId) || [];
    return ids.map(id => this.catalogoIntervencoes.get(id)).filter(Boolean) as CatalogoIntervencao[];
  }

  async createCatalogo(data: any): Promise<CatalogoIntervencao> {
    const id = data.id || `catalogo-intervencao-${Date.now()}-${Math.random()}`;
    const novaIntervencao = CatalogoIntervencao.criar({
      ...data,
      id,
      criadoEm: new Date(),
      atualizadoEm: new Date()
    });
    
    this.catalogoIntervencoes.set(id, novaIntervencao);
    
    // Indexar por tipo
    const intervencoesPorTipo = this.intervencoesPorTipo.get(novaIntervencao.tipo) || [];
    intervencoesPorTipo.push(id);
    this.intervencoesPorTipo.set(novaIntervencao.tipo, intervencoesPorTipo);
    
    // Indexar por dificuldade alvo
    if (data.dificuldadesAlvo) {
      for (const dificuldadeId of data.dificuldadesAlvo) {
        const intervencoesDificuldade = this.intervencoesPorDificuldade.get(dificuldadeId) || [];
        intervencoesDificuldade.push(id);
        this.intervencoesPorDificuldade.set(dificuldadeId, intervencoesDificuldade);
      }
    }
    
    return novaIntervencao;
  }

  async updateCatalogo(id: string, data: any): Promise<CatalogoIntervencao> {
    const intervencao = await this.findCatalogoById(id);
    if (!intervencao) {
      throw new Error('Intervenção não encontrada');
    }
    
    const intervencaoAtualizada = intervencao.atualizar(data);
    this.catalogoIntervencoes.set(id, intervencaoAtualizada);
    
    return intervencaoAtualizada;
  }

  async deleteCatalogo(id: string): Promise<void> {
    this.catalogoIntervencoes.delete(id);
  }

  async findByEstudanteId(estudanteId: string): Promise<Intervencao[]> {
    const ids = this.intervencoesPorEstudante.get(estudanteId) || [];
    return ids.map(id => this.intervencoes.get(id)).filter(Boolean) as Intervencao[];
  }

  async findById(id: string): Promise<Intervencao | null> {
    return this.intervencoes.get(id) || null;
  }

  async create(data: any): Promise<Intervencao> {
    const id = data.id || `intervencao-${Date.now()}-${Math.random()}`;
    const novaIntervencao = Intervencao.criar({
      ...data,
      id,
      progresso: data.progresso || 0,
      criadoEm: new Date(),
      atualizadoEm: new Date()
    });
    
    this.intervencoes.set(id, novaIntervencao);
    
    // Associar ao estudante
    const intervencoesPorEstudante = this.intervencoesPorEstudante.get(data.estudanteId) || [];
    intervencoesPorEstudante.push(id);
    this.intervencoesPorEstudante.set(data.estudanteId, intervencoesPorEstudante);
    
    return novaIntervencao;
  }

  async update(id: string, data: any): Promise<Intervencao> {
    const intervencao = await this.findById(id);
    if (!intervencao) {
      throw new Error('Intervenção não encontrada');
    }
    
    // Note: this is simplified from the real implementation
    const intervencaoAtualizada = { 
      ...intervencao,
      ...data,
      id,
      atualizadoEm: new Date()
    } as unknown as Intervencao;
    
    this.intervencoes.set(id, intervencaoAtualizada);
    
    return intervencaoAtualizada;
  }

  async atualizarProgresso(id: string, progresso: number): Promise<Intervencao> {
    const intervencao = await this.findById(id);
    if (!intervencao) {
      throw new Error('Intervenção não encontrada');
    }
    
    // Note: this is simplified from the real implementation
    const intervencaoAtualizada = { 
      ...intervencao,
      progresso,
      atualizadoEm: new Date()
    } as unknown as Intervencao;
    
    this.intervencoes.set(id, intervencaoAtualizada);
    
    return intervencaoAtualizada;
  }

  async concluir(id: string): Promise<Intervencao> {
    const intervencao = await this.findById(id);
    if (!intervencao) {
      throw new Error('Intervenção não encontrada');
    }
    
    // Note: this is simplified from the real implementation
    const intervencaoAtualizada = { 
      ...intervencao,
      progresso: 100,
      dataFim: new Date(),
      atualizadoEm: new Date()
    } as unknown as Intervencao;
    
    this.intervencoes.set(id, intervencaoAtualizada);
    
    return intervencaoAtualizada;
  }

  async cancelar(id: string): Promise<Intervencao> {
    const intervencao = await this.findById(id);
    if (!intervencao) {
      throw new Error('Intervenção não encontrada');
    }
    
    // Note: this is simplified from the real implementation
    const intervencaoAtualizada = { 
      ...intervencao,
      status: Status.CANCELADO,
      atualizadoEm: new Date()
    } as unknown as Intervencao;
    
    this.intervencoes.set(id, intervencaoAtualizada);
    
    return intervencaoAtualizada;
  }
} 