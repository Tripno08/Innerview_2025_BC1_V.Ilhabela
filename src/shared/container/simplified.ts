/**
 * Versão simplificada do container de injeção de dependências
 * Esta versão remove importações problemáticas para permitir a inicialização do servidor
 */
import { container } from 'tsyringe';

// Importações mínimas necessárias
import { UsuarioRepository } from '../../infrastructure/repositories/usuario.repository';
import { EquipeRepository } from '../../infrastructure/repositories/equipe.repository';
import { EstudanteRepository } from '../../infrastructure/repositories/estudante.repository';
import { ReuniaoRepository } from '../../infrastructure/repositories/reuniao.repository';
import { DificuldadeRepository } from '../../infrastructure/repositories/dificuldade.repository';
import { IntervencaoRepository } from '../../infrastructure/repositories/intervencao.repository';

// Importações dos repositórios Prisma de avaliação
import { PrismaAvaliacaoRepository } from '../../infra/repositories/prisma/prisma-avaliacao.repository';
import { PrismaArquivoAvaliacaoRepository } from '../../infra/repositories/prisma/prisma-arquivo-avaliacao.repository';

// Controllers
import { UsuarioController } from '../../interfaces/controllers/usuario.controller';
import { EstudanteController } from '../../interfaces/controllers/estudante.controller';
import { DificuldadeController } from '../../interfaces/controllers/dificuldade.controller';
import { ReuniaoController } from '../../interfaces/controllers/reuniao.controller';
import { EquipeController } from '../../interfaces/controllers/equipe.controller';
import { IntervencaoController } from '../../interfaces/controllers/intervencao.controller';
import { DashboardController } from '../../interfaces/controllers/dashboard.controller';

// Casos de uso essenciais
import { RegistrarUsuarioUseCase } from '../../application/use-cases/usuario/registrar-usuario.use-case';
import { AutenticarUsuarioUseCase } from '../../application/use-cases/usuario/autenticar-usuario.use-case';
import { GerenciarEquipeUseCase } from '../../application/use-cases/equipe/gerenciar-equipe.use-case';
import { GerenciarEstudanteUseCase } from '../../application/use-cases/estudante/gerenciar-estudante.use-case';
import { GerenciarIntervencaoUseCase } from '../../application/use-cases/intervencao/gerenciar-intervencao.use-case';
import { GerenciarAvaliacaoUseCase } from '../../application/use-cases/avaliacao/gerenciar-avaliacao.use-case';

// Serviços de autenticação e criptografia
import { BcryptHashService, JwtService } from '../../infrastructure/cryptography';
import { JwtAuthService } from '../../infrastructure/auth/JwtAuthService';

/**
 * Registra apenas as dependências essenciais para inicialização
 */
export function registerSimplifiedDependencies(): void {
  console.log('Registrando dependências simplificadas...');
  // Controllers (essenciais para as rotas)
  container.registerSingleton('UsuarioController', UsuarioController);
  container.registerSingleton('EstudanteController', EstudanteController);
  container.registerSingleton('DificuldadeController', DificuldadeController);
  container.registerSingleton('ReuniaoController', ReuniaoController);
  container.registerSingleton('EquipeController', EquipeController);
  container.registerSingleton('IntervencaoController', IntervencaoController);
  container.registerSingleton('DashboardController', DashboardController);

  // Repositórios
  container.registerSingleton('UsuarioRepository', UsuarioRepository);
  container.registerSingleton('ReuniaoRepository', ReuniaoRepository);
  container.registerSingleton('EstudanteRepository', EstudanteRepository);
  container.registerSingleton('IntervencaoRepository', IntervencaoRepository);
  container.registerSingleton('DificuldadeRepository', DificuldadeRepository);
  container.registerSingleton('EquipeRepository', EquipeRepository);
  // Registrando repositórios de avaliação do Prisma
  container.registerSingleton('AvaliacaoRepository', PrismaAvaliacaoRepository);
  container.registerSingleton('ArquivoAvaliacaoRepository', PrismaArquivoAvaliacaoRepository);

  // Serviços esssenciais
  container.registerSingleton('HashService', BcryptHashService);
  container.registerSingleton('JwtService', JwtService);
  container.registerSingleton('AuthService', JwtAuthService);

  // Casos de uso essenciais
  container.registerSingleton('RegistrarUsuarioUseCase', RegistrarUsuarioUseCase);
  container.registerSingleton('AutenticarUsuarioUseCase', AutenticarUsuarioUseCase);
  // Use Cases unificados
  container.registerSingleton('GerenciarEquipeUseCase', GerenciarEquipeUseCase);
  container.registerSingleton('GerenciarEstudanteUseCase', GerenciarEstudanteUseCase);
  container.registerSingleton('GerenciarIntervencaoUseCase', GerenciarIntervencaoUseCase);
  container.registerSingleton('GerenciarAvaliacaoUseCase', GerenciarAvaliacaoUseCase);
  console.log('Dependências simplificadas registradas com sucesso!');
} 