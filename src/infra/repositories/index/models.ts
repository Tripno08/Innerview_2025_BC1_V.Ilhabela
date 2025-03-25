/**
 * Arquivo de modelos centralizados para os repositórios Prisma
 * Define interfaces padrão para os modelos do Prisma
 */

// Exporta interfaces de modelos Prisma
export {
  IPrismaUsuarioData,
  IPrismaEstudanteData,
  IPrismaEquipeData,
  IPrismaMembroEquipeData,
  IPrismaEstudanteEquipeData,
  IPrismaIntervencaoData,
  IPrismaReuniaoData,
  IPrismaParticipanteReuniaoData,
  IPrismaEncaminhamentoReuniaoData,
  IPrismaAvaliacaoData,
  IPrismaRelatorioData,
  IPrismaAnexoRelatorioData,
  IPrismaVisualizacaoRelatorioData,
  IPrismaCompartilhamentoRelatorioData,
} from '../../../types/prisma';

// Define interfaces para modelos específicos que não estão no arquivo de tipos
export interface IPrismaArquivoAvaliacaoData {
  id: string;
  arquivoId?: string;
  avaliacaoId: string;
  nome: string;
  url: string;
  tipo: string;
  tamanho: number;
  criadoEm: Date;
  atualizadoEm: Date;
}

// Exporta interfaces de modelos estendidos
export {
  PrismaClientExtended,
  ITokenRedefinicaoSenhaModel,
  IRefreshTokenModel,
  IPermissaoUsuarioModel,
  IRelatorioModel,
  IAnexoRelatorioModel,
  ICompartilhamentoRelatorioModel,
  IVisualizacaoRelatorioModel,
} from '../../../types/prisma-extended';
