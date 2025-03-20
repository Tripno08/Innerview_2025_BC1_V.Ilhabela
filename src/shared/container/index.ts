import { container } from 'tsyringe';

// Interfaces de Repositórios
import { IUsuarioRepository } from '@domain/repositories/usuario-repository.interface';
import { IRuniaoRepository } from '@domain/repositories/reuniao-repository.interface';
import { IEstudanteRepository } from '@domain/repositories/estudante-repository.interface';
import { IIntervencaoRepository } from '@domain/repositories/intervencao-repository.interface';

// Interfaces de Serviços
import { IHashService, IJwtService } from '@application/interfaces/cryptography.interface';
import { IAuthService } from '@domain/interfaces/IAuthService';
import { ICacheService } from '@domain/interfaces/ICacheService';
import { ILogger } from '@domain/interfaces/ILogger';
import { IStorageService } from '@domain/interfaces/IStorageService';
import { ILMSAdapter } from '@domain/interfaces/ILMSAdapter';
import { ISISAdapter } from '@domain/interfaces/ISISAdapter';
import { IMLService } from '@domain/services/ml/ml-service.interface';

// Implementações de Repositórios
import { UsuarioRepository } from '@infrastructure/repositories/usuario.repository';
import { ReuniaoRepository } from '@infrastructure/repositories/reuniao.repository';
import { EstudanteRepository } from '@infrastructure/repositories/estudante.repository';
import { IntervencaoRepository } from '@infrastructure/repositories/intervencao.repository';

// Implementações de Serviços
import { BcryptHashService, JwtService } from '@infrastructure/cryptography';
import { JwtAuthService } from '@infrastructure/auth/JwtAuthService';
import { RedisCache } from '@infrastructure/cache/RedisCache';
import { WinstonLogger } from '@infrastructure/logging/WinstonLogger';
import { LocalStorageService } from '@infrastructure/storage/LocalStorageService';
import { LMSAdapter } from '@infrastructure/external/adapters/LMSAdapter';
import { SISAdapter } from '@infrastructure/external/adapters/SISAdapter';
import { MLServiceBasic } from '@infrastructure/services/ml/ml-service-basic';

// Casos de uso - Usuário
import {
  RegistrarUsuarioUseCase,
  AutenticarUsuarioUseCase,
  AssociarUsuarioInstituicaoUseCase,
  VerificarPermissaoUseCase,
} from '@application/use-cases/usuario';

// Casos de uso - Reunião
import { CriarReuniaoUseCase } from '@application/use-cases/reuniao/criar-reuniao.usecase';

export function registerDependencies(): void {
  // Repositórios
  container.registerSingleton<IUsuarioRepository>('UsuarioRepository', UsuarioRepository);
  container.registerSingleton<IRuniaoRepository>('ReuniaoRepository', ReuniaoRepository);
  container.registerSingleton<IEstudanteRepository>('EstudanteRepository', EstudanteRepository);
  container.registerSingleton<IIntervencaoRepository>(
    'IntervencaoRepository',
    IntervencaoRepository,
  );

  // Serviços de Criptografia
  container.registerSingleton<IHashService>('HashService', BcryptHashService);
  container.registerSingleton<IJwtService>('JwtService', JwtService);

  // Novos Serviços de Infraestrutura
  container.registerSingleton<IAuthService>('AuthService', JwtAuthService);
  container.registerSingleton<ICacheService>('CacheService', RedisCache);
  container.registerSingleton<ILogger>('Logger', WinstonLogger);
  container.registerSingleton<IStorageService>('StorageService', LocalStorageService);
  container.registerSingleton<ILMSAdapter>('LMSAdapter', LMSAdapter);
  container.registerSingleton<ISISAdapter>('SISAdapter', SISAdapter);

  // Serviços
  container.register<IMLService>('MLService', {
    useFactory: (dependencyContainer) => {
      const estudanteRepository =
        dependencyContainer.resolve<IEstudanteRepository>('EstudanteRepository');
      const intervencaoRepository =
        dependencyContainer.resolve<IIntervencaoRepository>('IntervencaoRepository');
      return new MLServiceBasic(estudanteRepository, intervencaoRepository);
    },
  });

  // Casos de Uso - Usuário
  container.registerSingleton('RegistrarUsuarioUseCase', RegistrarUsuarioUseCase);
  container.registerSingleton('AutenticarUsuarioUseCase', AutenticarUsuarioUseCase);
  container.registerSingleton(
    'AssociarUsuarioInstituicaoUseCase',
    AssociarUsuarioInstituicaoUseCase,
  );
  container.registerSingleton('VerificarPermissaoUseCase', VerificarPermissaoUseCase);

  // Casos de Uso - Reunião
  container.registerSingleton('CriarReuniaoUseCase', CriarReuniaoUseCase);
}
