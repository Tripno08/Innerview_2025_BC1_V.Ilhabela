# Planejamento do Frontend - Innerview Ilhabela

**Data de criação**: 25/03/2024  
**Última atualização**: 25/03/2024

## 1. Visão Geral

Este documento detalha o planejamento para o desenvolvimento do frontend do projeto Innerview Ilhabela, definindo a arquitetura, componentes principais, fluxos de trabalho e cronograma de implementação. O frontend será desenvolvido utilizando React, TypeScript e Material UI, seguindo princípios de design responsivo, acessibilidade e usabilidade.

## 2. Arquitetura e Estrutura

### 2.1 Tecnologias Selecionadas

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| React | 18.x | Framework principal |
| TypeScript | 5.x | Tipagem estática |
| Material UI | 5.x | Sistema de design e componentes |
| React Router | 6.x | Roteamento |
| React Query | 4.x | Gerenciamento de estado do servidor |
| Context API | - | Gerenciamento de estado local |
| Axios | 1.x | Cliente HTTP |
| Vitest | 0.30.x | Framework de testes |
| Storybook | 7.x | Documentação de componentes |

### 2.2 Estrutura de Diretórios

```
src/
├── assets/          # Recursos estáticos (imagens, ícones, etc.)
├── components/      # Componentes reutilizáveis
│   ├── common/      # Componentes básicos (botões, inputs, etc.)
│   ├── layout/      # Componentes de layout
│   ├── forms/       # Componentes de formulário
│   └── data/        # Componentes de visualização de dados
├── context/         # Contextos React
├── hooks/           # Hooks personalizados
├── pages/           # Páginas da aplicação
│   ├── dashboard/
│   ├── estudantes/
│   ├── intervencoes/
│   ├── equipes/
│   ├── reunioes/
│   ├── dificuldades/
│   └── auth/
├── services/        # Serviços de comunicação com a API
│   ├── api/         # Cliente e configurações da API
│   ├── auth/        # Serviços de autenticação
│   └── [módulos]/   # Serviços específicos para cada módulo
├── types/           # Definições de tipos
├── utils/           # Funções utilitárias
├── routes/          # Configuração de rotas
└── theme/           # Configuração do tema Material UI
```

## 3. Componentes Principais

### 3.1 Sistema de Layout

| Componente | Descrição | Prioridade |
|------------|-----------|------------|
| `AppLayout` | Layout principal da aplicação | Alta |
| `Sidebar` | Navegação lateral | Alta |
| `AppHeader` | Cabeçalho com informações do usuário | Alta |
| `NotificationCenter` | Centro de notificações | Média |
| `Breadcrumbs` | Navegação contextual | Média |

### 3.2 Componentes de Formulário

| Componente | Descrição | Prioridade |
|------------|-----------|------------|
| `FormField` | Campo de formulário base | Alta |
| `FormSection` | Seção de formulário | Alta |
| `DynamicForm` | Formulário dinâmico baseado em schema | Média |
| `SearchField` | Campo de busca com autocomplete | Alta |
| `FilterBar` | Barra de filtros | Alta |

### 3.3 Componentes de Dados

| Componente | Descrição | Prioridade |
|------------|-----------|------------|
| `DataTable` | Tabela de dados com paginação | Alta |
| `DataCard` | Card para exibição de dados | Alta |
| `DetailView` | Visualização detalhada | Alta |
| `StatusBadge` | Badge de status | Média |
| `MetricsCard` | Card de métricas | Alta |
| `Charts` | Componentes de gráficos | Média |

### 3.4 Componentes Específicos

| Componente | Descrição | Prioridade |
|------------|-----------|------------|
| `EstudanteForm` | Formulário de estudante | Alta |
| `EstudanteCard` | Card de estudante | Alta |
| `IntervencoesTimeline` | Linha do tempo de intervenções | Média |
| `EquipeMembros` | Visualização de membros da equipe | Média |
| `ReuniaoCalendar` | Calendário de reuniões | Baixa |
| `DificuldadesFilter` | Filtro de dificuldades | Baixa |

## 4. Fluxos Principais

### 4.1 Autenticação

1. Login
2. Recuperação de senha
3. Gerenciamento de sessão
4. Logout

### 4.2 Gestão de Estudantes

1. Listagem de estudantes
2. Criação/Edição de estudante
3. Visualização detalhada
4. Associação com dificuldades
5. Visualização de histórico

### 4.3 Intervenções

1. Listagem de intervenções
2. Criação/Edição de intervenção
3. Acompanhamento de progresso
4. Visualização de métricas

### 4.4 Dashboard

1. Visão geral de métricas
2. Alertas e notificações
3. Atividades recentes
4. Estudantes em acompanhamento

## 5. Cronograma de Implementação

### 5.1 Fase 1: Fundação (Semana 1-2)

