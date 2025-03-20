# Innerview Ilhabela

![CI/CD](https://github.com/innerview-ilhabela/backend/actions/workflows/ci-cd.yml/badge.svg)
[![codecov](https://codecov.io/gh/innerview-ilhabela/backend/branch/main/graph/badge.svg)](https://codecov.io/gh/innerview-ilhabela/backend)

Sistema educacional para acompanhamento e intervenção personalizada de estudantes, focando especialmente em alunos com dificuldades de aprendizagem.

## Visão Geral

O Innerview Ilhabela possibilita que equipes multidisciplinares colaborem no diagnóstico, planejamento e acompanhamento de intervenções educacionais. O sistema foi desenvolvido seguindo os princípios de Clean Architecture e Domain-Driven Design.

## Principais Funcionalidades

- Cadastro e gestão de estudantes e suas dificuldades de aprendizagem
- Planejamento e acompanhamento de intervenções
- Gestão de equipes multidisciplinares
- Avaliação de progresso acadêmico
- Recomendações baseadas em machine learning
- Relatórios e dashboards analíticos

## Tecnologias

- **Backend**: Node.js com TypeScript
- **ORM**: Prisma
- **Banco de Dados**: MySQL 8
- **Cache**: Redis
- **Autenticação**: JWT
- **CI/CD**: GitHub Actions

## Começando

### Pré-requisitos

- Node.js 18+
- Docker e Docker Compose

### Instalação

1. Clone o repositório
   ```bash
   git clone https://github.com/innerview-ilhabela/backend.git
   cd innerview-ilhabela
   ```

2. Instale as dependências
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente
   ```bash
   cp .env.example .env
   # Edite o arquivo .env com suas configurações
   ```

4. Inicie os containers de serviços
   ```bash
   docker-compose up -d
   ```

5. Execute as migrações do banco de dados
   ```bash
   npx prisma migrate dev
   ```

6. Inicie o servidor de desenvolvimento
   ```bash
   npm run dev
   ```

## Testes

```bash
# Executar todos os testes
npm test

# Apenas testes unitários
npm run test:unit

# Apenas testes de integração
npm run test:integration

# Com cobertura
npm run test:coverage
```

## Estrutura do Projeto

O projeto segue a arquitetura Clean Architecture com as seguintes camadas:

- **Domain**: Entidades e regras de negócio
- **Application**: Casos de uso e serviços de aplicação
- **Infrastructure**: Implementações de repositórios e serviços externos
- **Interfaces**: Controladores e rotas da API

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/amazing-feature`)
3. Commit suas mudanças (`git commit -m 'Add some amazing feature'`)
4. Push para a branch (`git push origin feature/amazing-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## Contato

Equipe Innerview Ilhabela - contato@innerview-ilhabela.com.br 