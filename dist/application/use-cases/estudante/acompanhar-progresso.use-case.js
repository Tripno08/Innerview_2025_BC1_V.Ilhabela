"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcompanharProgressoUseCase = void 0;
const app_error_1 = require("@shared/errors/app-error");
class AcompanharProgressoUseCase {
    estudanteRepository;
    intervencaoRepository;
    constructor(estudanteRepository, intervencaoRepository) {
        this.estudanteRepository = estudanteRepository;
        this.intervencaoRepository = intervencaoRepository;
    }
    async execute(data) {
        const estudante = await this.estudanteRepository.findById(data.estudanteId);
        if (!estudante) {
            throw new app_error_1.AppError('Estudante não encontrado', 404, 'STUDENT_NOT_FOUND');
        }
        const intervencoes = await this.intervencaoRepository.findByEstudanteId(data.estudanteId);
        if (intervencoes.length === 0) {
            throw new app_error_1.AppError('Estudante não possui intervenções cadastradas para acompanhamento', 400, 'NO_INTERVENTIONS_FOUND');
        }
        const statusIntervencoes = {
            ativas: intervencoes.filter(i => i.estaEmAndamento()).length,
            concluidas: intervencoes.filter(i => i.estaConcluida()).length,
            canceladas: intervencoes.filter(i => !i.estaAtiva()).length,
        };
        const intervencoesRelevantes = intervencoes.filter(i => i.estaEmAndamento() || i.estaConcluida());
        const progressoGeral = intervencoesRelevantes.length > 0
            ? intervencoesRelevantes.reduce((acc, i) => acc + i.progresso, 0) / intervencoesRelevantes.length
            : 0;
        const avaliacoes = [...estudante.avaliacoes].sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
        const mediaAvaliacoes = estudante.calcularMediaAvaliacoes();
        let tendencia = 'ESTAVEL';
        if (avaliacoes.length >= 2) {
            const metade = Math.floor(avaliacoes.length / 2);
            const primeiraMetade = avaliacoes.slice(0, metade);
            const segundaMetade = avaliacoes.slice(metade);
            const mediaPrimeira = primeiraMetade.reduce((acc, av) => acc + av.pontuacao, 0) / primeiraMetade.length;
            const mediaSegunda = segundaMetade.reduce((acc, av) => acc + av.pontuacao, 0) / segundaMetade.length;
            const diferenca = mediaSegunda - mediaPrimeira;
            if (diferenca > 0.5) {
                tendencia = 'MELHORA';
            }
            else if (diferenca < -0.5) {
                tendencia = 'PIORA';
            }
        }
        return {
            intervencoes,
            avaliacoes,
            progressoGeral,
            statusIntervencoes,
            mediaAvaliacoes,
            tendencia,
        };
    }
}
exports.AcompanharProgressoUseCase = AcompanharProgressoUseCase;
//# sourceMappingURL=acompanhar-progresso.use-case.js.map