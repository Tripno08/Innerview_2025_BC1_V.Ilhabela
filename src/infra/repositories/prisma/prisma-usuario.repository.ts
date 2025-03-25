import { injectable } from 'tsyringe';
import {
  IUsuarioRepository,
  IUsuarioComCredenciais,
  IUsuarioInstituicao,
  IResultadoPertencimento,
  // As interfaces abaixo são mantidas apenas para compatibilidade e serão removidas no futuro
  // UsuarioComCredenciais,
  // UsuarioInstituicao,
  // ResultadoPertencimento,
} from '../../../domain/repositories/usuario-repository.interface';
import { Usuario } from '../../../domain/entities/usuario.entity';
import {
  ICriarUsuarioDTO,
  IAtualizarUsuarioDTO,
  IFiltrosUsuarioDTO,
} from '../../../domain/dtos/usuario.dto';

import {
  // Importações centralizadas dos modelos e utilitários
  IPrismaUsuarioData,
  PrismaClientExtended,
  ensurePrismaModel,
  
  ITokenRedefinicaoSenhaModel,
  IRefreshTokenModel,
  IPermissaoUsuarioModel,
  createPrismaQuery,
  sanitizeForPrisma,
  mapPrismaError,
  mapCargoToPrisma,
  mapCargoFromPrisma,
  mapStatusToPrisma,
  mapStatusFromPrisma,
  Status,
  CargoUsuario,
} from '../../repositories/index/index';

// Tipo temporário para facilitar migração gradual
type PrismaUsuarioRecord = Record<string, unknown> & Partial<IPrismaUsuarioData>;

/**
 * Implementação do repositório de usuários usando Prisma
 */
@injectable()
export class PrismaUsuarioRepository implements IUsuarioRepository {
  async findAll(): Promise<Usuario[]> {
    try {
      const queryBuilder = createPrismaQuery()
        .addOrderBy('nome', 'asc')
        .addFilter('status', { not: mapStatusToPrisma(Status.CANCELADO) });

      // @ts-expect-error - Incompatibilidade temporária entre queryBuilder e Prisma
      const usuarios = await this.prisma.usuario?.findMany(queryBuilder.build());

      if (!usuarios) {
        return [];
      }

      return usuarios.map((usuario) => this.mapToDomain(usuario as PrismaUsuarioRecord));
    } catch (error) {
      throw mapPrismaError(error, 'Usuario');
    }
  }

  async buscarPorId(id: string): Promise<Usuario | null> {
    return this.findById(id);
  }

