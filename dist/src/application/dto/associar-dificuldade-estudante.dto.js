"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstudanteDificuldade = void 0;
class EstudanteDificuldade {
    id;
    estudanteId;
    dificuldadeId;
    dataIdentificacao;
    observacoes;
    criadoEm;
    estudante;
    dificuldade;
    static fromEntities(estudanteId, dificuldadeId, dataIdentificacao, observacoes, estudante, dificuldade) {
        const dto = new EstudanteDificuldade();
        dto.estudanteId = estudanteId;
        dto.dificuldadeId = dificuldadeId;
        dto.dataIdentificacao = dataIdentificacao;
        dto.observacoes = observacoes;
        dto.criadoEm = new Date();
        if (estudante) {
            dto.estudante = {
                id: estudante.id,
                nome: estudante.nome,
            };
        }
        if (dificuldade) {
            dto.dificuldade = {
                id: dificuldade.id,
                nome: dificuldade.nome,
                tipo: dificuldade.tipo,
                categoria: dificuldade.categoria,
            };
        }
        return dto;
    }
}
exports.EstudanteDificuldade = EstudanteDificuldade;
//# sourceMappingURL=associar-dificuldade-estudante.dto.js.map