#!/usr/bin/env node

/**
 * Script para corrigir importações sem vírgulas em arquivos do repositório Prisma
 * Identifica todos os blocos de importação e adiciona vírgulas entre as linhas quando necessário
 */

const fs = require('fs');
const path = require('path');

// Caminho para o diretório dos repositórios Prisma
const repoDir = path.join(__dirname, '..', 'src', 'infra', 'repositories', 'prisma');

// Função para corrigir importações multilinhas
function fixImports(content) {
  // Expressão regular para encontrar blocos de importação com chaves
  const importRegex = /import\s*{([^}]*)}\s*from\s*['"]([^'"]+)['"]\s*;?/g;
  
  return content.replace(importRegex, (match, imports, from) => {
    // Dividir as importações por quebras de linha
    const lines = imports.split('\n');
    
    // Processar cada linha
    const processedLines = lines.map((line, index) => {
      // Remover espaços em branco no início e fim
      const trimmedLine = line.trim();
      
      // Se a linha estiver vazia ou for apenas um comentário, mantê-la intacta
      if (!trimmedLine || trimmedLine.startsWith('//')) {
        return line;
      }
      
      // Se já terminar com vírgula, não fazer nada
      if (trimmedLine.endsWith(',')) {
        return line;
      }
      
      // Adicionar vírgula se não for a última linha do bloco
      if (index < lines.length - 1) {
        // Preservar indentação
        const indent = line.match(/^\s*/)[0];
        return `${indent}${trimmedLine},`;
      }
      
      return line;
    });
    
    // Reconstruir o bloco de importação
    return `import {${processedLines.join('\n')}} from '${from}';`;
  });
}

// Função para processar um arquivo
function processFile(filePath) {
  try {
    console.log(`Processando: ${filePath}`);
    
    // Ler o conteúdo do arquivo
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Aplicar a correção
    const fixedContent = fixImports(content);
    
    // Se houve mudanças
    if (fixedContent !== content) {
      // Escrever o conteúdo corrigido de volta ao arquivo
      fs.writeFileSync(filePath, fixedContent, 'utf-8');
      console.log(`✅ Corrigido: ${filePath}`);
      return true;
    } else {
      console.log(`⏭️ Sem alterações: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Erro ao processar ${filePath}:`, error);
    return false;
  }
}

// Ler todos os arquivos no diretório
const files = fs.readdirSync(repoDir);
let fixedCount = 0;

// Processar cada arquivo
files.forEach(file => {
  if (file.endsWith('.ts')) {
    const filePath = path.join(repoDir, file);
    const fixed = processFile(filePath);
    if (fixed) fixedCount++;
  }
});

console.log(`\nProcessamento concluído. ${fixedCount} arquivo(s) corrigido(s).`); 