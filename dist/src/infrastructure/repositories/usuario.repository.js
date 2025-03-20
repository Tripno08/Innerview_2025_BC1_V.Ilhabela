"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioRepository = void 0;
const base_repository_1 = require("./base.repository");
const usuario_entity_1 = require("@domain/entities/usuario.entity");
const enums_1 = require("@shared/enums");
const enum_mappers_1 = require("@shared/utils/enum-mappers");
class UsuarioRepository extends base_repository_1.BaseRepository {
    mapToUsuario(usuarioPrisma) {
        return usuario_entity_1.Usuario.restaurar({
            id: usuarioPrisma.id,
            nome: usuarioPrisma.nome,
            email: usuarioPrisma.email,
            cargo: (0, enum_mappers_1.mapPrismaCargoToLocal)(usuarioPrisma.cargo),
            criadoEm: usuarioPrisma.criadoEm || new Date(),
            atualizadoEm: usuarioPrisma.atualizadoEm || new Date(),
        });
    }
    async findAll() {
        try {
            const usuarios = await this.unitOfWork.withoutTransaction((prisma) => prisma.usuario.findMany({
                orderBy: {
                    nome: 'asc',
                },
            }));
            return usuarios.map(this.mapToUsuario);
        }
        catch (error) {
            this.handlePrismaError(error, 'Usuário');
        }
    }
    async findById(id) {
        try {
            const usuario = await this.unitOfWork.withoutTransaction((prisma) => prisma.usuario.findUnique({
                where: { id },
            }));
            if (!usuario) {
                return null;
            }
            return this.mapToUsuario(usuario);
        }
        catch (error) {
            this.handlePrismaError(error, 'Usuário');
        }
    }
    async findByEmail(email) {
        try {
            const usuario = await this.unitOfWork.withoutTransaction((prisma) => prisma.usuario.findUnique({
                where: { email },
            }));
            if (!usuario) {
                return null;
            }
            return this.mapToUsuario(usuario);
        }
        catch (error) {
            this.handlePrismaError(error, 'Usuário');
        }
    }
    async findWithCredentials(email) {
        try {
            const usuario = await this.unitOfWork.withoutTransaction((prisma) => prisma.usuario.findUnique({
                where: { email },
            }));
            if (!usuario) {
                return null;
            }
            const usuarioBase = this.mapToUsuario(usuario);
            const usuarioComCredenciais = Object.assign(Object.create(Object.getPrototypeOf(usuarioBase)), {
                ...usuarioBase,
                senha: usuario.senha || '',
                salt: '',
            });
            return usuarioComCredenciais;
        }
        catch (error) {
            this.handlePrismaError(error, 'Usuário');
        }
    }
    async create(data) {
        try {
            const usuario = await this.unitOfWork.withTransaction(async (prisma) => {
                const novoUsuario = await prisma.usuario.create({
                    data: {
                        nome: data.nome,
                        email: data.email,
                        cargo: (0, enum_mappers_1.mapLocalCargoToPrisma)(data.cargo || enums_1.CargoUsuario.PROFESSOR),
                        senha: data.senha,
                    },
                });
                return novoUsuario;
            });
            return this.mapToUsuario(usuario);
        }
        catch (error) {
            this.handlePrismaError(error, 'Usuário');
        }
    }
    async update(id, data) {
        try {
            const prismaData = {
                ...(data.nome && { nome: data.nome }),
                ...(data.email && { email: data.email }),
            };
            if (data.cargo) {
                prismaData.cargo = (0, enum_mappers_1.mapLocalCargoToPrisma)(data.cargo);
            }
            const usuario = await this.unitOfWork.withTransaction(async (prisma) => {
                const existente = await prisma.usuario.findUnique({
                    where: { id },
                });
                if (!existente) {
                    throw new Error('Usuário não encontrado');
                }
                return await prisma.usuario.update({
                    where: { id },
                    data: prismaData,
                });
            });
            return usuario_entity_1.Usuario.restaurar({
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                cargo: (0, enum_mappers_1.mapPrismaCargoToLocal)(usuario.cargo),
                criadoEm: usuario.criadoEm || new Date(),
                atualizadoEm: usuario.atualizadoEm || new Date(),
            });
        }
        catch (error) {
            this.handlePrismaError(error, 'Usuário');
        }
    }
    async delete(id) {
        try {
            await this.unitOfWork.withTransaction(async (prisma) => {
                const existente = await prisma.usuario.findUnique({
                    where: { id },
                });
                if (!existente) {
                    throw new Error('Usuário não encontrado');
                }
                await prisma.usuario.delete({
                    where: { id },
                });
            });
        }
        catch (error) {
            this.handlePrismaError(error, 'Usuário');
        }
    }
    async associarAInstituicao(usuarioId, instituicaoId, cargo) {
        try {
            await this.unitOfWork.withTransaction(async (prisma) => {
                const usuario = await prisma.usuario.findUnique({
                    where: { id: usuarioId },
                });
                if (!usuario) {
                    throw new Error('Usuário não encontrado');
                }
                const instituicao = await prisma.instituicao.findUnique({
                    where: { id: instituicaoId },
                });
                if (!instituicao) {
                    throw new Error('Instituição não encontrada');
                }
                const associacaoExistente = await prisma.usuarioInstituicao.findFirst({
                    where: {
                        usuarioId,
                        instituicaoId,
                    },
                });
                if (associacaoExistente) {
                    if (cargo && associacaoExistente.cargo !== (0, enum_mappers_1.mapLocalCargoToPrisma)(cargo)) {
                        await prisma.usuarioInstituicao.update({
                            where: { id: associacaoExistente.id },
                            data: { cargo: (0, enum_mappers_1.mapLocalCargoToPrisma)(cargo) },
                        });
                    }
                    return;
                }
                await prisma.usuarioInstituicao.create({
                    data: {
                        usuarioId,
                        instituicaoId,
                        cargo: (0, enum_mappers_1.mapLocalCargoToPrisma)(cargo || enums_1.CargoUsuario.PROFESSOR),
                    },
                });
            });
        }
        catch (error) {
            this.handlePrismaError(error, 'Associação de Usuário-Instituição');
        }
    }
    async removerDeInstituicao(usuarioId, instituicaoId) {
        try {
            await this.unitOfWork.withTransaction(async (prisma) => {
                const associacao = await prisma.usuarioInstituicao.findFirst({
                    where: {
                        usuarioId,
                        instituicaoId,
                    },
                });
                if (!associacao) {
                    throw new Error('Usuário não está associado a esta instituição');
                }
                await prisma.usuarioInstituicao.delete({
                    where: { id: associacao.id },
                });
            });
        }
        catch (error) {
            this.handlePrismaError(error, 'Associação de Usuário-Instituição');
        }
    }
    async listarInstituicoesDoUsuario(usuarioId) {
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
                    cargo: (0, enum_mappers_1.mapPrismaCargoToLocal)(a.cargo),
                    ativo: a.ativo,
                    criadoEm: a.criadoEm,
                    atualizadoEm: a.atualizadoEm,
                    instituicao: a.instituicao,
                }));
            });
        }
        catch (error) {
            this.handlePrismaError(error, 'Instituições do Usuário');
        }
    }
    async verificarPertencimentoInstituicao(usuarioId, instituicaoId) {
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
                cargo: (0, enum_mappers_1.mapPrismaCargoToLocal)(associacao.cargo),
            };
        }
        catch (error) {
            this.handlePrismaError(error, 'Verificação de pertencimento');
        }
    }
}
exports.UsuarioRepository = UsuarioRepository;
//# sourceMappingURL=usuario.repository.js.map