"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecomendarIntervencoesUseCase = void 0;
const app_error_1 = require("@shared/errors/app-error");
class RecomendarIntervencoesUseCase {
    estudanteRepository;
    dificuldadeRepository;
    intervencaoRepository;
    constructor(estudanteRepository, dificuldadeRepository, intervencaoRepository) {
        this.estudanteRepository = estudanteRepository;
        this.dificuldadeRepository = dificuldadeRepository;
        this.intervencaoRepository = intervencaoRepository;
    }
    async execute(data) {
        const estudante = await this.estudanteRepository.findById(data.estudanteId);
        if (!estudante) {
            throw new app_error_1.AppError('Estudante não encontrado', 404, 'STUDENT_NOT_FOUND');
        }
        const dificuldades = await this.dificuldadeRepository.findByEstudanteId(data.estudanteId);
        if (dificuldades.length === 0) {
            throw new app_error_1.AppError('Estudante não possui dificuldades cadastradas para recomendação', 400, 'NO_DIFFICULTIES_FOUND');
        }
        const intervencoesAplicadas = await this.intervencaoRepository.findByEstudanteId(data.estudanteId);
        const idsIntervencoesAplicadas = intervencoesAplicadas.map(i => i.intervencaoBaseId).filter(Boolean);
        const recomendacoesSet = new Set();
        for (const dificuldade of dificuldades) {
            const intervencoesPorDificuldade = await this.intervencaoRepository.findCatalogoByDificuldade(dificuldade.id);
            for (const intervencao of intervencoesPorDificuldade) {
                if (!idsIntervencoesAplicadas.includes(intervencao.id) && intervencao.estaAtiva()) {
                    recomendacoesSet.add(intervencao);
                }
            }
        }
        if (recomendacoesSet.size === 0) {
            const tiposDificuldade = [...new Set(dificuldades.map(d => d.tipo))];
            const todasIntervencoes = await this.intervencaoRepository.findAllCatalogo();
            for (const intervencao of todasIntervencoes) {
                if (!idsIntervencoesAplicadas.includes(intervencao.id) &&
                    intervencao.estaAtiva() &&
                    this.intervencaoAtendeTiposDificuldade(intervencao, tiposDificuldade)) {
                    recomendacoesSet.add(intervencao);
                }
            }
        }
        const recomendacoes = Array.from(recomendacoesSet);
        const temDificuldadeGrave = estudante.possuiDificuldadeGrave();
        if (temDificuldadeGrave) {
            recomendacoes.sort((a, b) => {
                if (a.tipo === 'MULTIDISCIPLINAR' && b.tipo !== 'MULTIDISCIPLINAR')
                    return -1;
                if (a.tipo !== 'MULTIDISCIPLINAR' && b.tipo === 'MULTIDISCIPLINAR')
                    return 1;
                return 0;
            });
        }
        return { intervencoes: recomendacoes };
    }
    intervencaoAtendeTiposDificuldade(intervencao, tiposDificuldade) {
        if (!intervencao.dificuldadesAlvo || intervencao.dificuldadesAlvo.length === 0) {
            return true;
        }
        return tiposDificuldade.some(tipo => intervencao.dificuldadesAlvo.includes(tipo));
    }
}
exports.RecomendarIntervencoesUseCase = RecomendarIntervencoesUseCase;
//# sourceMappingURL=recomendar-intervencoes.use-case.js.map