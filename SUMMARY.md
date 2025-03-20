# Resumo do Projeto Innerview Ilhabela

## Visão Geral

O Innerview Ilhabela é um sistema educacional para acompanhamento e intervenção personalizada de estudantes, focando especialmente em alunos com dificuldades de aprendizagem. O sistema possibilita que equipes multidisciplinares colaborem no diagnóstico, planejamento e acompanhamento de intervenções educacionais.

## Histórico de Desenvolvimento

O desenvolvimento do projeto seguiu uma abordagem incremental e baseada em domínio:

1. **Configuração da Infraestrutura**
   - Setup do ambiente Docker com Node.js, TypeScript, MySQL e Redis
   - Configuração do Prisma ORM para migrações e acesso ao banco
   - Estruturação do projeto seguindo Clean Architecture

2. **Implementação do Core de Domínio**
   - Desenvolvimento das entidades de domínio: Usuário, Estudante, Dificuldade, Intervenção, Equipe
   - Implementação de regras de negócio e validações
   - Desenvolvimento de testes unitários para cada entidade

3. **Camada de Aplicação**
   - Implementação de casos de uso para cada funcionalidade principal
   - Desenvolvimento do controle de autenticação e autorização
   - Implementação de serviços de suporte (criptografia, logging, etc.)

4. **Infraestrutura de Persistência**
   - Implementação do esquema do banco de dados com Prisma
   - Desenvolvimento de repositórios para persistência de dados
   - Implementação do padrão Unit of Work para gerenciamento de transações

5. **Interface da API**
   - Desenvolvimento de controladores REST para exposição dos casos de uso
   - Implementação de middleware para autenticação e validação
   - Criação de rotas e endpoints organizados por recursos

## Componentes Principais

### Módulo de Usuários
- **Entidades**: Usuario, UsuarioInstituicao
- **Casos de Uso**: Registro, Autenticação, Atualização de Perfil, Controle de Acesso
- **Repositórios**: UsuarioRepository, UsuarioInstituicaoRepository
- **Controllers**: UsuarioController com endpoints para CRUD e autenticação

### Módulo de Estudantes
- **Entidades**: Estudante, Avaliacao, EstudanteDificuldade
- **Casos de Uso**: Cadastro, Avaliação, Associação de Dificuldades, Recomendação de Intervenções
- **Repositórios**: EstudanteRepository, AvaliacaoRepository
- **Controllers**: EstudanteController com endpoints para gerenciamento

### Módulo de Dificuldades de Aprendizagem
- **Entidades**: DificuldadeAprendizagem
- **Casos de Uso**: Cadastro, Classificação, Associação a Estudantes
- **Repositórios**: DificuldadeRepository
- **Controllers**: DificuldadeController para gerenciamento de dificuldades

### Módulo de Intervenções
- **Entidades**: Intervencao, IntervencaoBase, ProgressoIntervencao
- **Casos de Uso**: Criação, Acompanhamento, Avaliação de Eficácia
- **Repositórios**: IntervencaoRepository
- **Controllers**: IntervencaoController para operações CRUD e acompanhamento

### Módulo de Equipes
- **Entidades**: Equipe, MembroEquipe, EstudanteEquipe
- **Casos de Uso**: Gestão de Equipes, Membros e Associação de Estudantes
- **Repositórios**: EquipeRepository
- **Controllers**: EquipeController para gerenciamento de equipes

### Módulo de Reuniões
- **Entidades**: Reuniao, ParticipanteReuniao, Encaminhamento
- **Casos de Uso**: Agendamento, Gestão de Participantes, Encaminhamentos
- **Repositórios**: ReuniaoRepository
- **Controllers**: ReuniaoController com endpoints para: 
  - Listar reuniões (todas, por equipe, por período, por status)
  - Obter detalhes de reuniões com participantes e encaminhamentos
  - Criar novas reuniões com participantes
  - Gerenciar presenças

## Arquitetura

O projeto implementa Clean Architecture com as seguintes camadas:

1. **Domain**
   - Entidades: Classes que representam objetos do domínio com lógica de negócio encapsulada
   - Interfaces de Repositório: Contratos para persistência de dados
   - Value Objects: Objetos imutáveis que representam conceitos do domínio

2. **Application**
   - Casos de Uso: Implementações das regras de negócio da aplicação
   - DTOs: Objetos de transferência de dados entre camadas
   - Interfaces de Serviços: Contratos para serviços externos e infraestrutura

3. **Infrastructure**
   - Implementações de Repositórios: Usando Prisma para acesso ao banco de dados
   - Serviços Externos: Implementações de serviços como criptografia, email, etc.
   - Configuração: Setup de banco de dados, cache e outros recursos

4. **Interfaces**
   - Controllers: Adaptadores para API REST
   - Middlewares: Componentes para processamento de requisições
   - Rotas: Definição de endpoints da API
   - Validação de Input: Esquemas e validadores de dados de entrada

## Padrões de Design Implementados

- **Repository Pattern**: Abstração da persistência de dados
- **Unit of Work**: Gerenciamento de transações
- **Dependency Injection**: Usando tsyringe para injeção de dependências
- **DTO (Data Transfer Objects)**: Para transferência de dados entre camadas
- **Factory Method**: Para criação de entidades
- **Strategy Pattern**: Para implementação de diferentes estratégias de autenticação e validação
- **Middleware Chain**: Para processamento de requisições HTTP

## Tecnologias Utilizadas

- **Backend**: Node.js com TypeScript
- **ORM**: Prisma
- **Banco de Dados**: MySQL 8
- **Cache**: Redis
- **Autenticação**: JWT (JSON Web Tokens)
- **Criptografia**: Bcrypt
- **Logging**: Winston
- **Testes**: Jest
- **Containerização**: Docker e Docker Compose

## Próximos Passos

1. Implementação de mais testes (integração e e2e)
2. Melhoria na documentação da API
3. Implementação de monitoramento e métricas
4. Desenvolvimento de dashboard para visualização de dados
5. Integração com sistemas externos (LMS, SIS, etc.)
6. Implementação de relatórios e análise de dados 

## Configurações Adicionais

- **JWT**:
  - **Secret**: `sua_chave_secreta_aqui`
  - **Expiração**: `1d`

- **Redis**:
  - **Host**: `localhost`
  - **Porta**: `6379`
  - **Senha**: `(vazio)`
  - **Prefixo de Chaves**: `innerview:`

- **Storage**:
  - **Driver**: `local`
  - **URL da API**: `http://localhost:3333`

- **External APIs**:
  - **LMS**:
    - **URL**: `http://seu-lms.com/api`
    - **Chave**: `sua_chave_api_lms`
    - **Timeout**: `5000`

  - **SIS**:
    - **URL**: `http://seu-sis.com/api`
    - **Chave**: `sua_chave_api_sis`
    - **Timeout**: `5000`

mkdir -p tmp uploads logs 

docker-compose -f docker-compose.test.yml up -d 

# Todos os testes
npm test

# Apenas testes unitários
npm run test:unit

# Apenas testes de integração
npm run test:integration

# Com cobertura
npm run test:coverage 