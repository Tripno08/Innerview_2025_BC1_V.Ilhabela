#!/usr/bin/env node

/**
 * Script para corrigir importações sem vírgulas em arquivos do repositório Prisma
 * Isto adiciona vírgulas entre os identificadores em um bloco de importação
 */

const fs = require('fs');
const path = require('path');

// Caminho para o diretório dos repositórios Prisma
const repoDir = path.join(__dirname, '..', 'src', 'infra', 'repositories', 'prisma');

// Função para corrigir os separadores de vírgula em um bloco import
function fixImportCommas(content) {
  // Encontrar todos os blocos de importação
  const importRegex = /import\s*\{([^}]*)\}\s*from\s*['"]([^'"]+)['"]\s*;?/g;
  
  return content.replace(importRegex, (match, imports, from) => {
    // Dividir as importações por linhas
    const lines = imports.split('\n');
    
    // Processar cada linha
    const fixedLines = lines.map((line, index) => {
      // Remover comentários e espaços em branco
      line = line.trim();
      
      // Pular linhas vazias ou linhas de comentários
      if (!line || line.startsWith('//')) return line;
      
      // Verificar se a linha já termina com vírgula
      if (line.endsWith(',')) return line;
      
      // Se não for a última linha e não for um comentário, adicionar a vírgula
      if (index < lines.length - 1) {
        return line + ',';
      }
      
      return line;
    });
    
    // Reconstruir o bloco de importação
    return `import {${fixedLines.join('\n')}} from '${from}';`;
  });
}

// Função para corrigir um arquivo
function fixFile(filePath) {
  try {
    console.log(`Processando arquivo: ${filePath}`);
    
    // Ler o conteúdo do arquivo
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Verificar se o arquivo precisa de correção
    if (content.includes('import {') && !content.includes('import { ')) {
      // Aplicar a correção
      const fixedContent = fixImportCommas(content);
      
      // Se o conteúdo foi alterado
      if (fixedContent !== content) {
        // Escrever o conteúdo corrigido de volta ao arquivo
        fs.writeFileSync(filePath, fixedContent, 'utf8');
        console.log(`✅ Arquivo corrigido: ${filePath}`);
        return true;
      }
    }
    
    console.log(`⏭️ Arquivo não precisa de correção: ${filePath}`);
    return false;
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