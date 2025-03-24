# Lista de Tarefas e Próximos Passos

Este documento unifica as tarefas pendentes e os próximos passos para o projeto Innerview Ilhabela, organizados por prioridade e área.

## Conclusão da Fase 4 de Validação e Otimização

### Tarefas de Alta Prioridade

1. **Corrigir erros de sintaxe após remoção de importações**
   - [x] Resolver problemas em `src/application/mappers/equipe.mapper.ts`
   - [x] Resolver problemas em `src/application/mappers/reuniao.mapper.ts`
   - [x] Resolver problemas em `src/application/use-cases/usuario/gerenciar-usuario.use-case.ts`
   - [x] Resolver problemas em `src/infra/repositories/estudante.repository.ts`
   - [ ] Resolver problemas em outros arquivos afetados (total: 14 arquivos)

2. **Atualizar configuração do TypeScript**
   - [x] Ajustar `tsconfig.eslint.json` para incluir corretamente arquivos `.d.ts`
   - [x] Verificar compatibilidade da versão do TypeScript com ESLint

3. **Finalizar scripts de automação**
   - [x] Implementar script para identificar interfaces que não seguem padrão de nomenclatura
   - [x] Aplicar script de correção de interfaces em mapeadores e casos de uso
   - [x] Aplicar script de correção em DTOs de domínio
   - [x] Melhorar script de remoção de importações não utilizadas para lidar com problemas de formatação

### Tarefas de Média Prioridade

1. **Expandir automação para construtores em outras áreas**
   - [x] Aplicar script de remoção de construtores em controllers
   - [ ] Aplicar script de remoção de construtores em services
   - [x] Documentar resultados da remoção

2. **Melhorar integração Prettier/ESLint**
   - [x] Revisar e alinhar configurações do Prettier e ESLint
   - [x] Resolver problema com comando `format` não modificando arquivos
   - [x] Criar script para formatação e validação em um único comando

3. **Complementar documentação técnica**
   - [x] Atualizar guia de tipagem com novas práticas e estrutura
   - [x] Criar guia de desenvolvimento específico para repositórios Prisma
   - [x] Documentar processo de geração e uso de aliases para interfaces padronizadas

### Novas Tarefas Identificadas

1. **Lidar com erros de formatação**
   - [x] Investigar e corrigir problemas de indentação no arquivo `src/application/mappers/reuniao.mapper.ts`
   - [ ] Implementar regras de formatação consistentes para ternários aninhados
   - [x] Adicionar verificação de formatação no pre-commit

2. **Melhorar TypeScript para classes de domínio**
   - [ ] Refatorar interfaces que usam tipos como `string` para enums correspondentes
   - [ ] Implementar tipagem explícita para métodos estáticos das entidades
   - [ ] Adicionar validação de tipos em runtime com Zod

3. **Resolver erros de tipo persistentes**
   - [x] Corrigir erros de tipo em `GerenciarUsuarioUseCase` relacionados a `IJwtService` 
   - [x] Resolver problemas de imports em `EstudanteRepository`
   - [x] Padronizar interfaces e métodos nos repositórios de intervenção
   - [ ] Padronizar uso de tipos nos métodos das entidades de domínio

## Melhorias nos Repositórios Prisma

### Implementações Pendentes

| Repositório | Estado Atual | Próximo Marco | Prioridade |
|-------------|--------------|--------------|------------|
| PrismaUsuarioRepository | 100% | Manutenção | Baixa |
| PrismaIntervencaoRepository | 100% | Manutenção | Baixa |
| PrismaReuniaoRepository | 100% | Manutenção | Baixa |
| PrismaRelatorioRepository | 100% | Manutenção | Baixa |

### Otimizações Gerais

1. **Melhoria de Performance**
   - [ ] Otimizar consultas complexas envolvendo múltiplos relacionamentos
   - [ ] Implementar estratégias de paginação para grandes conjuntos de dados
   - [ ] Revisar índices no banco de dados para consultas frequentes