| Tarefa | Estimativa | Dependências | Status |
|--------|------------|--------------|--------|
| Setup inicial do projeto | 8h | - | ✅ Concluído |
| Implementação do tema e design system | 16h | Setup | 🟡 Em andamento |
| Componentes básicos e layout | 24h | Design system | 🟡 Em andamento |
| Implementação de rotas | 8h | Layout | ⚪ Não iniciado |
| Configuração de autenticação | 16h | Rotas | ⚪ Não iniciado |

### 5.2 Fase 2: Funcionalidades Essenciais (Semana 3-4)

| Tarefa | Estimativa | Dependências | Status |
|--------|------------|--------------|--------|
| Dashboard inicial | 24h | Layout | ⚪ Não iniciado |
| Listagem de estudantes | 16h | Componentes básicos | ⚪ Não iniciado |
| Detalhes de estudante | 16h | Listagem de estudantes | ⚪ Não iniciado |
| Formulário de estudante | 24h | Componentes de formulário | ⚪ Não iniciado |
| Listagem de intervenções | 16h | Componentes básicos | ⚪ Não iniciado |

### 5.3 Fase 3: Expansão (Semana 5-6)

| Tarefa | Estimativa | Dependências | Status |
|--------|------------|--------------|--------|
| Detalhes de intervenção | 16h | Listagem de intervenções | ⚪ Não iniciado |
| Formulário de intervenção | 24h | Componentes de formulário | ⚪ Não iniciado |
| Listagem de equipes | 16h | Componentes básicos | ⚪ Não iniciado |
| Detalhes de equipe | 16h | Listagem de equipes | ⚪ Não iniciado |
| Gestão de membros de equipe | 24h | Detalhes de equipe | ⚪ Não iniciado |

### 5.4 Fase 4: Completude (Semana 7-8)

| Tarefa | Estimativa | Dependências | Status |
|--------|------------|--------------|--------|
| Listagem de reuniões | 16h | Componentes básicos | ⚪ Não iniciado |
| Detalhes de reunião | 16h | Listagem de reuniões | ⚪ Não iniciado |
| Agendamento de reunião | 24h | Componentes de formulário | ⚪ Não iniciado |
| Catálogo de dificuldades | 16h | Componentes básicos | ⚪ Não iniciado |
| Associação de dificuldades | 16h | Catálogo de dificuldades | ⚪ Não iniciado |

## 6. Testes e Qualidade

### 6.1 Testes Unitários

- Componentes básicos e hooks: 90% de cobertura
- Lógica de negócio: 80% de cobertura
- Utilitários: 95% de cobertura

### 6.2 Testes de Integração

- Fluxos principais de navegação
- Integração com a API
- Formulários e validações

### 6.3 Documentação de Componentes

- Storybook para todos os componentes reutilizáveis
- Documentação de uso e exemplos
- Variações de cada componente

## 7. Integração com o Backend

### 7.1 Pontos de Integração

| Endpoint | Status Frontend | Status Backend |
|----------|----------------|----------------|
| `/auth` | 🟡 Em andamento | ✅ Concluído |
| `/estudantes` | ⚪ Não iniciado | ✅ Concluído |
| `/intervencoes` | ⚪ Não iniciado | 🟡 Em andamento |
| `/equipes` | ⚪ Não iniciado | 🟡 Em andamento |
| `/reunioes` | ⚪ Não iniciado | ⚪ Não iniciado |
| `/dificuldades` | ⚪ Não iniciado | ✅ Concluído |

### 7.2 Tipos Compartilhados

- Criação de tipos TypeScript baseados nas interfaces do backend
- Automatização da geração de tipos a partir da documentação OpenAPI
- Validação de tipos em runtime com Zod

## 8. Priorização para MVP (10/04/2024)

Para o MVP, focaremos nas seguintes funcionalidades:

1. **Autenticação completa**
   - Login/logout
   - Proteção de rotas
   - Gerenciamento de sessão

2. **Dashboard inicial**
   - Métricas principais
   - Estudantes recentes
   - Alertas importantes

3. **Gestão de Estudantes**
   - Listagem com filtros
   - Visualização detalhada
   - Formulário básico

4. **Visualização de Intervenções**
   - Listagem de intervenções
   - Detalhes básicos

## 9. Considerações de UX/UI

- Design responsivo para desktop, tablet e mobile
- Acessibilidade (WCAG 2.1 AA)
- Tema claro/escuro
- Feedback visual para ações
- Tempos de carregamento otimizados
- Estados de loading, erro e vazio para listas

## 10. Monitoramento e Analytics

- Implementação de logging de eventos
- Rastreamento de erros do cliente
- Métricas de desempenho
- Comportamento do usuário

## 11. Próximos Passos Imediatos

1. Finalizar componentes de layout e navegação
2. Implementar fluxo completo de autenticação
3. Desenvolver tela de listagem de estudantes
4. Criar dashboard inicial com métricas básicas

## 12. Responsáveis e Comunicação

- **Frontend Lead**: [Nome do Responsável]
- **Designer**: [Nome do Responsável]
- **Backend Integration**: [Nome do Responsável]
- **QA**: [Nome do Responsável]

Reuniões de alinhamento semanais às segundas-feiras, 10h.
Revisão de código obrigatória para todas as features. 