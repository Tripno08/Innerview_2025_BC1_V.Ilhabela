"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Intervencao = exports.CatalogoIntervencao = exports.IntervencaoBase = exports.TipoIntervencao = void 0;
const enums_1 = require("@shared/enums");
var TipoIntervencao;
(function (TipoIntervencao) {
    TipoIntervencao["PEDAGOGICA"] = "PEDAGOGICA";
    TipoIntervencao["COMPORTAMENTAL"] = "COMPORTAMENTAL";
    TipoIntervencao["PSICOLOGICA"] = "PSICOLOGICA";
    TipoIntervencao["SOCIAL"] = "SOCIAL";
    TipoIntervencao["MULTIDISCIPLINAR"] = "MULTIDISCIPLINAR";
    TipoIntervencao["OUTRA"] = "OUTRA";
})(TipoIntervencao || (exports.TipoIntervencao = TipoIntervencao = {}));
class IntervencaoBase {
    id;
    titulo;
    descricao;
    tipo;
    status;
    criadoEm;
    atualizadoEm;
    constructor(props) {
        this.id = props.id;
        this.titulo = props.titulo;
        this.descricao = props.descricao;
        this.tipo = props.tipo;
        this.status = props.status || enums_1.Status.ATIVO;
        this.criadoEm = props.criadoEm || new Date();
        this.atualizadoEm = props.atualizadoEm || new Date();
        this.validarBase();
    }
    validarBase() {
        if (!this.titulo || this.titulo.trim().length < 3) {
            throw new Error('Título deve ter pelo menos 3 caracteres');
        }
        if (!this.descricao || this.descricao.trim().length < 10) {
            throw new Error('Descrição deve ter pelo menos 10 caracteres');
        }
        if (!Object.values(TipoIntervencao).includes(this.tipo)) {
            throw new Error('Tipo de intervenção inválido');
        }
    }
    estaAtiva() {
        return this.status === enums_1.Status.ATIVO;
    }
}
exports.IntervencaoBase = IntervencaoBase;
class CatalogoIntervencao extends IntervencaoBase {
    duracao;
    dificuldadesAlvo;
    publico;
    recursos;
    constructor(props) {
        super(props);
        this.duracao = props.duracao;
        this.dificuldadesAlvo = props.dificuldadesAlvo || [];
        this.publico = props.publico || [];
        this.recursos = props.recursos || [];
        this.validar();
    }
    validar() {
        if (this.duracao !== undefined && this.duracao <= 0) {
            throw new Error('Duração deve ser um número positivo');
        }
    }
    static criar(props) {
        return new CatalogoIntervencao(props);
    }
    static restaurar(dados) {
        return new CatalogoIntervencao({
            ...dados,
        });
    }
    atualizar(dados) {
        return new CatalogoIntervencao({
            id: this.id,
            titulo: dados.titulo || this.titulo,
            descricao: dados.descricao || this.descricao,
            tipo: dados.tipo || this.tipo,
            status: dados.status || this.status,
            duracao: dados.duracao ?? this.duracao,
            dificuldadesAlvo: dados.dificuldadesAlvo || this.dificuldadesAlvo,
            publico: dados.publico || this.publico,
            recursos: dados.recursos || this.recursos,
            criadoEm: this.criadoEm,
            atualizadoEm: new Date(),
        });
    }
    criarInstancia(estudanteId, dataInicio, dataFim) {
        return Intervencao.criar({
            titulo: this.titulo,
            descricao: this.descricao,
            tipo: this.tipo,
            dataInicio,
            dataFim,
            estudanteId,
            intervencaoBaseId: this.id,
            observacoes: `Intervenção baseada no modelo: ${this.titulo}`,
        });
    }
    inativar() {
        return new CatalogoIntervencao({
            ...this,
            status: enums_1.Status.CANCELADO,
            atualizadoEm: new Date(),
        });
    }
}
exports.CatalogoIntervencao = CatalogoIntervencao;
class Intervencao extends IntervencaoBase {
    dataInicio;
    dataFim;
    estudanteId;
    intervencaoBaseId;
    observacoes;
    progresso;
    constructor(props) {
        super(props);
        this.dataInicio = props.dataInicio;
        this.dataFim = props.dataFim;
        this.estudanteId = props.estudanteId;
        this.intervencaoBaseId = props.intervencaoBaseId;
        this.observacoes = props.observacoes;
        this.progresso = props.progresso || 0;
        this.validar();
    }
    validar() {
        if (this.dataInicio > new Date()) {
            throw new Error('Data de início não pode ser futura');
        }
        if (this.dataFim && this.dataFim < this.dataInicio) {
            throw new Error('Data de fim não pode ser anterior à data de início');
        }
        if (this.progresso < 0 || this.progresso > 100) {
            throw new Error('Progresso deve estar entre 0 e 100%');
        }
    }
    static criar(props) {
        return new Intervencao(props);
    }
    static restaurar(dados) {
        return new Intervencao({
            ...dados,
        });
    }
    atualizar(dados) {
        return new Intervencao({
            id: this.id,
            titulo: dados.titulo || this.titulo,
            descricao: dados.descricao || this.descricao,
            tipo: dados.tipo || this.tipo,
            status: dados.status || this.status,
            dataInicio: dados.dataInicio || this.dataInicio,
            dataFim: dados.dataFim ?? this.dataFim,
            estudanteId: this.estudanteId,
            intervencaoBaseId: dados.intervencaoBaseId ?? this.intervencaoBaseId,
            observacoes: dados.observacoes ?? this.observacoes,
            progresso: dados.progresso ?? this.progresso,
            criadoEm: this.criadoEm,
            atualizadoEm: new Date(),
        });
    }
    atualizarProgresso(novoProgresso) {
        if (novoProgresso < 0 || novoProgresso > 100) {
            throw new Error('Progresso deve estar entre 0 e 100%');
        }
        return this.atualizar({ progresso: novoProgresso });
    }
    concluir() {
        return new Intervencao({
            ...this,
            dataFim: this.dataFim || new Date(),
            status: enums_1.Status.CONCLUIDO,
            progresso: 100,
            atualizadoEm: new Date(),
        });
    }
    cancelar() {
        return new Intervencao({
            ...this,
            dataFim: this.dataFim || new Date(),
            status: enums_1.Status.CANCELADO,
            atualizadoEm: new Date(),
        });
    }
    estaConcluida() {
        return this.status === enums_1.Status.CONCLUIDO;
    }
    estaEmAndamento() {
        return this.status === enums_1.Status.ATIVO && !this.dataFim;
    }
    calcularDuracao() {
        const fim = this.dataFim || new Date();
        const inicio = this.dataInicio;
        const diferencaMs = fim.getTime() - inicio.getTime();
        const dias = Math.ceil(diferencaMs / (1000 * 60 * 60 * 24));
        return dias;
    }
}
exports.Intervencao = Intervencao;
//# sourceMappingURL=intervencao.entity.js.map