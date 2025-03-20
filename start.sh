#!/bin/bash
set -e

echo "🚀 Iniciando o ambiente de desenvolvimento Innerview Ilhabela"

# Verificar se o Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não encontrado. Por favor, instale-o antes de continuar."
    exit 1
fi

# Verificar se .env existe, caso não, criar a partir do exemplo
if [ ! -f .env ]; then
    echo "📝 Arquivo .env não encontrado. Criando a partir de .env.example..."
    cp .env.example .env
    echo "⚠️ Por favor, revise o arquivo .env e ajuste as configurações conforme necessário."
fi

# Criar diretório para scripts de inicialização do banco, se não existir
if [ ! -d "init-scripts" ]; then
    echo "📁 Criando diretório para scripts de inicialização do banco..."
    mkdir -p init-scripts
fi

# Construir e iniciar os contêineres
echo "🏗️ Construindo e iniciando os contêineres..."
docker compose up -d --build

# Aguardar o banco de dados estar pronto
echo "⏳ Aguardando o banco de dados estar pronto..."
sleep 10

# Executar migrações iniciais
echo "🔄 Executando migrações do Prisma..."
docker compose run --rm migration npm run migrate:dev

echo "✅ Ambiente configurado com sucesso!"
echo "📊 API disponível em: http://localhost:3000"
echo "💾 Banco de dados MySQL disponível em: localhost:3306"
echo "🔄 Redis disponível em: localhost:6379"
echo ""
echo "Para visualizar os logs, execute: docker compose logs -f"
echo "Para parar o ambiente, execute: docker compose down" 