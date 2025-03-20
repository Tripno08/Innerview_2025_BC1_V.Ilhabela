"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioRepository = void 0;
const usuario_entity_1 = require("@domain/entities/usuario.entity");
const app_error_1 = require("@shared/errors/app-error");
const base_repository_1 = require("./base.repository");
const client_1 = require("@prisma/client");
class UsuarioRepository extends base_repository_1.BaseRepository {
    async findAll() {
        try {
            const usuarios = await this.unitOfWork.withoutTransaction(prisma => prisma.usuario.findMany({
                orderBy: {
                    nome: 'asc',
                },
            }));
            return usuarios.map(usuario => usuario_entity_1.Usuario.restaurar(usuario));
        }
        catch (error) {
            this.handlePrismaError(error, 'Usuário');
        }
    }
    async findById(id) {
        try {
            const usuario = await this.unitOfWork.withoutTransaction(prisma => prisma.usuario.findUnique({
                where: { id },
            }));
            if (!usuario) {
                return null;
            }
            return usuario_entity_1.Usuario.restaurar(usuario);
        }
        catch (error) {
            this.handlePrismaError(error, 'Usuário');
        }
    }
    async findByEmail(email) {
        try {
            const usuario = await this.unitOfWork.withoutTransaction(prisma => prisma.usuario.findUnique({
                where: { email },
            }));
            if (!usuario) {
                return null;
            }
            return usuario_entity_1.Usuario.restaurar(usuario);
        }
        catch (error) {
            this.handlePrismaError(error, 'Usuário');
        }
    }
    async findWithCredentials(email) {
        try {
            const usuario = await this.unitOfWork.withoutTransaction(prisma => prisma.usuario.findUnique({
                where: { email },
            }));
            return usuario;
        }
        catch (error) {
            this.handlePrismaError(error, 'Usuário');
        }
    }
    async create(data) {
        try {
            const usuario = await this.unitOfWork.withTransaction(async (prisma) => {
                return await prisma.usuario.create({
                    data,
                });
            });
            return usuario_entity_1.Usuario.restaurar(usuario);
        }
        catch (error) {
            this.handlePrismaError(error, 'Usuário');
        }
    }
    async update(id, data) {
        try {
            const usuario = await this.unitOfWork.withTransaction(async (prisma) => {
                return await prisma.usuario.update({
                    where: { id },
                    data,
                });
            });
            return usuario_entity_1.Usuario.restaurar(usuario);
        }
        catch (error) {
            this.handlePrismaError(error, 'Usuário');
        }
    }
    async delete(id) {
        try {
            await this.unitOfWork.withTransaction(async (prisma) => {
                await prisma.usuarioInstituicao.deleteMany({
                    where: { usuarioId: id },
                });
                await prisma.usuario.delete({
                    where: { id },
                });
            });
        }
        catch (error) {
            this.handlePrismaError(error, 'Usuário');
        }
    }
    async associarAInstituicao(usuarioId, instituicaoId, cargo = client_1.CargoUsuario.PROFESSOR) {
        try {
            await this.unitOfWork.withTransaction(async (prisma) => {
                const usuario = await prisma.usuario.findUnique({
                    where: { id: usuarioId },
                });
                if (!usuario) {
                    throw new app_error_1.AppError('Usuário não encontrado', 404, 'USER_NOT_FOUND');
                }
                const instituicao = await prisma.instituicao.findUnique({
                    where: { id: instituicaoId },
                });
                if (!instituicao) {
                    throw new app_error_1.AppError('Instituição não encontrada', 404, 'INSTITUTION_NOT_FOUND');
                }
                const associacaoExistente = await prisma.usuarioInstituicao.findUnique({
                    where: {
                        usuarioId_instituicaoId: {
                            usuarioId,
                            instituicaoId,
                        },
                    },
                });
                if (associacaoExistente) {
                    throw new app_error_1.AppError('Usuário já está associado a esta instituição', 409, 'USER_ALREADY_ASSOCIATED');
                }
                await prisma.usuarioInstituicao.create({
                    data: {
                        usuarioId,
                        instituicaoId,
                        cargo,
                    },
                });
            });
        }
        catch (error) {
            if (error instanceof app_error_1.AppError) {
                throw error;
            }
            this.handlePrismaError(error, 'Associação Usuário-Instituição');
        }
    }
    async removerDeInstituicao(usuarioId, instituicaoId) {
        try {
            await this.unitOfWork.withTransaction(async (prisma) => {
                await prisma.usuarioInstituicao.delete({
                    where: {
                        usuarioId_instituicaoId: {
                            usuarioId,
                            instituicaoId,
                        },
                    },
                });
            });
        }
        catch (error) {
            this.handlePrismaError(error, 'Associação Usuário-Instituição');
        }
    }
    async listarInstituicoesDoUsuario(usuarioId) {
        try {
            const associacoes = await this.unitOfWork.withoutTransaction(prisma => prisma.usuarioInstituicao.findMany({
                where: { usuarioId },
                include: {
                    instituicao: true,
                },
            }));
            return associacoes.map(assoc => ({
                ...assoc.instituicao,
                cargo: assoc.cargo,
            }));
        }
        catch (error) {
            this.handlePrismaError(error, 'Instituição');
        }
    }
    async verificarPertencimentoInstituicao(usuarioId, instituicaoId) {
        try {
            const associacao = await this.unitOfWork.withoutTransaction(prisma => prisma.usuarioInstituicao.findUnique({
                where: {
                    usuarioId_instituicaoId: {
                        usuarioId,
                        instituicaoId,
                    },
                },
            }));
            return !!associacao;
        }
        catch (error) {
            this.handlePrismaError(error, 'Associação Usuário-Instituição');
        }
    }
}
exports.UsuarioRepository = UsuarioRepository;
//# sourceMappingURL=usuario.repository.js.map