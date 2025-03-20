"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusMeta = exports.TipoMeta = exports.FrequenciaAplicacao = exports.AreaIntervencao = exports.NivelIntervencao = exports.TipoIndicador = exports.CategoriaInstrumento = exports.CategoriaDificuldade = exports.Nivel = exports.TipoNotificacao = exports.Prioridade = exports.StatusComunicacao = exports.TipoComunicacao = exports.Plataforma = exports.TipoResponsavel = exports.Turno = exports.Genero = exports.CargoEquipe = exports.CargoUsuario = exports.Status = void 0;
var Status;
(function (Status) {
    Status["PENDENTE"] = "PENDENTE";
    Status["AGENDADO"] = "AGENDADO";
    Status["ATIVO"] = "ATIVO";
    Status["EM_ANDAMENTO"] = "EM_ANDAMENTO";
    Status["CONCLUIDO"] = "CONCLUIDO";
    Status["CANCELADO"] = "CANCELADO";
})(Status || (exports.Status = Status = {}));
var CargoUsuario;
(function (CargoUsuario) {
    CargoUsuario["ADMIN"] = "ADMIN";
    CargoUsuario["PROFESSOR"] = "PROFESSOR";
    CargoUsuario["ESPECIALISTA"] = "ESPECIALISTA";
    CargoUsuario["COORDENADOR"] = "COORDENADOR";
    CargoUsuario["DIRETOR"] = "DIRETOR";
    CargoUsuario["ADMINISTRADOR"] = "ADMINISTRADOR";
})(CargoUsuario || (exports.CargoUsuario = CargoUsuario = {}));
var CargoEquipe;
(function (CargoEquipe) {
    CargoEquipe["COORDENADOR"] = "COORDENADOR";
    CargoEquipe["ESPECIALISTA"] = "ESPECIALISTA";
    CargoEquipe["PROFESSOR"] = "PROFESSOR";
    CargoEquipe["CONSELHEIRO"] = "CONSELHEIRO";
    CargoEquipe["PSICOLOGO"] = "PSICOLOGO";
    CargoEquipe["OUTRO"] = "OUTRO";
})(CargoEquipe || (exports.CargoEquipe = CargoEquipe = {}));
var Genero;
(function (Genero) {
    Genero["M"] = "M";
    Genero["F"] = "F";
    Genero["OUTRO"] = "OUTRO";
})(Genero || (exports.Genero = Genero = {}));
var Turno;
(function (Turno) {
    Turno["MANHA"] = "MANHA";
    Turno["TARDE"] = "TARDE";
    Turno["NOITE"] = "NOITE";
    Turno["INTEGRAL"] = "INTEGRAL";
})(Turno || (exports.Turno = Turno = {}));
var TipoResponsavel;
(function (TipoResponsavel) {
    TipoResponsavel["MAE"] = "MAE";
    TipoResponsavel["PAI"] = "PAI";
    TipoResponsavel["AVOA"] = "AVOA";
    TipoResponsavel["AVO"] = "AVO";
    TipoResponsavel["TIA"] = "TIA";
    TipoResponsavel["TIO"] = "TIO";
    TipoResponsavel["IRMA"] = "IRMA";
    TipoResponsavel["IRMAO"] = "IRMAO";
    TipoResponsavel["TUTOR"] = "TUTOR";
    TipoResponsavel["OUTRO"] = "OUTRO";
})(TipoResponsavel || (exports.TipoResponsavel = TipoResponsavel = {}));
var Plataforma;
(function (Plataforma) {
    Plataforma["GOOGLE_CLASSROOM"] = "GOOGLE_CLASSROOM";
    Plataforma["MICROSOFT_TEAMS"] = "MICROSOFT_TEAMS";
    Plataforma["LTI"] = "LTI";
    Plataforma["PERSONALIZADO"] = "PERSONALIZADO";
})(Plataforma || (exports.Plataforma = Plataforma = {}));
var TipoComunicacao;
(function (TipoComunicacao) {
    TipoComunicacao["EMAIL"] = "EMAIL";
    TipoComunicacao["TELEFONE"] = "TELEFONE";
    TipoComunicacao["PRESENCIAL"] = "PRESENCIAL";
    TipoComunicacao["CARTA"] = "CARTA";
    TipoComunicacao["OUTRO"] = "OUTRO";
})(TipoComunicacao || (exports.TipoComunicacao = TipoComunicacao = {}));
var StatusComunicacao;
(function (StatusComunicacao) {
    StatusComunicacao["RASCUNHO"] = "RASCUNHO";
    StatusComunicacao["ENVIADO"] = "ENVIADO";
    StatusComunicacao["ENTREGUE"] = "ENTREGUE";
    StatusComunicacao["LIDO"] = "LIDO";
    StatusComunicacao["RESPONDIDO"] = "RESPONDIDO";
    StatusComunicacao["FALHA"] = "FALHA";
})(StatusComunicacao || (exports.StatusComunicacao = StatusComunicacao = {}));
var Prioridade;
(function (Prioridade) {
    Prioridade["BAIXA"] = "BAIXA";
    Prioridade["MEDIA"] = "MEDIA";
    Prioridade["ALTA"] = "ALTA";
    Prioridade["URGENTE"] = "URGENTE";
})(Prioridade || (exports.Prioridade = Prioridade = {}));
var TipoNotificacao;
(function (TipoNotificacao) {
    TipoNotificacao["REUNIAO_AGENDADA"] = "REUNIAO_AGENDADA";
    TipoNotificacao["LEMBRETE_REUNIAO"] = "LEMBRETE_REUNIAO";
    TipoNotificacao["ENCAMINHAMENTO_ATRIBUIDO"] = "ENCAMINHAMENTO_ATRIBUIDO";
    TipoNotificacao["PRAZO_PROXIMO"] = "PRAZO_PROXIMO";
    TipoNotificacao["PRAZO_VENCIDO"] = "PRAZO_VENCIDO";
    TipoNotificacao["MENSAGEM_RECEBIDA"] = "MENSAGEM_RECEBIDA";
    TipoNotificacao["ESTUDANTE_ATUALIZADO"] = "ESTUDANTE_ATUALIZADO";
    TipoNotificacao["AVALIACAO_ADICIONADA"] = "AVALIACAO_ADICIONADA";
    TipoNotificacao["INTERVENCAO_ATUALIZADA"] = "INTERVENCAO_ATUALIZADA";
    TipoNotificacao["CONVITE_EQUIPE"] = "CONVITE_EQUIPE";
})(TipoNotificacao || (exports.TipoNotificacao = TipoNotificacao = {}));
var Nivel;
(function (Nivel) {
    Nivel["BAIXO"] = "BAIXO";
    Nivel["MODERADO"] = "MODERADO";
    Nivel["ALTO"] = "ALTO";
    Nivel["MUITO_ALTO"] = "MUITO_ALTO";
})(Nivel || (exports.Nivel = Nivel = {}));
var CategoriaDificuldade;
(function (CategoriaDificuldade) {
    CategoriaDificuldade["LEITURA"] = "LEITURA";
    CategoriaDificuldade["ESCRITA"] = "ESCRITA";
    CategoriaDificuldade["MATEMATICA"] = "MATEMATICA";
    CategoriaDificuldade["ATENCAO"] = "ATENCAO";
    CategoriaDificuldade["COMPORTAMENTO"] = "COMPORTAMENTO";
    CategoriaDificuldade["COMUNICACAO"] = "COMUNICACAO";
    CategoriaDificuldade["COORDENACAO_MOTORA"] = "COORDENACAO_MOTORA";
    CategoriaDificuldade["MEMORIA"] = "MEMORIA";
    CategoriaDificuldade["ORGANIZACAO"] = "ORGANIZACAO";
    CategoriaDificuldade["OUTRO"] = "OUTRO";
})(CategoriaDificuldade || (exports.CategoriaDificuldade = CategoriaDificuldade = {}));
var CategoriaInstrumento;
(function (CategoriaInstrumento) {
    CategoriaInstrumento["ACADEMICO"] = "ACADEMICO";
    CategoriaInstrumento["COMPORTAMENTAL"] = "COMPORTAMENTAL";
    CategoriaInstrumento["SOCIOEMOCIONAL"] = "SOCIOEMOCIONAL";
    CategoriaInstrumento["COGNITIVO"] = "COGNITIVO";
    CategoriaInstrumento["LINGUAGEM"] = "LINGUAGEM";
    CategoriaInstrumento["MOTOR"] = "MOTOR";
    CategoriaInstrumento["ATENCAO"] = "ATENCAO";
    CategoriaInstrumento["OUTRO"] = "OUTRO";
})(CategoriaInstrumento || (exports.CategoriaInstrumento = CategoriaInstrumento = {}));
var TipoIndicador;
(function (TipoIndicador) {
    TipoIndicador["ESCALA_LIKERT"] = "ESCALA_LIKERT";
    TipoIndicador["SIM_NAO"] = "SIM_NAO";
    TipoIndicador["NUMERICO"] = "NUMERICO";
    TipoIndicador["MULTIPLA_ESCOLHA"] = "MULTIPLA_ESCOLHA";
    TipoIndicador["TEXTO_LIVRE"] = "TEXTO_LIVRE";
})(TipoIndicador || (exports.TipoIndicador = TipoIndicador = {}));
var NivelIntervencao;
(function (NivelIntervencao) {
    NivelIntervencao["UNIVERSAL"] = "UNIVERSAL";
    NivelIntervencao["SELETIVO"] = "SELETIVO";
    NivelIntervencao["INTENSIVO"] = "INTENSIVO";
})(NivelIntervencao || (exports.NivelIntervencao = NivelIntervencao = {}));
var AreaIntervencao;
(function (AreaIntervencao) {
    AreaIntervencao["LEITURA"] = "LEITURA";
    AreaIntervencao["ESCRITA"] = "ESCRITA";
    AreaIntervencao["MATEMATICA"] = "MATEMATICA";
    AreaIntervencao["COMPORTAMENTO"] = "COMPORTAMENTO";
    AreaIntervencao["ATENCAO"] = "ATENCAO";
    AreaIntervencao["SOCIOEMOCIONAL"] = "SOCIOEMOCIONAL";
    AreaIntervencao["LINGUAGEM"] = "LINGUAGEM";
    AreaIntervencao["OUTRO"] = "OUTRO";
})(AreaIntervencao || (exports.AreaIntervencao = AreaIntervencao = {}));
var FrequenciaAplicacao;
(function (FrequenciaAplicacao) {
    FrequenciaAplicacao["DIARIA"] = "DIARIA";
    FrequenciaAplicacao["SEMANAL"] = "SEMANAL";
    FrequenciaAplicacao["QUINZENAL"] = "QUINZENAL";
    FrequenciaAplicacao["MENSAL"] = "MENSAL";
    FrequenciaAplicacao["PERSONALIZADA"] = "PERSONALIZADA";
})(FrequenciaAplicacao || (exports.FrequenciaAplicacao = FrequenciaAplicacao = {}));
var TipoMeta;
(function (TipoMeta) {
    TipoMeta["ACADEMICA"] = "ACADEMICA";
    TipoMeta["COMPORTAMENTAL"] = "COMPORTAMENTAL";
    TipoMeta["SOCIOEMOCIONAL"] = "SOCIOEMOCIONAL";
    TipoMeta["COGNITIVA"] = "COGNITIVA";
    TipoMeta["LINGUAGEM"] = "LINGUAGEM";
    TipoMeta["MOTORA"] = "MOTORA";
    TipoMeta["ATENCAO"] = "ATENCAO";
    TipoMeta["OUTRA"] = "OUTRA";
})(TipoMeta || (exports.TipoMeta = TipoMeta = {}));
var StatusMeta;
(function (StatusMeta) {
    StatusMeta["NAO_INICIADA"] = "NAO_INICIADA";
    StatusMeta["EM_ANDAMENTO"] = "EM_ANDAMENTO";
    StatusMeta["ATINGIDA"] = "ATINGIDA";
    StatusMeta["NAO_ATINGIDA"] = "NAO_ATINGIDA";
    StatusMeta["CANCELADA"] = "CANCELADA";
})(StatusMeta || (exports.StatusMeta = StatusMeta = {}));
//# sourceMappingURL=enums.js.map