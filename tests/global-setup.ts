import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

export default async function setup(): Promise<void> {
  if (process.env.SKIP_DOCKER === 'true') {
    console.log('Pulando inicialização dos contêineres de teste...');
    await setupDirs();
    return;
  }

  try {
    execSync('command -v docker', { stdio: 'ignore' });
    console.log('Docker encontrado, iniciando containers de teste...');
    
    try {
      execSync('docker compose -f docker-compose.test.yml up -d', { stdio: 'inherit' });
      console.log('✓ Containers de teste iniciados com sucesso');
    } catch (error) {
      console.error('Falha ao iniciar containers de teste', error);
      console.log('Continuando sem containers Docker...');
    }
  } catch (error) {
    console.log('Docker não encontrado, continuando sem contêineres...');
  }

  await setupDirs();
}

async function setupDirs() {
  // Criar diretórios necessários para testes
  const dirs = [
    path.resolve(process.cwd(), 'tmp/test'),
    path.resolve(process.cwd(), 'uploads/test'),
    path.resolve(process.cwd(), 'logs')
  ];

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  // Configurar variáveis de ambiente para testes
  process.env.NODE_ENV = 'test';
  process.env.APP_SECRET = 'test-secret';
  process.env.STORAGE_DRIVER = 'local';
  process.env.STORAGE_LOCAL_PATH = path.resolve(process.cwd(), 'uploads/test');
} 