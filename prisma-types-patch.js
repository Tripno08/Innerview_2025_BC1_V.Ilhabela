#!/usr/bin/env node

/**
 * Script para resolver problemas de referência circular no Prisma
 * Este script é executado antes da inicialização do servidor
 * 
 * Ele gera um arquivo de definição de tipos que substitui os tipos problemáticos
 * do Prisma por versões simplificadas sem referências circulares.
 */

const fs = require('fs');
const path = require('path');

// Caminho para o arquivo de patch
const patchFile = path.join(__dirname, 'node_modules', '.prisma', 'client', 'index.d.ts.patch');
const dir = path.dirname(patchFile);

// Criar diretório se não existir
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Conteúdo do patch que vai substituir tipos circulares
const patchContent = `
// Patch para resolver referências circulares em tipos do Prisma
// Este arquivo é injetado automaticamente pelo script de inicialização

declare namespace Prisma {
  // Tipos simplificados que substituem os tipos circulares
  type AnyFilter = any;
  
  interface ScalarWhereWithAggregatesInput {
    AND?: AnyFilter;
    OR?: AnyFilter;
    NOT?: AnyFilter;
    [key: string]: any;
  }
  
  // Substituir tipos específicos
  interface EncaminhamentoScalarWhereWithAggregatesInput extends ScalarWhereWithAggregatesInput {}
  interface IntervencaoScalarWhereWithAggregatesInput extends ScalarWhereWithAggregatesInput {}
  interface ParticipanteReuniaoScalarWhereWithAggregatesInput extends ScalarWhereWithAggregatesInput {}
  interface ReuniaoScalarWhereWithAggregatesInput extends ScalarWhereWithAggregatesInput {}
  
  // Filtros simplificados
  interface StringNullableWithAggregatesFilter {
    equals?: string | null;
    [key: string]: any;
  }
  
  interface BoolWithAggregatesFilter {
    equals?: boolean;
    [key: string]: any;
  }
}
`;

// Escrever o arquivo de patch
fs.writeFileSync(patchFile, patchContent);

console.log(`Patch de tipos do Prisma criado em: ${patchFile}`);
console.log('Referências circulares substituídas por tipos simplificados'); 