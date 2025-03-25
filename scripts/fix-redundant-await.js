#!/usr/bin/env node

/**
 * Script para identificar e corrigir o uso redundante de await em retornos
 * 
 * Uso:
 *   node scripts/fix-redundant-await.js [--dry-run]
 *   
 * Este script analisará os arquivos de repositório Prisma e corrigirá
 * o uso redundante do operador await em retornos de funções assíncronas.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Diretórios para buscar
const SEARCH_PATHS = [
  'src/infra/repositories/prisma/*.repository.ts',
  'src/infrastructure/repositories/*.repository.ts',
  'src/infrastructure/database/*.ts',
  'src/application/facades/estudante.facade.ts',
  'src/infra/repositories/equipe.repository.ts'
];

// Regex para encontrar uso redundante de await em retornos
const REDUNDANT_AWAIT_REGEX = /return\s+await\s+([^;]+);/g;

// Contadores para relatório final
let filesChecked = 0;
let filesModified = 0;
let awaitsRemoved = 0;

// Flag para modo de simulação (não modifica arquivos)
const DRY_RUN = process.argv.includes('--dry-run');

/**
 * Corrige uso redundante de await em um arquivo
 * @param {string} filePath Caminho do arquivo para analisar e modificar
 */
function processFile(filePath) {
  try {
    // Ler conteúdo do arquivo
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Encontrar todos os casos de "return await"
    const matches = content.match(REDUNDANT_AWAIT_REGEX) || [];
    const matchCount = matches.length;
    
    if (matchCount > 0) {
      console.log(`🔍 ${filePath}: ${matchCount} uso(s) redundante(s) de await`);
      matches.forEach(match => {
        const simplified = match.replace(/\s+/g, ' ').trim();
        console.log(`   ${simplified}`);
      });
      
      if (!DRY_RUN) {
        // Substituir "return await" por "return"
        const newContent = content.replace(REDUNDANT_AWAIT_REGEX, (match, group) => {
          return `return ${group};`;
        });
        
        // Escrever o arquivo apenas se houve alteração
        fs.writeFileSync(filePath, newContent, 'utf8');
        
        console.log(`✅ ${filePath}: ${matchCount} uso(s) redundante(s) de await corrigido(s)`);
      } else {
        console.log(`🔍 [DRY RUN] ${filePath}: ${matchCount} uso(s) redundante(s) seriam corrigidos`);
      }
      
      filesModified++;
      awaitsRemoved += matchCount;
    }
    
    filesChecked++;
  } catch (error) {
    console.error(`❌ Erro ao processar ${filePath}:`, error.message);
  }
}

/**
 * Função principal do script
 */
function main() {
  console.log(`🔍 Buscando usos redundantes de await${DRY_RUN ? ' (MODO SIMULAÇÃO)' : ''}...`);
  
  // Processar cada padrão de busca
  SEARCH_PATHS.forEach(pattern => {
    const files = glob.sync(pattern);
    files.forEach(processFile);
  });
  
  // Exibir relatório final
  console.log('\n📊 Relatório Final:');
  console.log(`- Arquivos analisados: ${filesChecked}`);
  console.log(`- Arquivos ${DRY_RUN ? 'que seriam modificados' : 'modificados'}: ${filesModified}`);
  console.log(`- Usos redundantes de await ${DRY_RUN ? 'que seriam corrigidos' : 'corrigidos'}: ${awaitsRemoved}`);
  
  if (awaitsRemoved > 0) {
    if (DRY_RUN) {
      console.log('\n🔍 Simulação concluída! Para aplicar as mudanças, execute sem --dry-run');
    } else {
      console.log('\n✨ Uso redundante de await corrigido com sucesso!');
      console.log('🔄 Execute os testes para garantir que tudo continua funcionando corretamente.');
    }
  } else {
    console.log('\n👀 Nenhum uso redundante de await encontrado.');
  }
}

// Executar script
main(); 