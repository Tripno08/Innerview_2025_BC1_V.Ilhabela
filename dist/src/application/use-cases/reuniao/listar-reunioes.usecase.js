"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListarReunioesPorStatusUseCase = exports.ListarReunioesPorPeriodoUseCase = exports.ListarReunioesPorEquipeUseCase = exports.ListarReunioesUseCase = void 0;
class ListarReunioesUseCase {
    reuniaoRepository;
    constructor(reuniaoRepository) {
        this.reuniaoRepository = reuniaoRepository;
    }
    async execute() {
        return await this.reuniaoRepository.findAll();
    }
}
exports.ListarReunioesUseCase = ListarReunioesUseCase;
class ListarReunioesPorEquipeUseCase {
    reuniaoRepository;
    constructor(reuniaoRepository) {
        this.reuniaoRepository = reuniaoRepository;
    }
    async execute(equipeId) {
        return await this.reuniaoRepository.findByEquipe(equipeId);
    }
}
exports.ListarReunioesPorEquipeUseCase = ListarReunioesPorEquipeUseCase;
class ListarReunioesPorPeriodoUseCase {
    reuniaoRepository;
    constructor(reuniaoRepository) {
        this.reuniaoRepository = reuniaoRepository;
    }
    async execute(dataInicio, dataFim) {
        return await this.reuniaoRepository.findByData(dataInicio, dataFim);
    }
}
exports.ListarReunioesPorPeriodoUseCase = ListarReunioesPorPeriodoUseCase;
class ListarReunioesPorStatusUseCase {
    reuniaoRepository;
    constructor(reuniaoRepository) {
        this.reuniaoRepository = reuniaoRepository;
    }
    async execute(status) {
        return await this.reuniaoRepository.findByStatus(status);
    }
}
exports.ListarReunioesPorStatusUseCase = ListarReunioesPorStatusUseCase;
//# sourceMappingURL=listar-reunioes.usecase.js.map