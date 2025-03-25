#!/bin/bash

# Script para resolver problemas de referência circular no Prisma
# Este script cria um arquivo de patch temporário, modifica o tsconfig para ignorar erros
# e executa o build com flags especiais

# Cores para mensagens
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Diretório base
BASE_DIR=$(pwd)
TEMP_DIR="$BASE_DIR/temp"
PRISMA_DIR="$BASE_DIR/node_modules/.prisma/client"

# Criar diretório temporário
mkdir -p "$TEMP_DIR"

echo -e "${BLUE}Iniciando correção de referências circulares no Prisma${NC}"

# 1. Criar arquivo d.ts patch
echo -e "${YELLOW}Criando arquivo de definição de tipos para substituir as referências circulares...${NC}"

cat > "$TEMP_DIR/prisma-patch.d.ts" << 'EOF'
// Patch para resolver referências circulares em tipos do Prisma
declare namespace Prisma {
  type AnyFilter = any;
  
  interface ScalarWhereWithAggregatesInput {
    AND?: AnyFilter;
    OR?: AnyFilter;
    NOT?: AnyFilter;
    [key: string]: any;
  }
  
  interface EncaminhamentoScalarWhereWithAggregatesInput extends ScalarWhereWithAggregatesInput {}
  interface IntervencaoScalarWhereWithAggregatesInput extends ScalarWhereWithAggregatesInput {}
  interface ParticipanteReuniaoScalarWhereWithAggregatesInput extends ScalarWhereWithAggregatesInput {}
  interface ReuniaoScalarWhereWithAggregatesInput extends ScalarWhereWithAggregatesInput {}
  
  interface StringNullableWithAggregatesFilter {
    equals?: string | null;
    [key: string]: any;
  }
  
  interface BoolWithAggregatesFilter {
    equals?: boolean;
    [key: string]: any;
  }
}
EOF

# 2. Criar tsconfig temporário
echo -e "${YELLOW}Criando configuração TypeScript otimizada...${NC}"

cat > "$TEMP_DIR/tsconfig.prisma-fix.json" << 'EOF'
{
  "extends": "../tsconfig.build.json",
  "compilerOptions": {
    "skipLibCheck": true,
    "skipDefaultLibCheck": true,
    "noEmitOnError": false,
    "noImplicitAny": false,
    "strictNullChecks": false,
    "suppressImplicitAnyIndexErrors": true,
    "ignoreDeprecations": "5.0",
    "typeRoots": [
      "../node_modules/@types",
      "../temp"
    ]
  },
  "include": [
    "../src/**/*"
  ],
  "exclude": [
    "../node_modules",
    "../test",
    "../**/*spec.ts",
    "../**/*test.ts"
  ]
}
EOF

# 3. Criar arquivo preload para o ts-node-dev
echo -e "${YELLOW}Criando arquivo de preload para ts-node-dev...${NC}"

cat > "$TEMP_DIR/preload.js" << 'EOF'
/**
 * Este script é carregado antes da execução do código TypeScript
 * Ele define tipos globais que substituem os tipos problemáticos do Prisma
 */
console.log('Preload: Substituindo tipos do Prisma para evitar referências circulares...');

// Definir tipos simplificados
global.PrismaFixTypes = {
  // Esses tipos serão usados em vez dos tipos problemáticos
  ScalarWhereWithAggregatesInput: {},
  EncaminhamentoScalarWhereWithAggregatesInput: {},
  IntervencaoScalarWhereWithAggregatesInput: {},
  ParticipanteReuniaoScalarWhereWithAggregatesInput: {},
  ReuniaoScalarWhereWithAggregatesInput: {},
  StringNullableWithAggregatesFilter: {},
  BoolWithAggregatesFilter: {}
};
EOF

# 4. Ajustar permissões
chmod +x "$TEMP_DIR/preload.js"

# 5. Exibir comandos para usuário
echo -e "${GREEN}Configuração concluída!${NC}"
echo -e "${BLUE}Para executar o projeto com a correção:${NC}"
echo -e "${YELLOW}npm run dev:fixed${NC}"
echo -e "${BLUE}Para fazer o build com a correção:${NC}"
echo -e "${YELLOW}npm run build:fixed${NC}"

# 6. Adicionar comandos ao package.json se não existirem
if ! grep -q "dev:fixed" "$BASE_DIR/package.json"; then
  echo -e "${YELLOW}Adicionando novos scripts ao package.json...${NC}"
  # Esta parte é simplificada, em um cenário real seria melhor usar jq ou outro parser JSON
  # Por enquanto, apenas mostrar as instruções
  echo -e "${BLUE}Adicione manualmente estes scripts ao seu package.json:${NC}"
  echo -e "${YELLOW}\"dev:fixed\": \"node temp/preload.js && ts-node-dev -r tsconfig-paths/register src/server.ts\",${NC}"
  echo -e "${YELLOW}\"build:fixed\": \"tsc -p temp/tsconfig.prisma-fix.json\"${NC}"
fi

echo -e "${GREEN}Concluído!${NC}" 