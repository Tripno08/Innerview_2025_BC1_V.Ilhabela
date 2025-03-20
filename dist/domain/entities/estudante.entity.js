"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Estudante = exports.Avaliacao = void 0;
const client_1 = require("@prisma/client");
class Avaliacao {
    id;
    data;
    tipo;
    pontuacao;
    observacoes;
    criadoEm;
    atualizadoEm;
    constructor(props) {
        this.id = props.id;
        this.data = props.data;
        this.tipo = props.tipo;
        this.pontuacao = props.pontuacao;
        this.observacoes = props.observacoes;
        this.criadoEm = props.criadoEm || new Date();
        this.atualizadoEm = props.atualizadoEm || new Date();
        this.validar();
    }
    validar() {
        if (!this.tipo || this.tipo.trim().length < 2) {
            throw new Error('Tipo de avaliação inválido');
        }
        if (this.pontuacao < 0 || this.pontuacao > 10) {
            throw new Error('Pontuação deve estar entre 0 e 10');
        }
        if (this.data > new Date()) {
            throw new Error('Data da avaliação não pode ser futura');
        }
    }
    static criar(props) {
        return new Avaliacao(props);
    }
}
exports.Avaliacao = Avaliacao;
class Estudante {
    id;
    nome;
    serie;
    dataNascimento;
    status;
    usuarioId;
    dificuldades;
    avaliacoes;
    criadoEm;
    atualizadoEm;
    constructor(props) {
        this.id = props.id;
        this.nome = props.nome;
        this.serie = props.serie;
        this.dataNascimento = props.dataNascimento;
        this.status = props.status || client_1.Status.ATIVO;
        this.usuarioId = props.usuarioId;
        this.dificuldades = props.dificuldades || [];
        this.avaliacoes = (props.avaliacoes || []).map(av => av instanceof Avaliacao ? av : new Avaliacao(av));
        this.criadoEm = props.criadoEm || new Date();
        this.atualizadoEm = props.atualizadoEm || new Date();
        this.validar();
    }
    validar() {
        if (!this.nome || this.nome.trim().length < 3) {
            throw new Error('Nome deve ter pelo menos 3 caracteres');
        }
        if (!this.serie || this.serie.trim().length < 1) {
            throw new Error('Série é obrigatória');
        }
        const hoje = new Date();
        const idadeMinima = new Date();
        idadeMinima.setFullYear(hoje.getFullYear() - 100);
        if (this.dataNascimento > hoje) {
            throw new Error('Data de nascimento não pode ser futura');
        }
        if (this.dataNascimento < idadeMinima) {
            throw new Error('Data de nascimento muito antiga');
        }
    }
    static criar(props) {
        return new Estudante(props);
    }
    static restaurar(dados) {
        return new Estudante({
            ...dados,
        });
    }
    adicionarDificuldade(dificuldade) {
        if (this.dificuldades.some(d => d.id === dificuldade.id)) {
            return this;
        }
        return new Estudante({
            ...this,
            dificuldades: [...this.dificuldades, dificuldade],
            atualizadoEm: new Date(),
        });
    }
    removerDificuldade(dificuldadeId) {
        return new Estudante({
            ...this,
            dificuldades: this.dificuldades.filter(d => d.id !== dificuldadeId),
            atualizadoEm: new Date(),
        });
    }
    adicionarAvaliacao(avaliacao) {
        const novaAvaliacao = new Avaliacao(avaliacao);
        return new Estudante({
            ...this,
            avaliacoes: [...this.avaliacoes, novaAvaliacao],
            atualizadoEm: new Date(),
        });
    }
    atualizar(dados) {
        return new Estudante({
            ...this,
            nome: dados.nome || this.nome,
            serie: dados.serie || this.serie,
            dataNascimento: dados.dataNascimento || this.dataNascimento,
            status: dados.status || this.status,
            usuarioId: dados.usuarioId || this.usuarioId,
            atualizadoEm: new Date(),
        });
    }
    possuiDificuldadeGrave() {
        return this.dificuldades.some(d => d.ehGrave());
    }
    calcularMediaAvaliacoes() {
        if (this.avaliacoes.length === 0) {
            return 0;
        }
        const soma = this.avaliacoes.reduce((acc, av) => acc + av.pontuacao, 0);
        return soma / this.avaliacoes.length;
    }
    inativar() {
        return new Estudante({
            ...this,
            status: client_1.Status.CANCELADO,
            atualizadoEm: new Date(),
        });
    }
    estaAtivo() {
        return this.status === client_1.Status.ATIVO;
    }
    calcularIdade() {
        const hoje = new Date();
        let idade = hoje.getFullYear() - this.dataNascimento.getFullYear();
        const mesAtual = hoje.getMonth();
        const diaAtual = hoje.getDate();
        const mesNascimento = this.dataNascimento.getMonth();
        const diaNascimento = this.dataNascimento.getDate();
        if (mesAtual < mesNascimento || (mesAtual === mesNascimento && diaAtual < diaNascimento)) {
            idade--;
        }
        return idade;
    }
}
exports.Estudante = Estudante;
//# sourceMappingURL=estudante.entity.js.map