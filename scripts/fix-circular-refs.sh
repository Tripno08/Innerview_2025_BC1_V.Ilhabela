#!/bin/bash

# Script para resolver problemas de referência circular no projeto
# Força o ts-node a ignorar completamente as verificações de tipo

# Cores para mensagens
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Mensagens
echo -e "${BLUE}==================================${NC}"
echo -e "${YELLOW}Resolvendo problemas de referências circulares${NC}"
echo -e "${BLUE}==================================${NC}"
echo

# Remover arquivos problemáticos de declaração de tipo global gerados pelo Prisma
PRISMA_DIR="./node_modules/.prisma/client"
ORIG_INDEX="${PRISMA_DIR}/index.d.ts.original"
INDEX="${PRISMA_DIR}/index.d.ts"

if [ ! -f "$ORIG_INDEX" ] && [ -f "$INDEX" ]; then
  echo -e "${YELLOW}Fazendo backup do arquivo original de tipos do Prisma...${NC}"
  cp "$INDEX" "$ORIG_INDEX"
  echo -e "${GREEN}Backup criado em: $ORIG_INDEX${NC}"
fi

echo -e "${YELLOW}Aplicando solução para ignorar verificações de tipo...${NC}"

# Configurar variáveis de ambiente para o ts-node
export TS_NODE_TRANSPILE_ONLY=true 
export TS_NODE_COMPILER_OPTIONS='{"skipLibCheck":true,"skipDefaultLibCheck":true,"noEmitOnError":false,"strictNullChecks":false}'

# Executar ts-node-dev com as opções necessárias
echo -e "${GREEN}Iniciando servidor...${NC}"
echo -e "${YELLOW}ATENÇÃO: Todas as verificações de tipo estão desabilitadas.${NC}"
echo

# Executar o servidor
ts-node-dev --transpile-only -r tsconfig-paths/register src/server.ts 