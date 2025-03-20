"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReuniaoRepository = void 0;
const base_repository_1 = require("./base.repository");
const app_error_1 = require("@shared/errors/app-error");
const enums_1 = require("@shared/enums");
const enum_mappers_1 = require("@shared/utils/enum-mappers");
class ReuniaoRepository extends base_repository_1.BaseRepository {
    async findAll() {
        try {
            const reunioes = await this.unitOfWork.withoutTransaction((prisma) => prisma.reuniao.findMany({
                include: this.getReuniaoIncludes(),
                orderBy: {
                    data: 'desc',
                },
            }));
            return reunioes.map((r) => this.mapToReuniao(r));
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
            return reunioes.map((r) => this.mapToReuniao(r));
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
            return reunioes.map((r) => this.mapToReuniao(r));
        }
        catch (error) {
            this.handlePrismaError(error, 'Reunião');
        }
    }
    async findByStatus(status) {
        try {
            const reunioes = await this.unitOfWork.withoutTransaction((prisma) => prisma.reuniao.findMany({
                where: {
                    status: (0, enum_mappers_1.mapLocalStatusToPrisma)(status),
                },
                include: this.getReuniaoIncludes(),
                orderBy: {
                    data: 'desc',
                },
            }));
            return reunioes.map((r) => this.mapToReuniao(r));
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
                return await prisma.reuniao.create({
                    data: {
                        titulo: data.titulo,
                        equipeId: data.equipeId,
                        data: data.data,
                        local: data.local,
                        status: (0, enum_mappers_1.mapLocalStatusToPrisma)(data.status || enums_1.Status.AGENDADO),
                        resumo: data.resumo || '',
                        pauta: data.pauta || '',
                        observacoes: data.observacoes || '',
                    },
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
                    data: {
                        titulo: data.titulo,
                        data: data.data,
                        local: data.local,
                        resumo: data.resumo,
                        pauta: data.pauta,
                        observacoes: data.observacoes,
                        status: data.status ? (0, enum_mappers_1.mapLocalStatusToPrisma)(data.status) : undefined,
                    },
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
                    where: {
                        reuniaoId: id,
                    },
                });
                await prisma.encaminhamento.deleteMany({
                    where: {
                        reuniaoId: id,
                    },
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
                    throw new app_error_1.AppError('Reunião não encontrada', 404, 'REUNIAO_NOT_FOUND');
                }
                const participanteExistente = await prisma.participanteReuniao.findFirst({
                    where: {
                        reuniaoId,
                        usuarioId,
                    },
                });
                if (participanteExistente) {
                    throw new app_error_1.AppError('Usuário já é participante desta reunião', 409, 'PARTICIPANTE_ALREADY_EXISTS');
                }
                await prisma.participanteReuniao.create({
                    data: {
                        reuniaoId,
                        usuarioId,
                        cargo: cargo || 'MEMBRO',
                        presente: false,
                        confirmado: false,
                    },
                });
            });
        }
        catch (error) {
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
                    throw new app_error_1.AppError('Participante não encontrado nesta reunião', 404, 'PARTICIPANTE_NOT_FOUND');
                }
                await prisma.participanteReuniao.delete({
                    where: {
                        id: participante.id,
                    },
                });
            });
        }
        catch (error) {
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
                    throw new app_error_1.AppError('Participante não encontrado nesta reunião', 404, 'PARTICIPANTE_NOT_FOUND');
                }
                const reuniao = await prisma.reuniao.findUnique({
                    where: { id: reuniaoId },
                });
                if (reuniao && (0, enum_mappers_1.mapPrismaStatusToLocal)(reuniao.status) === enums_1.Status.CONCLUIDO) {
                    throw new app_error_1.AppError('Não é possível alterar presenças em reuniões concluídas', 400, 'REUNIAO_ALREADY_CONCLUDED');
                }
                await prisma.participanteReuniao.update({
                    where: {
                        id: participante.id,
                    },
                    data: {
                        presente,
                        confirmado: true,
                    },
                });
            });
        }
        catch (error) {
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
            }));
            return participantes.map((p) => ({
                id: p.id,
                usuarioId: p.usuarioId,
                reuniaoId: p.reuniaoId,
                presente: p.presente,
                confirmado: p.confirmado,
                papel: p.cargo,
                usuario: {
                    id: p.usuario.id,
                    nome: p.usuario.nome,
                    email: p.usuario.email,
                    cargo: p.usuario.cargo,
                },
            }));
        }
        catch (error) {
            this.handlePrismaError(error, 'Participante da Reunião');
        }
    }
    async adicionarEncaminhamento(reuniaoId, encaminhamentoData) {
        try {
            if (!encaminhamentoData.descricao) {
                throw new app_error_1.AppError('Descrição do encaminhamento é obrigatória', 400, 'INVALID_INPUT');
            }
            const encaminhamento = await this.unitOfWork.withTransaction(async (prisma) => {
                const reuniao = await prisma.reuniao.findUnique({
                    where: { id: reuniaoId },
                    include: {
                        equipe: {
                            include: {
                                estudantes: {
                                    take: 1,
                                    include: {
                                        estudante: true,
                                    },
                                },
                            },
                        },
                    },
                });
                if (!reuniao) {
                    throw new app_error_1.AppError('Reunião não encontrada', 404, 'REUNIAO_NOT_FOUND');
                }
                let estudanteId = null;
                if (reuniao.equipe?.estudantes?.length > 0) {
                    estudanteId = reuniao.equipe.estudantes[0].estudanteId;
                }
                else {
                    const primeiroEstudante = await prisma.estudante.findFirst({
                        select: { id: true },
                    });
                    if (primeiroEstudante) {
                        estudanteId = primeiroEstudante.id;
                    }
                    else {
                        throw new app_error_1.AppError('Não foi possível criar o encaminhamento: nenhum estudante cadastrado no sistema', 400, 'NO_STUDENT_AVAILABLE');
                    }
                }
                let responsavelId = encaminhamentoData.responsavelId;
                if (!responsavelId) {
                    const primeiroUsuario = await prisma.usuario.findFirst({
                        select: { id: true },
                    });
                    if (primeiroUsuario) {
                        responsavelId = primeiroUsuario.id;
                    }
                    else {
                        throw new app_error_1.AppError('Não foi possível criar o encaminhamento: nenhum usuário cadastrado no sistema', 400, 'NO_USER_AVAILABLE');
                    }
                }
                const prioridade = encaminhamentoData.prioridade
                    ? encaminhamentoData.prioridade
                    : enums_1.Prioridade.MEDIA;
                const status = encaminhamentoData.status
                    ? encaminhamentoData.status
                    : enums_1.Status.PENDENTE;
                return await prisma.encaminhamento.create({
                    data: {
                        titulo: `Encaminhamento de Reunião ${reuniao.titulo}`,
                        descricao: encaminhamentoData.descricao,
                        reuniaoId: reuniaoId,
                        prioridade: prioridade,
                        status: (0, enum_mappers_1.mapLocalStatusToPrisma)(status),
                        dataPrazo: encaminhamentoData.prazo,
                        atribuidoPara: responsavelId,
                        criadoPor: responsavelId,
                        estudanteId: estudanteId,
                    },
                    include: {
                        atribuidoUsuario: true,
                        criadoUsuario: true,
                    },
                });
            });
            return {
                id: encaminhamento.id,
                reuniaoId: encaminhamento.reuniaoId,
                descricao: encaminhamento.descricao,
                responsavelId: encaminhamento.atribuidoPara,
                prazo: encaminhamento.dataPrazo || undefined,
                status: (0, enum_mappers_1.mapPrismaStatusToLocal)(encaminhamento.status),
                prioridade: encaminhamento.prioridade,
                observacoes: encaminhamento.observacoes || undefined,
            };
        }
        catch (error) {
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
                    atribuidoUsuario: true,
                    criadoUsuario: true,
                },
            }));
            return encaminhamentos.map((e) => ({
                id: e.id,
                reuniaoId: e.reuniaoId,
                descricao: e.descricao,
                responsavelId: e.atribuidoPara,
                prazo: e.dataPrazo || undefined,
                status: (0, enum_mappers_1.mapPrismaStatusToLocal)(e.status),
                prioridade: e.prioridade,
                observacoes: e.observacoes || undefined,
            }));
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
            const reuniao = await this.unitOfWork.withTransaction(async (prisma) => {
                return await prisma.reuniao.update({
                    where: { id: reuniaoId },
                    data: { status: (0, enum_mappers_1.mapLocalStatusToPrisma)(status) },
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
            participantes: {
                include: {
                    usuario: true,
                },
            },
            encaminhamentos: true,
            equipe: true,
        };
    }
    mapToReuniao(reuniaoPrisma) {
        return {
            id: reuniaoPrisma.id,
            titulo: reuniaoPrisma.titulo,
            data: reuniaoPrisma.data,
            local: reuniaoPrisma.local,
            pauta: reuniaoPrisma.pauta,
            equipeId: reuniaoPrisma.equipeId,
            resumo: reuniaoPrisma.resumo,
            observacoes: reuniaoPrisma.observacoes,
            status: (0, enum_mappers_1.mapPrismaStatusToLocal)(reuniaoPrisma.status),
            criadoEm: reuniaoPrisma.criadoEm,
            atualizadoEm: reuniaoPrisma.atualizadoEm,
            participantes: reuniaoPrisma.participantes?.map((p) => ({
                id: p.id,
                usuarioId: p.usuarioId,
                reuniaoId: p.reuniaoId,
                presente: p.presente,
                confirmado: p.confirmado,
                papel: p.cargo,
                usuario: p.usuario,
            })) || [],
            encaminhamentos: reuniaoPrisma.encaminhamentos?.map((e) => ({
                id: e.id,
                reuniaoId: e.reuniaoId,
                descricao: e.descricao,
                responsavelId: e.atribuidoPara,
                prazo: e.dataPrazo,
                status: (0, enum_mappers_1.mapPrismaStatusToLocal)(e.status),
                prioridade: e.prioridade,
                observacoes: e.observacoes,
            })) || [],
        };
    }
}
exports.ReuniaoRepository = ReuniaoRepository;
//# sourceMappingURL=reuniao.repository.js.map