  async findById(id: string): Promise<Usuario | null> {
    try {
      const usuario = await this.prisma.usuario.findUnique({
        where: { id },
      });

      if (!usuario) {
        return null;
      }

      return this.mapToDomain(usuario);
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao buscar usuário');
    }
  }

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    try {
      const usuario = await this.prisma.usuario.findUnique({
        where: { email },
      });

      if (!usuario) {
        return null;
      }

      return this.mapToDomain(usuario);
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao buscar usuário por email');
    }
  }

  async listar(filtros?: IFiltrosUsuarioDTO): Promise<Usuario[]> {
    try {
      // Usar o tipo adequado para o where conforme definido em IUsuarioFindManyArgs
      const queryBuilder = createPrismaQuery()
        .addFilter('status', { not: mapStatusToPrisma(Status.CANCELADO) })
        .addOrderBy('nome', 'asc');

      if (filtros) {
        if (filtros.nome) {
          queryBuilder.addFilter('nome', {
            contains: filtros.nome,
            mode: 'insensitive',
          });
        }

        if (filtros.email) {
          queryBuilder.addFilter('email', {
            contains: filtros.email,
            mode: 'insensitive',
          });
        }

        if (filtros.cargo) {
          // Converter o enum para string para compatibilidade com o mapeador
          const cargoStr =
            typeof filtros.cargo === 'string'
              ? filtros.cargo
              : (filtros.cargo as unknown as CargoUsuario).toString();
          queryBuilder.addFilter('cargo', mapCargoToPrisma(cargoStr));
        }

        if (filtros.status) {
          queryBuilder.addFilter('status', mapStatusToPrisma(filtros.status));
        }

        if (filtros.instituicaoId) {
          queryBuilder.addFilter('usuarioInstituicao', {
            some: {
              instituicaoId: filtros.instituicaoId,
              ativo: true,
            },
          });
        }
      }

      // @ts-expect-error - Incompatibilidade temporária entre queryBuilder e Prisma
      const usuarios = await this.prisma.usuario.findMany(queryBuilder.build());

      return usuarios.map((usuario) => this.mapToDomain(usuario));
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao listar usuários');
    }
  }

  async create(data: ICriarUsuarioDTO): Promise<Usuario> {
    try {
      // Validar dados
      if (!data.nome || !data.email || !data.senha) {
        throw mapPrismaError(new Error('Dados incompletos'), 'Erro ao criar usuário');
      }

      // Preparar dados para o Prisma
      const prismaData = sanitizeForPrisma({
        nome: data.nome,
        email: data.email,
        senha: data.senha, // Já deve vir criptografada
        cargo: mapCargoToPrisma(String(data.cargo)),
        matricula: data.matricula,
        telefone: data.telefone,
        fotoPerfil: data.fotoPerfil,
        status: mapStatusToPrisma(Status.ATIVO),
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      });

      // Criar usuário
      const usuario = await this.prisma.usuario.create({
        data: prismaData,
      });

      return this.mapToDomain(usuario);
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao criar usuário');
    }
  }

  // Alias para update para compatibilidade com a interface
  async atualizar(id: string, data: IAtualizarUsuarioDTO): Promise<Usuario> {
    return this.update(id, data);
  }

  async update(id: string, data: IAtualizarUsuarioDTO): Promise<Usuario> {
    try {
      // Verificar se usuário existe
      const usuarioExistente = await this.findById(id);
      if (!usuarioExistente) {
        throw mapPrismaError(new Error('Usuário não encontrado'), 'Erro ao atualizar usuário');
      }

      // Preparar dados para o Prisma
      const prismaData = sanitizeForPrisma({
        nome: data.nome,
        email: data.email,
        cargo: data.cargo ? mapCargoToPrisma(String(data.cargo)) : undefined,
        matricula: data.matricula,
        telefone: data.telefone,
        fotoPerfil: data.fotoPerfil,
        status: data.status ? mapStatusToPrisma(data.status) : undefined,
        atualizadoEm: new Date(),
      });

      // Atualizar usuário
      const usuarioAtualizado = await this.prisma.usuario.update({
        where: { id },
        data: prismaData,
      });

      return this.mapToDomain(usuarioAtualizado);
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao atualizar usuário');
    }
  }

  async atualizarSenha(id: string, senha: string): Promise<void> {
    try {
      await this.prisma.usuario.update({
        where: { id },
        data: {
          senha,
          atualizadoEm: new Date(),
        },
      });
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao atualizar senha');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      // Verificar se usuário existe
      const usuarioExistente = await this.findById(id);
      if (!usuarioExistente) {
        throw mapPrismaError(new Error('Usuário não encontrado'), 'Erro ao excluir usuário');
      }

      // Inativar usuário em vez de excluir permanentemente
      await this.prisma.usuario.update({
        where: { id },
        data: {
          // Prisma reconhece campos específicos durante runtime
          // @ts-expect-error - Campo status existe no runtime do Prisma
          status: mapStatusToPrisma(Status.CANCELADO),
          atualizadoEm: new Date(),
        },
      });
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao excluir usuário');
    }
  }

  // Método atualizado para usar o helper ensurePrismaModel
  async salvarTokenRedefinicaoSenha(id: string, token: string): Promise<void> {
    try {
      const tokenModel = ensurePrismaModel<ITokenRedefinicaoSenhaModel>(
        this.prisma,
        'tokenRedefinicaoSenha',
        'Modelo tokenRedefinicaoSenha não está disponível',
      );

      const dataExpiracao = new Date();
      dataExpiracao.setHours(dataExpiracao.getHours() + 1); // Token válido por 1 hora

      await tokenModel.upsert({
        where: { usuarioId: id },
        create: {
          usuarioId: id,
          token,
          dataExpiracao,
        },
        update: {
          token,
          dataExpiracao,
          utilizado: false,
        },
      });
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao salvar token de redefinição de senha');
    }
  }

  // Método atualizado para usar o helper ensurePrismaModel
  async verificarTokenRedefinicaoSenha(id: string, token: string): Promise<boolean> {
    try {
      const tokenModel = ensurePrismaModel<ITokenRedefinicaoSenhaModel>(
        this.prisma,
        'tokenRedefinicaoSenha',
        'Modelo tokenRedefinicaoSenha não está disponível',
      );

      const tokenInfo = await tokenModel.findUnique({
        where: { usuarioId: id },
      });

      if (!tokenInfo) {
        return false;
      }

      const tokenValido =
        tokenInfo.token === token && !tokenInfo.utilizado && tokenInfo.dataExpiracao > new Date();

      return tokenValido;
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao verificar token de redefinição de senha');
    }
  }

  // Método atualizado para usar o helper ensurePrismaModel
  async limparTokenRedefinicaoSenha(id: string): Promise<void> {
    try {
      const tokenModel = ensurePrismaModel<ITokenRedefinicaoSenhaModel>(
        this.prisma,
        'tokenRedefinicaoSenha',
        'Modelo tokenRedefinicaoSenha não está disponível',
      );

      await tokenModel.update({
        where: { usuarioId: id },
        data: {
          utilizado: true,
        },
      });
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao limpar token de redefinição de senha');
    }
  }

  // Método atualizado para usar o helper ensurePrismaModel
  async salvarRefreshToken(id: string, refreshToken: string): Promise<void> {
    try {
      const tokenModel = ensurePrismaModel<IRefreshTokenModel>(
        this.prisma,
        'refreshToken',
        'Modelo refreshToken não está disponível',
      );

      await tokenModel.upsert({
        where: { usuarioId: id },
        create: {
          usuarioId: id,
          token: refreshToken,
        },
        update: {
          token: refreshToken,
        },
      });
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao salvar refresh token');
    }
  }

  // Método atualizado para usar o helper ensurePrismaModel
  async verificarRefreshToken(id: string, refreshToken: string): Promise<boolean> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const refreshTokenModel = ensurePrismaModel<IRefreshTokenModel>(this.prisma, 'refreshToken');

      // Buscar o refresh token pelo ID do usuário e valor do token
      const tokenEncontrado = await refreshTokenModel.findFirst({
        where: {
          usuarioId: id,
          token: refreshToken,
        },
      });

      // Retornar true se encontrou o token, false caso contrário
      return !!tokenEncontrado;
    } catch (error) {
      throw mapPrismaError(error, 'RefreshToken');
    }
  }

  // Método atualizado para usar o helper ensurePrismaModel
  async atualizarRefreshToken(
    id: string,
    refreshTokenAntigo: string,
    refreshTokenNovo: string,
  ): Promise<void> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const refreshTokenModel = ensurePrismaModel<IRefreshTokenModel>(this.prisma, 'refreshToken');

      // Atualizar o refresh token existente
      await refreshTokenModel.updateMany({
        where: {
          usuarioId: id,
          token: refreshTokenAntigo,
        },
        data: {
          token: refreshTokenNovo,
          atualizadoEm: new Date(),
        },
      });
    } catch (error) {
      throw mapPrismaError(error, 'RefreshToken');
    }
  }

  // Método atualizado para usar o helper ensurePrismaModel
  async buscarPermissoes(id: string): Promise<string[]> {
    try {
      const permissoesModel = ensurePrismaModel<IPermissaoUsuarioModel>(
        this.prisma,
        'permissaoUsuario',
        'Modelo permissaoUsuario não está disponível',
      );

      const permissoes = await permissoesModel.findMany({
        where: { usuarioId: id },
        include: { permissao: true },
      });

      return permissoes.map((p) => p.permissao.codigo);
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao buscar permissões do usuário');
    }
  }

  async findWithCredentials(email: string): Promise<IUsuarioComCredenciais | null> {
    try {
      const usuario = await this.prisma.usuario.findUnique({
        where: { email },
        include: {
          instituicoes: {
            include: {
              instituicao: true,
            },
          },
        },
      });

      if (!usuario) {
        return null;
      }

      // Converter para o formato esperado de IUsuarioComCredenciais
      return {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        senha: usuario.senha,
        cargo: mapCargoFromPrisma(usuario.cargo),
        validar: async () => true,
        validarEmail: async () => true,
        ehAdministrador: () => mapCargoFromPrisma(usuario.cargo) === CargoUsuario.ADMINISTRADOR,
        podeGerenciarUsuarios: () =>
          [CargoUsuario.ADMINISTRADOR, CargoUsuario.COORDENADOR].includes(
            mapCargoFromPrisma(usuario.cargo),
          ),
        temPermissao: async () => false,
        atualizar: async () => this.mapToDomain(usuario),
        obterInstituicoes: async () => this.buscarUsuarioInstituicoes(usuario.id),
        verificarPertencimentoInstituicao: async (instituicaoId) =>
          this.pertenceInstituicao(usuario.id, instituicaoId),
      };
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao buscar usuário com credenciais');
    }
  }

  async buscarUsuarioInstituicoes(id: string): Promise<IUsuarioInstituicao[]> {
    try {
      const usuarioComInstituicoes = await this.prisma.usuario.findUnique({
        where: { id },
        include: {
          instituicoes: {
            include: {
              instituicao: true,
            },
          },
        },
      });

      if (!usuarioComInstituicoes) {
        return [];
      }

      // Mapear instituições para o formato IUsuarioInstituicao
      return (usuarioComInstituicoes.instituicoes || [])
        .filter((rel) => rel.ativo)
        .map((rel) => ({
          id: rel.id,
          usuarioId: id,
          instituicaoId: rel.instituicaoId,
          cargo: mapCargoFromPrisma(rel.cargo || ''),
          ativo: rel.ativo,
          criadoEm: rel.criadoEm,
          atualizadoEm: rel.atualizadoEm,
          instituicao: rel.instituicao
            ? {
                id: rel.instituicao.id,
                nome: rel.instituicao.nome,
                tipo: rel.instituicao.tipo,
              }
            : undefined,
        }));
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao buscar instituições do usuário');
    }
  }

  async pertenceInstituicao(
    usuarioId: string,
    instituicaoId: string,
  ): Promise<IResultadoPertencimento> {
    try {
      const relacao = await this.prisma.usuarioInstituicao.findFirst({
        where: {
          usuarioId,
          instituicaoId,
          ativo: true,
        },
      });

      return {
        pertence: !!relacao,
        cargo: relacao ? mapCargoFromPrisma(relacao.cargo || '') : undefined,
      };
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao verificar pertencimento à instituição');
    }
  }

  async associarAInstituicao(
    usuarioId: string,
    instituicaoId: string,
    cargo?: CargoUsuario,
  ): Promise<void> {
    try {
      // Garantir que o modelo existe no cliente Prisma
      const usuarioInstituicaoModel = ensurePrismaModel(this.prisma, 'usuarioInstituicao');

      // Dados para criar ou atualizar a associação
      const data = {
        usuarioId,
        instituicaoId,
        cargo: cargo ? mapCargoToPrisma(String(cargo)) : mapCargoToPrisma(CargoUsuario.PROFESSOR),
      };

      // Verificar se já existe uma associação
      const associacaoExistente = await usuarioInstituicaoModel.findFirst({
        where: {
          usuarioId,
          instituicaoId,
        },
      });

      if (associacaoExistente) {
        // Atualizar a associação existente
        await usuarioInstituicaoModel.update({
          where: {
            id: associacaoExistente.id,
          },
          data,
        });
      } else {
        // Criar uma nova associação
        await usuarioInstituicaoModel.create({
          data,
        });
      }
    } catch (error) {
      throw mapPrismaError(error, 'UsuarioInstituicao');
    }
  }

  async removerDeInstituicao(usuarioId: string, instituicaoId: string): Promise<void> {
    try {
      await this.prisma.usuarioInstituicao.updateMany({
        where: {
          usuarioId,
          instituicaoId,
        },
        data: {
          ativo: false,
          atualizadoEm: new Date(),
        },
      });
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao remover usuário da instituição');
    }
  }

  async adicionarInstituicao(
    usuarioId: string,
    instituicaoId: string,
  ): Promise<IUsuarioInstituicao> {
    try {
      // Verificar se a relação já existe
      const relacaoExistente = await this.prisma.usuarioInstituicao.findFirst({
        where: {
          usuarioId,
          instituicaoId,
        },
        include: {
          instituicao: true,
        },
      });

      if (relacaoExistente) {
        // Se já existe mas está inativa, reativar
        if (!relacaoExistente.ativo) {
          const relacaoAtualizada = await this.prisma.usuarioInstituicao.update({
            where: {
              id: relacaoExistente.id,
            },
            data: {
              ativo: true,
              atualizadoEm: new Date(),
            },
            include: {
              instituicao: true,
            },
          });

          return {
            id: relacaoAtualizada.id,
            usuarioId,
            instituicaoId,
            cargo: mapCargoFromPrisma(relacaoAtualizada.cargo || ''),
            ativo: relacaoAtualizada.ativo,
            criadoEm: relacaoAtualizada.criadoEm,
            atualizadoEm: relacaoAtualizada.atualizadoEm,
            instituicao: relacaoAtualizada.instituicao
              ? {
                  id: relacaoAtualizada.instituicao.id,
                  nome: relacaoAtualizada.instituicao.nome,
                  tipo: relacaoAtualizada.instituicao.tipo,
                }
              : undefined,
          };
        }

        // Se já existe e está ativa, retornar os dados atuais
        return {
          id: relacaoExistente.id,
          usuarioId,
          instituicaoId,
          cargo: mapCargoFromPrisma(relacaoExistente.cargo || ''),
          ativo: relacaoExistente.ativo,
          criadoEm: relacaoExistente.criadoEm,
          atualizadoEm: relacaoExistente.atualizadoEm,
          instituicao: relacaoExistente.instituicao
            ? {
                id: relacaoExistente.instituicao.id,
                nome: relacaoExistente.instituicao.nome,
                tipo: relacaoExistente.instituicao.tipo,
              }
            : undefined,
        };
      }

      // Criar nova relação
      const novaRelacao = await this.prisma.usuarioInstituicao.create({
        data: {
          usuarioId,
          instituicaoId,
          ativo: true,
          criadoEm: new Date(),
          atualizadoEm: new Date(),
        },
        include: {
          instituicao: true,
        },
      });

      return {
        id: novaRelacao.id,
        usuarioId,
        instituicaoId,
        cargo: mapCargoFromPrisma(novaRelacao.cargo || ''),
        ativo: novaRelacao.ativo,
        criadoEm: novaRelacao.criadoEm,
        atualizadoEm: novaRelacao.atualizadoEm,
        instituicao: novaRelacao.instituicao
          ? {
              id: novaRelacao.instituicao.id,
              nome: novaRelacao.instituicao.nome,
              tipo: novaRelacao.instituicao.tipo,
            }
          : undefined,
      };
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao adicionar instituição ao usuário');
    }
  }

  async removerInstituicao(usuarioId: string, instituicaoId: string): Promise<void> {
    try {
      // Buscar a relação
      const relacao = await this.prisma.usuarioInstituicao.findFirst({
        where: {
          usuarioId,
          instituicaoId,
        },
      });

      if (!relacao) {
        // Se não existe, não há nada a fazer
        return;
      }

      // Inativar a relação em vez de excluí-la
      await this.prisma.usuarioInstituicao.update({
        where: {
          id: relacao.id,
        },
        data: {
          ativo: false,
          atualizadoEm: new Date(),
        },
      });
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao remover instituição do usuário');
    }
  }

  // Mapear dados do Prisma para o domínio
  private mapToDomain(data: PrismaUsuarioRecord): Usuario {
    return Usuario.restaurar({
      id: data.id as string,
      nome: data.nome as string,
      email: data.email as string,
      cargo: mapCargoFromPrisma(data.cargo as string),
      matricula: data.matricula as string | undefined,
      telefone: data.telefone as string | undefined,
      fotoPerfil: data.fotoPerfil as string | undefined,
      status: mapStatusFromPrisma(data.status as string),
      criadoEm: data.criadoEm as Date,
      atualizadoEm: data.atualizadoEm as Date,
    });
  }

  // Métodos para verificar permissões específicas
  async ehAdministrador(usuarioId: string): Promise<boolean> {
    try {
      const usuario = await this.findById(usuarioId);
      return usuario?.cargo === CargoUsuario.ADMINISTRADOR;
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao verificar permissão de administrador');
    }
  }

  async podeGerenciarUsuarios(usuarioId: string): Promise<boolean> {
    try {
      // Verificar se o usuário existe
      const usuario = await this.findById(usuarioId);

      // Usuário não encontrado não pode gerenciar
      if (!usuario) {
        return false;
      }

      // Verificar se o usuário tem cargo de administrador ou coordenador
      return [CargoUsuario.ADMINISTRADOR, CargoUsuario.COORDENADOR].includes(
        mapCargoFromPrisma(usuario.cargo),
      );
    } catch (error) {
      throw mapPrismaError(error, 'Usuario');
    }
  }
}
