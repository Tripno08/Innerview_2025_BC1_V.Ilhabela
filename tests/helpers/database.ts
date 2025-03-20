import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { testConfig } from '../../src/config/test';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: testConfig.database.url,
    },
  },
});

export async function setupTestDatabase() {
  try {
    // Executa as migrações no banco de teste
    execSync('npx prisma migrate deploy', {
      env: {
        ...process.env,
        DATABASE_URL: testConfig.database.url,
      },
    });
  } catch (error) {
    console.error('Erro ao configurar banco de dados de teste:', error);
    throw error;
  }
}

export async function clearTestDatabase() {
  const tablenames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM information_schema.tables WHERE schemaname='public'`;

  for (const { tablename } of tablenames) {
    if (tablename !== '_prisma_migrations') {
      try {
        await prisma.$executeRawUnsafe(
          `TRUNCATE TABLE "${tablename}" CASCADE;`
        );
      } catch (error) {
        console.log({ error });
      }
    }
  }
}

export async function closeTestDatabase() {
  await prisma.$disconnect();
} 