/**
 * Arquivo de exemplo demonstrando o uso dos padrões recomendados
 * para implementação de repositórios Prisma
 */
import { injectable } from 'tsyringe';
import {
  
  ensurePrismaModel,
  handlePrismaResult,
  ITokenRedefinicaoSenhaModel,
} from '../../../types/prisma-extended';
import { Usuario } from '../../../domain/entities/usuario.entity';
import { IUsuarioRepository } from '../../../domain/repositories/usuario-repository.interface';
import { ICriarUsuarioDTO } from '../../../domain/dtos/usuario.dto';

import { mapPrismaError, sanitizeForPrisma } from '../../../shared/helpers/prisma-helper';
import { IPrismaUsuarioData } from '../../../types/prisma';
import { mapStatusFromPrisma, mapStatusToPrisma } from '../../../shared/utils/enum-mappers';
import { Status } from '../../../shared/enums';

/**
 * Exemplo de repositório usando os padrões recomendados
 */
@injectable()
export class ExemploRepository implements IUsuarioRepository {
  /**
   * Exemplo de método com tratamento seguro para modelo não documentado
   */
  async salvarTokenRedefinicaoSenha(id: string, token: string): Promise<void> {
    try {
      // Usa o helper ensurePrismaModel para verificar a existência do modelo
      const tokenModel = ensurePrismaModel<ITokenRedefinicaoSenhaModel>(
        this.prisma,
        'tokenRedefinicaoSenha',
        'Modelo tokenRedefinicaoSenha não está disponível',
      );

      const dataExpiracao = new Date();
      dataExpiracao.setHours(dataExpiracao.getHours() + 1);

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

  /**
   * Exemplo de método com tratamento de resultado undefined
   */
  async findAll(): Promise<Usuario[]> {
    try {
      const usuarios = await this.prisma.usuario?.findMany({
        where: {
          status: { not: mapStatusToPrisma(Status.CANCELADO) },
        },
        orderBy: {
          nome: 'asc',
        },
      });

      // Usa o helper handlePrismaResult para tratar resultado possivelmente undefined
      return handlePrismaResult(usuarios, []).map((usuario) => this.mapToDomain(usuario));
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao listar usuários');
    }
  }

  /**
   * Exemplo de método com sanitização e mapeamento de dados
   */
  async create(data: ICriarUsuarioDTO): Promise<Usuario> {
    try {
      const prismaData = sanitizeForPrisma({
        nome: data.nome,
        email: data.email,
        senha: data.senha,
        cargo: mapStatusToPrisma(data.cargo),
        matricula: data.matricula,
        telefone: data.telefone,
        fotoPerfil: data.fotoPerfil,
        status: mapStatusToPrisma(Status.ATIVO),
      });

      const usuario = await this.prisma.usuario.create({
        data: prismaData,
      });

      return this.mapToDomain(usuario);
    } catch (error) {
      throw mapPrismaError(error, 'Erro ao criar usuário');
    }
  }

  // Implementações restantes omitidas para brevidade...

  /**
   * Método para mapear dados do Prisma para o domínio
   */
  private mapToDomain(data: IPrismaUsuarioData): Usuario {
    return Usuario.restaurar({
      id: data.id,
      nome: data.nome,
      email: data.email,
      cargo: data.cargo,
      matricula: data.matricula,
      telefone: data.telefone,
      fotoPerfil: data.fotoPerfil,
      status: mapStatusFromPrisma(data.status),
      criadoEm: data.criadoEm,
      atualizadoEm: data.atualizadoEm,
    });
  }
}
