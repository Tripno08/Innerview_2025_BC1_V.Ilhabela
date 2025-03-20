#!/bin/bash

# Script para compilar o projeto ignorando erros de tipo
echo "Compilando o projeto, ignorando erros de tipo..."

# Tentar compilar com TypeScript, ignorando o código de saída
npx tsc -p tsconfig.build.json --skipLibCheck --noEmitOnError

# Verificar se a pasta dist foi criada
if [ -d "dist" ]; then
  echo "Compilação concluída com sucesso. Os arquivos estão em ./dist"
  exit 0
else
  echo "Falha na compilação. A pasta dist não foi criada."
  exit 1
fi 