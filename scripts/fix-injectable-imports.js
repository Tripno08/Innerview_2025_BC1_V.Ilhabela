#!/usr/bin/env node

/**
 * Script para corrigir importações do decorador @injectable() em arquivos do repositório Prisma
 * Este script substitui "import { able } from 'tsyringe'" por "import { injectable } from 'tsyringe'"
 */

const fs = require('fs');
const path = require('path');

// Caminho para o diretório dos repositórios Prisma
const repoDir = path.join(__dirname, '..', 'src', 'infra', 'repositories', 'prisma');

// Função para corrigir um arquivo
function fixFile(filePath) {
  try {
    console.log(`Processando arquivo: ${filePath}`);
    
    // Ler o conteúdo do arquivo
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Verificar se o arquivo contém a importação incorreta
    if (content.includes('import { able }') || content.includes('import {able }')) {
      // Substituir a importação
      content = content.replace(/import\s*\{\s*able\s*\}\s*from\s*['"]tsyringe['"];?/g, 
                               'import { injectable } from \'tsyringe\';');
      
      // Escrever o conteúdo corrigido de volta ao arquivo
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Arquivo corrigido: ${filePath}`);
      return true;
    } else {
      console.log(`⏭️ Arquivo não precisa de correção: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Erro ao processar arquivo ${filePath}:`, error);
    return false;
  }
}

// Obter todos os arquivos .ts no diretório
const files = fs.readdirSync(repoDir);
let fixedCount = 0;

// Processar cada arquivo
files.forEach(file => {
  if (file.endsWith('.ts')) {
    const filePath = path.join(repoDir, file);
    const fixed = fixFile(filePath);
    if (fixed) fixedCount++;
  }
});

console.log(`\nProcessamento concluído! ${fixedCount} arquivo(s) corrigido(s).`); 