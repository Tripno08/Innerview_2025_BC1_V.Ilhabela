import { execSync } from 'child_process';
import { rm } from 'fs/promises';

module.exports = async () => {
  // Tenta parar os containers de teste, mas não falha se o Docker não estiver disponível
  try {
    execSync('command -v docker', { stdio: 'ignore' });
    console.log('Docker encontrado, parando containers de teste...');
    
    execSync('docker compose -f docker-compose.test.yml down');
    console.log('✓ Containers de teste finalizados com sucesso');
  } catch (error) {
    console.warn('⚠️ Docker não encontrado. Pulando finalização de containers.');
  }

  // Remove diretórios temporários de teste
  try {
    await rm('tmp/test', { recursive: true, force: true });
    await rm('uploads/test', { recursive: true, force: true });
    console.log('✓ Diretórios temporários de teste removidos');
  } catch (error) {
    console.warn('⚠️ Erro ao remover diretórios temporários:', error);
  }
}; 