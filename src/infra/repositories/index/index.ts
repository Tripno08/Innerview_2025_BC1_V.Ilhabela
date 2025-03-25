/**
 * Arquivo índice centralizado para importações relacionadas ao Prisma
 * Contém todos os tipos, utilitários e enums necessários para os repositórios
 */

// Exporta enums
export {
  Status,
  CargoUsuario,
  TipoAvaliacao,
  TipoRelatorio,
  PeriodoRelatorio,
} from '../../../shared/enums';

// Exporta todos os modelos de dados
export * from './models';

// Exporta utilitários do Prisma
export { ensurePrismaModel, handlePrismaResult } from '../../../types/prisma-extended';

// Exporta utilitários helpers
export {
  createPrismaQuery,
  sanitizeForPrisma,
  mapPrismaError,
  mapCategoriaDificuldadeToPrisma,
  mapCategoriaDificuldadeFromPrisma,
  mapTipoDificuldadeToCategoria,
} from '../../../shared/helpers/prisma-helper';

// Exporta mapeadores de enums
export {
  mapStatusToPrisma,
  mapStatusFromPrisma,
  mapCargoToPrisma,
  mapCargoFromPrisma,
  mapCargoEquipeToPrisma,
  mapCargoEquipeFromPrisma,
} from '../../../shared/utils/enum-mappers';

// Exporta mapeadores de entidades
export {
  mapearEquipeDTO,
  mapearMembroEquipeDTO,
  mapearEstudanteDTO,
  mapearEstudanteEquipeDTO,
} from '../../../shared/utils/entity-mappers';

// Exporta esquemas do Prisma
export { EquipeCreate, EquipeUpdate, isEstudantePrisma } from '../../../types/prisma-schemas';

// Exporta repositórios
export { PrismaUsuarioRepository } from '../prisma/prisma-usuario.repository';
export { PrismaEstudanteRepository } from '../prisma/prisma-estudante.repository';
export { PrismaEquipeRepository } from '../prisma/prisma-equipe.repository';
export { PrismaIntervencaoRepository } from '../prisma/prisma-intervencao.repository';
export { PrismaReuniaoRepository } from '../prisma/prisma-reuniao.repository';
export { PrismaAvaliacaoRepository } from '../prisma/prisma-avaliacao.repository';
export { PrismaArquivoAvaliacaoRepository } from '../prisma/prisma-arquivo-avaliacao.repository';
export { PrismaDificuldadeRepository } from '../prisma/prisma-dificuldade.repository';
export { PrismaRelatorioRepository } from '../prisma/prisma-relatorio.repository';
export { PrismaAnexoRelatorioRepository } from '../prisma/prisma-anexo-relatorio.repository';
export { PrismaVisualizacaoRelatorioRepository } from '../prisma/prisma-visualizacao-relatorio.repository';
export { PrismaCompartilhamentoRelatorioRepository } from '../prisma/prisma-compartilhamento-relatorio.repository';

export {
  // Utility functions
  createPrismaQuery,
  sanitizeForPrisma,
  mapPrismaError,
  ensurePrismaModel,
  handlePrismaResult,

  // Enums, mappers e types
  mapStatusFromPrisma,
  mapStatusToPrisma,
  Status,

  // Types
  IPrismaUsuarioData,
  IPrismaEstudanteData,
  IPrismaIntervencaoData,
  IPrismaRelatorioData,
  IPrismaAnexoRelatorioData,
  IPrismaCompartilhamentoRelatorioData,
  IPrismaVisualizacaoRelatorioData,
  IPrismaEquipeData,
  IPrismaMembroEquipeData,
  IPrismaEstudanteEquipeData,
  IPrismaArquivoAvaliacaoData,
  IPrismaAvaliacaoData,
  IPrismaDificuldadeData,

  // Models
  ITokenRedefinicaoSenhaModel,
  IUsuarioModel,
  IEstudanteModel,
  IIntervencaoModel,
  IRelatorioModel,
  IAnexoRelatorioModel,
  ICompartilhamentoRelatorioModel,
  IVisualizacaoRelatorioModel,
  IEquipeModel,
  IMembroEquipeModel,
  IEstudanteEquipeModel,
  IArquivoAvaliacaoModel,
  IAvaliacaoModel,
  IDificuldadeModel,
};
