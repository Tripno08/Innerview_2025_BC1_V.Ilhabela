import {
  IUsuarioRepository,
  UsuarioComCredenciais,
  UsuarioInstituicao,
  ResultadoPertencimento,
} from '@domain/repositories/usuario-repository.interface';
import { BaseRepository } from './base.repository';
import { Usuario } from '@domain/entities/usuario.entity';
import { CargoUsuario } from '@shared/enums';
import { mapLocalCargoToPrisma, mapPrismaCargoToLocal } from '@shared/utils/enum-mappers';

/**
 * Repositório de usuários utilizando Prisma
 */
export class UsuarioRepository extends BaseRepository<Usuario> implements IUsuarioRepository {
  /**
   * Mapear dados do Prisma para entidade Usuario
   */
  private mapToUsuario(usuarioPrisma: any): Usuario {
    return Usuario.restaurar({
      id: usuarioPrisma.id,
      nome: usuarioPrisma.nome,
      email: usuarioPrisma.email,
      cargo: mapPrismaCargoToLocal(usuarioPrisma.cargo),
      criadoEm: usuarioPrisma.criadoEm || new Date(),
      atualizadoEm: usuarioPrisma.atualizadoEm || new Date(),
    });
  }

  /**
   * Encontrar todos os usuários
   */
  async findAll(): Promise<Usuario[]> {
    try {
      const usuarios = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.usuario.findMany({
          orderBy: {
            nome: 'asc',
          },
        }),
      );

      return usuarios.map(this.mapToUsuario);
    } catch (error) {
      this.handlePrismaError(error, 'Usuário');
    }
  }

  /**
   * Encontrar um usuário pelo ID
   */
  async findById(id: string): Promise<Usuario | null> {
    try {
      const usuario = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.usuario.findUnique({
          where: { id },
        }),
      );

      if (!usuario) {
        return null;
      }

      return this.mapToUsuario(usuario);
    } catch (error) {
      this.handlePrismaError(error, 'Usuário');
    }
  }

  /**
   * Encontrar um usuário pelo email
   */
  async findByEmail(email: string): Promise<Usuario | null> {
    try {
      const usuario = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.usuario.findUnique({
          where: { email },
        }),
      );

      if (!usuario) {
        return null;
      }

      return this.mapToUsuario(usuario);
    } catch (error) {
      this.handlePrismaError(error, 'Usuário');
    }
  }

  /**
   * Encontrar usuário com suas credenciais
   */
  async findWithCredentials(email: string): Promise<UsuarioComCredenciais | null> {
    try {
      const usuario = await this.unitOfWork.withoutTransaction((prisma) =>
        prisma.usuario.findUnique({
          where: { email },
        }),
      );

      if (!usuario) {
        return null;
      }

      // Criar uma instância da entidade Usuario
      const usuarioBase = this.mapToUsuario(usuario);
      
      // Criar uma instancia compatível com UsuarioComCredenciais
      const usuarioComCredenciais: UsuarioComCredenciais = Object.assign(
        Object.create(Object.getPrototypeOf(usuarioBase)),
        {
          ...usuarioBase,
          senha: usuario.senha || '',
          salt: '',
        }
      );

      return usuarioComCredenciais;
    } catch (error) {
      this.handlePrismaError(error, 'Usuário');
    }
  }

  /**
   * Criar um novo usuário com credenciais
   */
  async create(data: Partial<Omit<Usuario, 'id'>> & { senha: string }): Promise<Usuario> {
    try {
      const usuario = await this.unitOfWork.withTransaction(async (prisma) => {
        // Criar o usuário no banco de dados
        const novoUsuario = await prisma.usuario.create({
          data: {
            nome: data.nome,
            email: data.email,
            cargo: mapLocalCargoToPrisma(data.cargo || CargoUsuario.PROFESSOR),
            senha: data.senha,
          },
        });
        
        return novoUsuario;
      });

      return this.mapToUsuario(usuario);
    } catch (error) {
      this.handlePrismaError(error, 'Usuário');
    }
  }

  /**
   * Atualizar um usuário existente
   */
  async update(id: string, data: Partial<Omit<Usuario, 'id'>>): Promise<Usuario> {
    try {
      // Preparar dados para atualização
      const prismaData: any = {
        ...(data.nome && { nome: data.nome }),
        ...(data.email && { email: data.email }),
      };

      if (data.cargo) {
        prismaData.cargo = mapLocalCargoToPrisma(data.cargo);
      }

      const usuario = await this.unitOfWork.withTransaction(async (prisma) => {
        // Verificar se o usuário existe
        const existente = await prisma.usuario.findUnique({
          where: { id },
        });

        if (!existente) {
          throw new Error('Usuário não encontrado');
        }

        // Atualizar o usuário
        return await prisma.usuario.update({
          where: { id },
          data: prismaData,
        });
      });

      // Restaurar o usuário usando o método de domínio
      return Usuario.restaurar({
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        cargo: mapPrismaCargoToLocal(usuario.cargo),
        criadoEm: usuario.criadoEm || new Date(),
        atualizadoEm: usuario.atualizadoEm || new Date(),
      });
    } catch (error) {
      this.handlePrismaError(error, 'Usuário');
    }
  }

  /**
   * Excluir um usuário
   */
  async delete(id: string): Promise<void> {
    try {
      await this.unitOfWork.withTransaction(async (prisma) => {
        // Verificar se o usuário existe
        const existente = await prisma.usuario.findUnique({
          where: { id },
        });

        if (!existente) {
          throw new Error('Usuário não encontrado');
        }

        // Remover o usuário diretamente
        await prisma.usuario.delete({
          where: { id },
        });
      });
    } catch (error) {
      this.handlePrismaError(error, 'Usuário');
    }
  }

  /**
   * Associar um usuário a uma instituição
   */
  async associarAInstituicao(
    usuarioId: string,
    instituicaoId: string,
    cargo?: CargoUsuario,
  ): Promise<void> {
    try {
      await this.unitOfWork.withTransaction(async (prisma) => {
        // Verificar se o usuário existe
        const usuario = await prisma.usuario.findUnique({
          where: { id: usuarioId },
        });

        if (!usuario) {
          throw new Error('Usuário não encontrado');
        }

        // Verificar se a instituição existe
        const instituicao = await prisma.instituicao.findUnique({
          where: { id: instituicaoId },
        });

        if (!instituicao) {
          throw new Error('Instituição não encontrada');
        }

        // Verificar se a associação já existe
        const associacaoExistente = await prisma.usuarioInstituicao.findFirst({
          where: {
            usuarioId,
            instituicaoId,
          },
        });

        if (associacaoExistente) {
          // Se existir e o cargo for diferente, atualizar
          if (cargo && associacaoExistente.cargo !== mapLocalCargoToPrisma(cargo)) {
            await prisma.usuarioInstituicao.update({
              where: { id: associacaoExistente.id },
              data: { cargo: mapLocalCargoToPrisma(cargo) },
            });
          }
          return;
        }

        // Criar a associação
        await prisma.usuarioInstituicao.create({
          data: {
            usuarioId,
            instituicaoId,
            cargo: mapLocalCargoToPrisma(cargo || CargoUsuario.PROFESSOR),
          },
        });
      });
    } catch (error) {
      this.handlePrismaError(error, 'Associação de Usuário-Instituição');
    }
  }

  /**
   * Remover associação de usuário com instituição
   */
  async removerDeInstituicao(usuarioId: string, instituicaoId: string): Promise<void> {
    try {
      await this.unitOfWork.withTransaction(async (prisma) => {
        // Verificar se a associação existe
        const associacao = await prisma.usuarioInstituicao.findFirst({
          where: {
            usuarioId,
            instituicaoId,
          },
        });

        if (!associacao) {
          throw new Error('Usuário não está associado a esta instituição');
        }

        // Remover a associação
        await prisma.usuarioInstituicao.delete({
          where: { id: associacao.id },
        });
      });
    } catch (error) {
      this.handlePrismaError(error, 'Associação de Usuário-Instituição');
    }
  }

  /**
   * Listar instituições associadas a um usuário
   */
  async listarInstituicoesDoUsuario(usuarioId: string): Promise<UsuarioInstituicao[]> {
    try {
      return await this.unitOfWork.withoutTransaction(async (prisma) => {
        const associacoes = await prisma.usuarioInstituicao.findMany({
          where: { usuarioId },
          include: {
            instituicao: true,
          },
        });

        return associacoes.map((a) => ({
          id: a.id,
          usuarioId: a.usuarioId,
          instituicaoId: a.instituicaoId,
          cargo: mapPrismaCargoToLocal(a.cargo),
          ativo: a.ativo,
          criadoEm: a.criadoEm,
          atualizadoEm: a.atualizadoEm,
          instituicao: a.instituicao,
        }));
      });
    } catch (error) {
      this.handlePrismaError(error, 'Instituições do Usuário');
    }
  }

  /**
   * Verificar se um usuário pertence a uma instituição
   */
  async verificarPertencimentoInstituicao(
    usuarioId: string,
    instituicaoId: string,
  ): Promise<ResultadoPertencimento> {
    try {
      const associacao = await this.unitOfWork.withoutTransaction(async (prisma) => {
        return await prisma.usuarioInstituicao.findFirst({
          where: {
            usuarioId,
            instituicaoId,
            ativo: true,
          },
        });
      });

      if (!associacao) {
        return { pertence: false };
      }

      return {
        pertence: true,
        cargo: mapPrismaCargoToLocal(associacao.cargo),
      };
    } catch (error) {
      this.handlePrismaError(error, 'Verificação de pertencimento');
    }
  }
}
