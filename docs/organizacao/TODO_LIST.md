# Lista de Tarefas e Próximos Passos

Este documento unifica as tarefas pendentes e os próximos passos para o projeto Innerview Ilhabela, organizados por prioridade e área.

## Backend - Conclusão da Versão 1.0

### Tarefas Prioritárias (Bloqueantes para o Frontend)

1. **Finalizar padronização do módulo de Reuniões**
   - [x] Atualizar `RegistrarPresencaReuniaoUseCase` para usar `IRegistrarPresencaDTO`
   - [x] Atualizar `AdicionarEncaminhamentoReuniaoUseCase` para usar `IAdicionarEncaminhamentoDTO`
   - [x] Atualizar `AtualizarEncaminhamentoReuniaoUseCase` para usar `IAtualizarEncaminhamentoDTO`
   - [x] Verificar e atualizar o `ReuniaoMapper` para usar interfaces padronizadas

2. **Documentar API para integração com Frontend**
   - [x] Criar estrutura inicial de documentação da API
   - [x] Documentar padrões gerais da API (formato de requisição/resposta, paginação, etc.)
   - [x] Documentar endpoints de dificuldades como modelo para os demais
   - [x] Documentar endpoints de autenticação
   - [x] Documentar endpoints de estudantes
   - [x] Documentar endpoints de usuários
   - [ ] Documentar endpoints de equipes
   - [ ] Documentar endpoints de intervenções
   - [ ] Documentar endpoints de reuniões
   - [ ] Gerar documentação OpenAPI atualizada

3. **Implementar testes de integração essenciais**
   - [x] Testes para fluxos principais de Reuniões
   - [x] Testes para fluxos principais de Equipes
   - [x] Testes para fluxos principais de Dificuldades
   - [ ] Expandir testes de Estudantes
   
### Tarefas de Média Prioridade

1. **Resolver erros de sintaxe após remoção de importações**
   - [x] Resolver problemas em `src/application/mappers/equipe.mapper.ts`
   - [x] Resolver problemas em `src/application/mappers/reuniao.mapper.ts`
   - [x] Resolver problemas em `src/application/use-cases/usuario/gerenciar-usuario.use-case.ts`
   - [x] Resolver problemas em `src/infra/repositories/estudante.repository.ts`
   - [x] Resolver problemas em outros arquivos afetados (total: 14 arquivos)

2. **Finalizar configuração de CI/CD**
   - [x] Configurar pipeline de testes automatizados
   - [x] Configurar pipeline de deploy para ambiente de desenvolvimento
   - [x] Implementar verificação de cobertura de testes
   - [x] Adicionar notificações de falha

3. **Ampliação de Testes**
   - [ ] Implementar testes para o caso de uso GerenciarEstudanteUseCase
   - [ ] Implementar testes para o caso de uso GerenciarAvaliacaoUseCase
   - [x] Implementar testes para o caso de uso GerenciarDificuldadeUseCase
   - [ ] Implementar testes para outros casos de uso prioritários

4. **Correção de problemas de tipos em testes**
   - [x] Corrigir problemas de tipo em testes de integração para Reuniões
   - [x] Corrigir problemas de tipo em testes de integração para Equipes
   - [ ] Corrigir problemas de tipo em testes de Estudante
   - [ ] Corrigir problemas de tipo em testes de Usuário
   - [ ] Corrigir inconsistências entre mocks e interfaces reais

### Tarefas de Baixa Prioridade

1. **Otimizações de Desempenho**
   - [x] Implementar paginação em endpoints que retornam grandes conjuntos de dados
   - [ ] Otimizar consultas que envolvem múltiplos relacionamentos
   - [ ] Adicionar cache para dados frequentemente acessados

2. **Melhorar TypeScript para classes de domínio**
   - [x] Refatorar interfaces que usam tipos como `string` para enums correspondentes
   - [x] Implementar tipagem explícita para métodos estáticos das entidades
   - [ ] Adicionar validação de tipos em runtime com Zod

3. **Resolver erros de tipo persistentes**
   - [x] Padronizar uso de tipos nos métodos das entidades de domínio
   - [ ] Implementar regras de formatação consistentes para ternários aninhados

## Frontend - Desenvolvimento Inicial

### Tarefas de Configuração (Alta Prioridade)

1. **Setup Inicial do Projeto**
   - [x] Criar projeto React com TypeScript
   - [x] Configurar ferramentas de linting/formatação
   - [x] Configurar gerenciamento de estado
   - [x] Configurar sistema de roteamento
   - [x] Implementar biblioteca de UI (Material UI)

