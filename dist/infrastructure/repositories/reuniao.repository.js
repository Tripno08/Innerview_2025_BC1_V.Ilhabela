"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReuniaoRepository = void 0;
const base_repository_1 = require("./base.repository");
const app_error_1 = require("@shared/errors/app-error");
const reuniao_entity_1 = require("@domain/entities/reuniao.entity");
var Status;
(function (Status) {
    Status["PENDENTE"] = "PENDENTE";
    Status["AGENDADO"] = "AGENDADO";
    Status["ATIVO"] = "ATIVO";
    Status["EM_ANDAMENTO"] = "EM_ANDAMENTO";
    Status["CONCLUIDO"] = "CONCLUIDO";
    Status["CANCELADO"] = "CANCELADO";
})(Status || (Status = {}));
class ReuniaoRepository extends base_repository_1.BaseRepository {
    async findAll() {
        try {
            const reunioes = await this.unitOfWork.withoutTransaction((prisma) => prisma.reuniao.findMany({
                include: this.getReuniaoIncludes(),
                orderBy: {
                    data: 'desc',
                },
            }));
            return Array.isArray(reunioes) ? reunioes.map((r) => this.mapToReuniao(r)) : [];
        }
        catch (error) {
            this.handlePrismaError(error, 'Reunião');
        }
    }
    async findByEquipe(equipeId) {
        try {
            const reunioes = await this.unitOfWork.withoutTransaction((prisma) => prisma.reuniao.findMany({
                where: {
                    equipeId,
                },
                include: this.getReuniaoIncludes(),
                orderBy: {
                    data: 'desc',
                },
            }));
            return Array.isArray(reunioes) ? reunioes.map((r) => this.mapToReuniao(r)) : [];
        }
        catch (error) {
            this.handlePrismaError(error, 'Reunião');
        }
    }
    async findByData(dataInicio, dataFim) {
        try {
            const reunioes = await this.unitOfWork.withoutTransaction((prisma) => prisma.reuniao.findMany({
                where: {
                    data: {
                        gte: dataInicio,
                        lte: dataFim,
                    },
                },
                include: this.getReuniaoIncludes(),
                orderBy: {
                    data: 'desc',
                },
            }));
            return Array.isArray(reunioes) ? reunioes.map((r) => this.mapToReuniao(r)) : [];
        }
        catch (error) {
            this.handlePrismaError(error, 'Reunião');
        }
    }
    async findByStatus(status) {
        try {
            const statusEnum = status;
            const reunioes = await this.unitOfWork.withoutTransaction((prisma) => prisma.reuniao.findMany({
                where: {
                    status: statusEnum,
                },
                include: this.getReuniaoIncludes(),
                orderBy: {
                    data: 'desc',
                },
            }));
            return Array.isArray(reunioes) ? reunioes.map((r) => this.mapToReuniao(r)) : [];
        }
        catch (error) {
            this.handlePrismaError(error, 'Reunião');
        }
    }
    async findById(id) {
        try {
            const reuniao = await this.unitOfWork.withoutTransaction((prisma) => prisma.reuniao.findUnique({
                where: { id },
                include: this.getReuniaoIncludes(),
            }));
            if (!reuniao) {
                return null;
            }
            return this.mapToReuniao(reuniao);
        }
        catch (error) {
            this.handlePrismaError(error, 'Reunião');
        }
    }
    async create(data) {
        try {
            const reuniao = await this.unitOfWork.withTransaction(async (prisma) => {
                const dadosComStatus = {
                    ...data,
                    status: data.status || Status.AGENDADO,
                };
                return await prisma.reuniao.create({
                    data: dadosComStatus,
                    include: this.getReuniaoIncludes(),
                });
            });
            return this.mapToReuniao(reuniao);
        }
        catch (error) {
            this.handlePrismaError(error, 'Reunião');
        }
    }
    async update(id, data) {
        try {
            const reuniao = await this.unitOfWork.withTransaction(async (prisma) => {
                return await prisma.reuniao.update({
                    where: { id },
                    data,
                    include: this.getReuniaoIncludes(),
                });
            });
            return this.mapToReuniao(reuniao);
        }
        catch (error) {
            this.handlePrismaError(error, 'Reunião');
        }
    }
    async delete(id) {
        try {
            await this.unitOfWork.withTransaction(async (prisma) => {
                await prisma.participanteReuniao.deleteMany({
                    where: { reuniaoId: id },
                });
                await prisma.encaminhamento.updateMany({
                    where: { reuniaoId: id },
                    data: { reuniaoId: null },
                });
                await prisma.reuniao.delete({
                    where: { id },
                });
            });
        }
        catch (error) {
            this.handlePrismaError(error, 'Reunião');
        }
    }
    async adicionarParticipante(reuniaoId, usuarioId, cargo) {
        try {
            await this.unitOfWork.withTransaction(async (prisma) => {
                const reuniao = await prisma.reuniao.findUnique({
                    where: { id: reuniaoId },
                });
                if (!reuniao) {
                    throw new app_error_1.AppError('Reunião não encontrada', 404, 'MEETING_NOT_FOUND');
                }
                const usuario = await prisma.usuario.findUnique({
                    where: { id: usuarioId },
                });
                if (!usuario) {
                    throw new app_error_1.AppError('Usuário não encontrado', 404, 'USER_NOT_FOUND');
                }
                const participanteExistente = await prisma.participanteReuniao.findFirst({
                    where: {
                        reuniaoId,
                        usuarioId,
                    },
                });
                if (participanteExistente) {
                    throw new app_error_1.AppError('Usuário já é participante desta reunião', 409, 'USER_ALREADY_PARTICIPANT');
                }
                await prisma.participanteReuniao.create({
                    data: {
                        reuniaoId,
                        usuarioId,
                        cargo,
                        presente: false,
                    },
                });
            });
        }
        catch (error) {
            if (error instanceof app_error_1.AppError) {
                throw error;
            }
            this.handlePrismaError(error, 'Participante da Reunião');
        }
    }
    async removerParticipante(reuniaoId, usuarioId) {
        try {
            await this.unitOfWork.withTransaction(async (prisma) => {
                const participante = await prisma.participanteReuniao.findFirst({
                    where: {
                        reuniaoId,
                        usuarioId,
                    },
                });
                if (!participante) {
                    throw new app_error_1.AppError('Usuário não é participante desta reunião', 404, 'USER_NOT_PARTICIPANT');
                }
                await prisma.participanteReuniao.delete({
                    where: {
                        id: participante.id,
                    },
                });
            });
        }
        catch (error) {
            if (error instanceof app_error_1.AppError) {
                throw error;
            }
            this.handlePrismaError(error, 'Participante da Reunião');
        }
    }
    async marcarPresenca(reuniaoId, usuarioId, presente) {
        try {
            await this.unitOfWork.withTransaction(async (prisma) => {
                const participante = await prisma.participanteReuniao.findFirst({
                    where: {
                        reuniaoId,
                        usuarioId,
                    },
                });
                if (!participante) {
                    throw new app_error_1.AppError('Usuário não é participante desta reunião', 404, 'USER_NOT_PARTICIPANT');
                }
                await prisma.participanteReuniao.update({
                    where: {
                        id: participante.id,
                    },
                    data: {
                        presente,
                    },
                });
            });
        }
        catch (error) {
            if (error instanceof app_error_1.AppError) {
                throw error;
            }
            this.handlePrismaError(error, 'Participante da Reunião');
        }
    }
    async listarParticipantes(reuniaoId) {
        try {
            const participantes = await this.unitOfWork.withoutTransaction((prisma) => prisma.participanteReuniao.findMany({
                where: {
                    reuniaoId,
                },
                include: {
                    usuario: true,
                },
                orderBy: {
                    usuario: {
                        nome: 'asc',
                    },
                },
            }));
            return Array.isArray(participantes) ? participantes.map((p) => ({
                id: p.id,
                presente: p.presente,
                cargo: p.cargo,
                usuario: {
                    id: p.usuario.id,
                    nome: p.usuario.nome,
                    email: p.usuario.email,
                    cargo: p.usuario.cargo,
                },
            })) : [];
        }
        catch (error) {
            this.handlePrismaError(error, 'Participante da Reunião');
        }
    }
    async adicionarEncaminhamento(reuniaoId, encaminhamentoData) {
        try {
            const reuniaoExiste = await this.unitOfWork.withoutTransaction((prisma) => prisma.reuniao.findUnique({
                where: { id: reuniaoId },
            }));
            if (!reuniaoExiste) {
                throw new app_error_1.AppError('Reunião não encontrada', 404, 'MEETING_NOT_FOUND');
            }
            const encaminhamento = await this.unitOfWork.withTransaction(async (prisma) => {
                return await prisma.encaminhamento.create({
                    data: {
                        ...encaminhamentoData,
                        reuniaoId,
                    },
                    include: {
                        estudante: true,
                        atribuidoUsuario: true,
                        criadoUsuario: true,
                    },
                });
            });
            return {
                id: encaminhamento.id,
                titulo: encaminhamento.titulo,
                descricao: encaminhamento.descricao,
                dataPrazo: encaminhamento.dataPrazo,
                status: encaminhamento.status,
                prioridade: encaminhamento.prioridade,
                dataConclusao: encaminhamento.dataConclusao,
                observacoes: encaminhamento.observacoes,
                estudante: {
                    id: encaminhamento.estudante.id,
                    nome: encaminhamento.estudante.nome,
                },
                atribuidoPara: {
                    id: encaminhamento.atribuidoUsuario.id,
                    nome: encaminhamento.atribuidoUsuario.nome,
                },
                criadoPor: {
                    id: encaminhamento.criadoUsuario.id,
                    nome: encaminhamento.criadoUsuario.nome,
                },
            };
        }
        catch (error) {
            if (error instanceof app_error_1.AppError) {
                throw error;
            }
            this.handlePrismaError(error, 'Encaminhamento');
        }
    }
    async listarEncaminhamentos(reuniaoId) {
        try {
            const encaminhamentos = await this.unitOfWork.withoutTransaction((prisma) => prisma.encaminhamento.findMany({
                where: {
                    reuniaoId,
                },
                include: {
                    estudante: true,
                    atribuidoUsuario: true,
                    criadoUsuario: true,
                },
                orderBy: {
                    criadoEm: 'desc',
                },
            }));
            return Array.isArray(encaminhamentos) ? encaminhamentos.map((e) => ({
                id: e.id,
                titulo: e.titulo,
                descricao: e.descricao,
                dataPrazo: e.dataPrazo,
                status: e.status,
                prioridade: e.prioridade,
                dataConclusao: e.dataConclusao,
                observacoes: e.observacoes,
                estudante: {
                    id: e.estudante.id,
                    nome: e.estudante.nome,
                },
                atribuidoPara: {
                    id: e.atribuidoUsuario.id,
                    nome: e.atribuidoUsuario.nome,
                },
                criadoPor: {
                    id: e.criadoUsuario.id,
                    nome: e.criadoUsuario.nome,
                },
            })) : [];
        }
        catch (error) {
            this.handlePrismaError(error, 'Encaminhamento');
        }
    }
    async atualizarResumo(reuniaoId, resumo) {
        try {
            const reuniao = await this.unitOfWork.withTransaction(async (prisma) => {
                return await prisma.reuniao.update({
                    where: { id: reuniaoId },
                    data: { resumo },
                    include: this.getReuniaoIncludes(),
                });
            });
            return this.mapToReuniao(reuniao);
        }
        catch (error) {
            this.handlePrismaError(error, 'Reunião');
        }
    }
    async atualizarStatus(reuniaoId, status) {
        try {
            const statusEnum = status;
            const reuniao = await this.unitOfWork.withTransaction(async (prisma) => {
                return await prisma.reuniao.update({
                    where: { id: reuniaoId },
                    data: { status: statusEnum },
                    include: this.getReuniaoIncludes(),
                });
            });
            return this.mapToReuniao(reuniao);
        }
        catch (error) {
            this.handlePrismaError(error, 'Reunião');
        }
    }
    getReuniaoIncludes() {
        return {
            equipe: true,
            participantes: {
                include: {
                    usuario: true,
                },
            },
            encaminhamentos: {
                include: {
                    estudante: true,
                    atribuidoUsuario: true,
                    criadoUsuario: true,
                },
            },
        };
    }
    mapToReuniao(reuniaoPrisma) {
        return reuniao_entity_1.Reuniao.restaurar({
            id: reuniaoPrisma.id,
            titulo: reuniaoPrisma.titulo,
            data: reuniaoPrisma.data,
            local: reuniaoPrisma.local,
            status: reuniaoPrisma.status,
            observacoes: reuniaoPrisma.observacoes,
            resumo: reuniaoPrisma.resumo,
            criadoEm: reuniaoPrisma.criadoEm,
            atualizadoEm: reuniaoPrisma.atualizadoEm,
            equipeId: reuniaoPrisma.equipeId,
            equipe: reuniaoPrisma.equipe ? {
                id: reuniaoPrisma.equipe.id,
                nome: reuniaoPrisma.equipe.nome,
            } : undefined,
            participantes: reuniaoPrisma.participantes ? reuniaoPrisma.participantes.map((p) => ({
                id: p.id,
                presente: p.presente,
                cargo: p.cargo,
                usuario: {
                    id: p.usuario.id,
                    nome: p.usuario.nome,
                    email: p.usuario.email,
                    cargo: p.usuario.cargo,
                },
            })) : [],
            encaminhamentos: reuniaoPrisma.encaminhamentos ? reuniaoPrisma.encaminhamentos.map((e) => ({
                id: e.id,
                titulo: e.titulo,
                descricao: e.descricao,
                dataPrazo: e.dataPrazo,
                status: e.status,
                prioridade: e.prioridade,
                dataConclusao: e.dataConclusao,
                observacoes: e.observacoes,
                estudante: e.estudante ? {
                    id: e.estudante.id,
                    nome: e.estudante.nome,
                } : null,
                atribuidoPara: e.atribuidoUsuario ? {
                    id: e.atribuidoUsuario.id,
                    nome: e.atribuidoUsuario.nome,
                } : null,
                criadoPor: e.criadoUsuario ? {
                    id: e.criadoUsuario.id,
                    nome: e.criadoUsuario.nome,
                } : null,
            })) : [],
        });
    }
}
exports.ReuniaoRepository = ReuniaoRepository;
//# sourceMappingURL=reuniao.repository.js.map