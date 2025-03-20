"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstudanteFacade = void 0;
const unit_of_work_1 = require("@infrastructure/database/unit-of-work");
const estudante_entity_1 = require("@domain/entities/estudante.entity");
const dificuldade_aprendizagem_entity_1 = require("@domain/entities/dificuldade-aprendizagem.entity");
const app_error_1 = require("@shared/errors/app-error");
class EstudanteFacade {
    estudanteRepository;
    dificuldadeRepository;
    intervencaoRepository;
    unitOfWork;
    constructor(estudanteRepository, dificuldadeRepository, intervencaoRepository) {
        this.estudanteRepository = estudanteRepository;
        this.dificuldadeRepository = dificuldadeRepository;
        this.intervencaoRepository = intervencaoRepository;
        this.unitOfWork = new unit_of_work_1.UnitOfWork();
    }
    async transferirEstudante(estudanteId, novaSerie, novoResponsavelId) {
        return await this.unitOfWork.withTransaction(async (prisma) => {
            const estudante = await prisma.estudante.findUnique({
                where: { id: estudanteId },
                include: { usuario: true },
            });
            if (!estudante) {
                throw new app_error_1.AppError('Estudante não encontrado', 404, 'STUDENT_NOT_FOUND');
            }
            const novoResponsavel = await prisma.usuario.findUnique({
                where: { id: novoResponsavelId },
            });
            if (!novoResponsavel) {
                throw new app_error_1.AppError('Novo responsável não encontrado', 404, 'USER_NOT_FOUND');
            }
            const estudanteAtualizado = await prisma.estudante.update({
                where: { id: estudanteId },
                data: {
                    serie: novaSerie,
                    usuarioId: novoResponsavelId,
                },
                include: {
                    dificuldades: {
                        include: {
                            dificuldade: true,
                        },
                    },
                    avaliacoes: true,
                },
            });
            const dificuldades = estudanteAtualizado.dificuldades.map((d) => {
                const tipo = d.dificuldade.categoria === 'LEITURA'
                    ? dificuldade_aprendizagem_entity_1.TipoDificuldade.LEITURA
                    : d.dificuldade.categoria === 'ESCRITA'
                        ? dificuldade_aprendizagem_entity_1.TipoDificuldade.ESCRITA
                        : d.dificuldade.categoria === 'MATEMATICA'
                            ? dificuldade_aprendizagem_entity_1.TipoDificuldade.MATEMATICA
                            : dificuldade_aprendizagem_entity_1.TipoDificuldade.OUTRO;
                const categoria = d.dificuldade.categoria;
                return dificuldade_aprendizagem_entity_1.DificuldadeAprendizagem.restaurar({
                    ...d.dificuldade,
                    tipo,
                    categoria,
                    sintomas: d.dificuldade.sintomas || '',
                });
            });
            return estudante_entity_1.Estudante.restaurar({
                ...estudanteAtualizado,
                dificuldades,
            });
        });
    }
    async criarPerfilCompleto(dadosEstudante, dificuldadeIds, avaliacaoInicial) {
        return await this.unitOfWork.withTransaction(async () => {
            const estudanteEntity = await this.estudanteRepository.create(dadosEstudante);
            const dificuldadesEncontradas = [];
            for (const dificuldadeId of dificuldadeIds) {
                const dificuldade = await this.dificuldadeRepository.findById(dificuldadeId);
                if (!dificuldade) {
                    throw new app_error_1.AppError(`Dificuldade ${dificuldadeId} não encontrada`, 404, 'DIFFICULTY_NOT_FOUND');
                }
                const tipoRelacao = dificuldadesEncontradas.length === 0 ? 'PRIMARIA' : 'SECUNDARIA';
                await this.estudanteRepository.adicionarDificuldade(estudanteEntity.id, dificuldadeId, {
                    tipo: tipoRelacao,
                    observacoes: `Adicionado durante a criação do perfil (${tipoRelacao})`,
                });
                dificuldadesEncontradas.push(dificuldade);
            }
            if (avaliacaoInicial) {
                await this.estudanteRepository.adicionarAvaliacao(estudanteEntity.id, {
                    ...avaliacaoInicial,
                    data: avaliacaoInicial.data || new Date(),
                    avaliadorId: avaliacaoInicial.avaliadorId,
                });
            }
            const intervencoes = await this.intervencaoRepository.findCatalogoByDificuldade(dificuldadeIds[0]);
            const estudante = await this.estudanteRepository.findById(estudanteEntity.id);
            return {
                estudante,
                dificuldades: dificuldadesEncontradas,
                intervencoes,
            };
        });
    }
    async obterPerfilCompleto(estudanteId) {
        const estudante = await this.estudanteRepository.findById(estudanteId);
        if (!estudante) {
            throw new app_error_1.AppError('Estudante não encontrado', 404, 'STUDENT_NOT_FOUND');
        }
        const dificuldades = await this.dificuldadeRepository.findByEstudanteId(estudanteId);
        const intervencoes = await this.intervencaoRepository.findByEstudanteId(estudanteId);
        const intervencoesAtivas = intervencoes.filter((i) => i.estaAtiva());
        const progressoMedio = intervencoesAtivas.length > 0
            ? intervencoesAtivas.reduce((acc, i) => acc + i.progresso, 0) / intervencoesAtivas.length
            : 0;
        const avaliacoesOrdenadas = [...estudante.avaliacoes].sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
        const historicoAvaliacoes = avaliacoesOrdenadas.map((av, index, array) => {
            const pontuacaoAnterior = index > 0 ? array[index - 1].pontuacao : null;
            const diferenca = pontuacaoAnterior !== null ? av.pontuacao - pontuacaoAnterior : null;
            return {
                ...av,
                diferenca,
                tendencia: diferenca === null
                    ? 'INICIAL'
                    : diferenca > 0
                        ? 'MELHORA'
                        : diferenca < 0
                            ? 'PIORA'
                            : 'ESTAVEL',
            };
        });
        return {
            estudante,
            dificuldades,
            intervencoes,
            historicoAvaliacoes,
            progressoMedio,
        };
    }
}
exports.EstudanteFacade = EstudanteFacade;
//# sourceMappingURL=estudante.facade.js.map