2. **Integração com Backend**
   - [x] Implementar cliente HTTP para comunicação com a API
   - [x] Configurar interceptores para tratamento de tokens
   - [ ] Implementar gerenciamento de autenticação
   - [ ] Criar tipos TypeScript baseados nas interfaces do backend

3. **Layout e Componentes Base**
   - [x] Criar layout principal da aplicação
   - [ ] Implementar componentes de navegação
   - [ ] Implementar sistema de autenticação e autorização no frontend
   - [ ] Criar componentes reutilizáveis (tabelas, formulários, modais)

### Desenvolvimento de Funcionalidades (Média Prioridade)

1. **Dashboard e Visão Geral**
   - [ ] Implementar dashboard com métricas principais
   - [ ] Criar visualização de alertas e notificações
   - [ ] Implementar filtros e controles de visualização
   - [ ] Adicionar gráficos e visualizações de dados

2. **Módulo de Estudantes**
   - [ ] Implementar listagem de estudantes
   - [ ] Criar formulários para cadastro/edição
   - [ ] Implementar visualização detalhada do estudante
   - [ ] Adicionar funcionalidades de associação com dificuldades

3. **Módulo de Intervenções**
   - [ ] Implementar listagem de intervenções
   - [ ] Criar visualização de detalhes da intervenção
   - [ ] Implementar acompanhamento de progresso
   - [ ] Adicionar funcionalidades de recomendação

4. **Módulo de Equipes**
   - [ ] Implementar listagem e gerenciamento de equipes
   - [ ] Criar interface para adicionar/remover membros
   - [ ] Implementar visualização de detalhes da equipe
   - [ ] Integrar com módulo de estudantes

### Módulos Adicionais (Baixa Prioridade)

1. **Módulo de Reuniões**
   - [ ] Implementar agendamento de reuniões
   - [ ] Criar interface para registro de presenças
   - [ ] Implementar gerenciamento de encaminhamentos
   - [ ] Adicionar visualização de histórico

2. **Módulo de Dificuldades**
   - [ ] Implementar catálogo de dificuldades
   - [ ] Criar interface para associação com estudantes
   - [ ] Implementar visualização de estatísticas
   - [ ] Adicionar funcionalidades de filtro e busca

3. **Módulo de Relatórios**
   - [ ] Implementar geração de relatórios customizáveis
   - [ ] Criar visualizações para diferentes tipos de relatório
   - [ ] Adicionar funcionalidades de exportação (PDF, Excel)
   - [ ] Implementar agendamento de relatórios recorrentes

## Testes e Qualidade

### Frontend

1. **Testes Unitários**
   - [x] Configurar ambiente de testes (Vitest)
   - [ ] Implementar testes para componentes principais
   - [ ] Testar hooks e utilidades
   - [ ] Configurar relatórios de cobertura

2. **Testes de Integração**
   - [ ] Testar fluxos principais de navegação
   - [ ] Testar integrações com a API
   - [ ] Verificar comportamento de formulários

3. **Documentação de Componentes**
   - [x] Configurar Storybook
   - [ ] Documentar componentes reutilizáveis
   - [ ] Criar histórias para variações de componentes
   - [ ] Adicionar guias de uso e exemplos

### Backend

1. **Testes End-to-End**
   - [x] Implementar testes E2E para fluxos críticos
   - [x] Configurar ambiente de teste automatizado
   - [ ] Testar integrações entre módulos

## Melhorias nos Repositórios Prisma

### Implementações Pendentes

| Repositório | Estado Atual | Próximo Marco | Prioridade |
|-------------|--------------|--------------|------------|
| PrismaUsuarioRepository | 100% | Manutenção | Baixa |
| PrismaIntervencaoRepository | 100% | Manutenção | Baixa |
| PrismaReuniaoRepository | 100% | Manutenção | Baixa |
| PrismaRelatorioRepository | 100% | Manutenção | Baixa |
| PrismaDificuldadeRepository | 100% | Manutenção | Baixa |

### Otimizações Gerais

1. **Melhoria de Performance**
   - [x] Otimizar consultas complexas envolvendo múltiplos relacionamentos
   - [x] Implementar estratégias de paginação para grandes conjuntos de dados
   - [x] Revisar índices no banco de dados para consultas frequentes