2. **Refinamento de Tipagem**
   - [x] Substituir usos de `any` remanescentes nos mapeadores principais
   - [x] Atualizar interfaces dos repositórios para incluir todos os métodos utilizados
   - [ ] Melhorar tipagem para argumentos de consultas Prisma
   - [ ] Implementar validação em runtime com Zod para complementar tipagem estática

## Melhorias na Arquitetura

### Curto Prazo

1. **Ampliação de Testes**
   - [x] Aumentar cobertura de testes unitários para repositórios
   - [x] Implementar testes unitários para mapeadores (100% completo)
   - [ ] Implementar testes de integração para fluxos críticos
   - [ ] Adicionar testes e2e para principais endpoints

2. **Otimização de Desempenho**
   - [ ] Implementar estratégias de cache para dados frequentemente acessados
   - [ ] Revisar e otimizar consultas N+1
   - [ ] Analisar e melhorar tempo de resposta de endpoints críticos

### Médio Prazo

1. **Monitoramento e Observabilidade**
   - [ ] Implementar logging estruturado em todo o sistema
   - [ ] Adicionar métricas de desempenho para operações críticas
   - [ ] Configurar alertas para comportamentos anômalos

2. **Evolução da API**
   - [ ] Considerar migração para tRPC ou GraphQL para tipagem end-to-end
   - [ ] Implementar versionamento da API
   - [ ] Melhorar documentação da API com exemplos e casos de uso

### Longo Prazo

1. **Infraestrutura e DevOps**
   - [ ] Implementar CI/CD completo para implantação automatizada
   - [ ] Configurar ambientes de staging e produção com promoção controlada
   - [ ] Implementar estratégia de backup e recuperação de dados

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
   - [ ] Simplificar lógica complexa em casos de uso extensos
   - [ ] Padronizar tratamento de erros em toda a aplicação
   - [ ] Revisar e melhorar nomenclatura para consistência

## Próximos Passos Imediatos

Para avançar com o projeto, recomendamos focar nas seguintes tarefas imediatas:

1. **Completar Ampliação de Testes (Prioridade Alta)**
   - [x] Implementar testes para os mapeadores (100% completo)
   - [x] Implementar testes para o caso de uso AutenticarUsuarioUseCase
   - [x] Implementar testes para o caso de uso CriarEquipeUseCase
   - [x] Implementar testes para o caso de uso GerenciarIntervencaoUseCase
   - [ ] Expandir testes de integração para cobrir fluxos completos
   - [ ] Adicionar testes end-to-end para cenários críticos

2. **Iniciar Otimizações de Desempenho (Prioridade Média)**
   - [ ] Implementar paginação em endpoints que retornam grandes conjuntos de dados
   - [ ] Otimizar consultas que envolvem múltiplos relacionamentos
   - [ ] Adicionar cache para dados frequentemente acessados

3. **Continuar Melhorias na Tipagem (Prioridade Média)**
   - [x] Corrigir incompatibilidade nas interfaces de repositórios
   - [ ] Refatorar interfaces que usam tipos primitivos para tipos mais específicos
   - [ ] Adicionar validação em runtime com Zod
   - [ ] Padronizar uso de tipos nas entidades de domínio

## Testes Unitários para Mapeadores

- [x] Implementar testes para mapeadores (EstudanteMapper, UsuarioMapper, EquipeMapper, ReuniaoMapper)
- [x] Implementar testes para mapeadores (IntervencaoMapper, AvaliacaoMapper)
- [x] Implementar testes para mapeadores restantes (RelatorioMapper)

## Testes Unitários para Casos de Uso

- [x] Implementar testes para o caso de uso AutenticarUsuarioUseCase
- [x] Implementar testes para o caso de uso CriarEquipeUseCase
- [x] Implementar testes para o caso de uso GerenciarIntervencaoUseCase
- [ ] Implementar testes para o caso de uso GerenciarEstudanteUseCase
- [ ] Implementar testes para o caso de uso GerenciarAvaliacaoUseCase
- [ ] Implementar testes para outros casos de uso prioritários 