2. **Refinamento de Tipagem**
   - [x] Substituir usos de `any` remanescentes nos mapeadores principais
   - [x] Atualizar interfaces dos repositórios para incluir todos os métodos utilizados
   - [x] Melhorar tipagem para argumentos de consultas Prisma
   - [ ] Implementar validação em runtime com Zod para complementar tipagem estática

## Melhorias na Arquitetura

### Curto Prazo

1. **Ampliação de Testes**
   - [x] Aumentar cobertura de testes unitários para repositórios
   - [x] Implementar testes unitários para mapeadores (100% completo)
   - [x] Implementar testes de integração para fluxos críticos
   - [ ] Adicionar testes e2e para principais endpoints

2. **Otimização de Desempenho**
   - [x] Implementar estratégias de cache para dados frequentemente acessados
   - [x] Revisar e otimizar consultas N+1
   - [x] Analisar e melhorar tempo de resposta de endpoints críticos

### Médio Prazo

1. **Monitoramento e Observabilidade**
   - [x] Implementar logging estruturado em todo o sistema
   - [x] Adicionar métricas de desempenho para operações críticas
   - [x] Configurar alertas para comportamentos anômalos

2. **Evolução da API**
   - [ ] Considerar migração para tRPC ou GraphQL para tipagem end-to-end
   - [x] Implementar versionamento da API
   - [ ] Melhorar documentação da API com exemplos e casos de uso

### Longo Prazo

1. **Infraestrutura e DevOps**
   - [x] Implementar CI/CD completo para implantação automatizada
   - [x] Configurar ambientes de staging e produção com promoção controlada
   - [x] Implementar estratégia de backup e recuperação de dados

2. **Evolução da Arquitetura**
   - [ ] Avaliar migração para arquitetura de microserviços para módulos específicos
   - [ ] Considerar implementação de CQRS para operações complexas
   - [ ] Explorar event sourcing para rastreamento de mudanças em dados críticos

## Documentação e Manutenção

1. **Melhorias na Documentação**
   - [x] Criar guia de contribuição para novos desenvolvedores
   - [x] Documentar decisões arquiteturais e padrões adotados
   - [x] Criar documentação sobre uso de fixtures e factories para testes
   - [ ] Manter atualizada a documentação da API

2. **Refatorações Planejadas**
   - [x] Simplificar lógica complexa em casos de uso extensos
   - [x] Padronizar tratamento de erros em toda a aplicação
   - [x] Revisar e melhorar nomenclatura para consistência

## Próximos Passos Imediatos (Março-Abril 2024)

Para avançar com o projeto, recomendamos focar nas seguintes tarefas imediatas:

1. **Concluir Documentação da API (Prioridade Alta)**
   - [ ] Documentar endpoints de equipes
   - [ ] Documentar endpoints de intervenções
   - [ ] Documentar endpoints de reuniões
   - [ ] Gerar documentação OpenAPI atualizada
   - [ ] Criar portal de documentação para desenvolvedores

2. **Avançar no Desenvolvimento Frontend (Prioridade Alta)**
   - [ ] Completar componentes de navegação
   - [ ] Implementar fluxo completo de autenticação
   - [ ] Desenvolver módulo de Estudantes
   - [ ] Implementar visualizações de Dashboard

3. **Finalizar Testes (Prioridade Média)**
   - [ ] Concluir testes para GerenciarUsuarioUseCase
   - [ ] Expandir testes de integração para Estudantes
   - [ ] Implementar testes E2E para fluxos críticos
   - [ ] Garantir cobertura mínima de 75% em todos os módulos

## Testes Unitários para Mapeadores

- [x] Implementar testes para mapeadores (EstudanteMapper, UsuarioMapper, EquipeMapper, ReuniaoMapper)
- [x] Implementar testes para mapeadores (IntervencaoMapper, AvaliacaoMapper)
- [x] Implementar testes para mapeadores restantes (RelatorioMapper)
- [x] Implementar testes para mapeadores de dificuldades (DificuldadeMapper)

## Testes Unitários para Casos de Uso

- [x] Implementar testes para o caso de uso AutenticarUsuarioUseCase
- [x] Implementar testes para o caso de uso CriarEquipeUseCase
- [x] Implementar testes para o caso de uso GerenciarIntervencaoUseCase
- [x] Implementar testes para o caso de uso GerenciarDificuldadeUseCase
- [ ] Implementar testes para o caso de uso GerenciarEstudanteUseCase
- [ ] Implementar testes para o caso de uso GerenciarAvaliacaoUseCase
- [ ] Implementar testes para outros casos de uso prioritários 