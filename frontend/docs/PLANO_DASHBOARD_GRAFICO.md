# Plano de Implementação - Dashboard Gráfico de Evolução

## Visão Geral

O Dashboard Gráfico de Evolução tem como objetivo fornecer visualizações interativas dos dados de progresso dos estudantes, permitindo análises comparativas e identificação de tendências. Este documento detalha o plano de implementação, incluindo componentes, estrutura de dados e cronograma.

## Arquitetura Proposta

### Estrutura de Componentes

```
src/
├── features/
│   └── dashboard/
│       ├── components/
│       │   ├── ProgressChart.tsx          # Gráfico de evolução temporal
│       │   ├── PerformanceRadar.tsx       # Gráfico de radar para áreas
│       │   ├── ComparisonBarChart.tsx     # Gráfico de barras comparativo
│       │   ├── HeatmapCalendar.tsx        # Mapa de calor de atividades
│       │   ├── MetricCard.tsx             # Cartão de métrica com indicador
│       │   ├── ProgressIndicator.tsx      # Indicador de tendência
│       │   └── FilterControls.tsx         # Controles de filtro
│       │
│       ├── hooks/
│       │   ├── useMetrics.ts              # Hook para dados de métricas
│       │   ├── useStudentProgress.ts      # Hook para dados de progresso
│       │   ├── usePerformanceData.ts      # Hook para dados de desempenho
│       │   └── useComparisonData.ts       # Hook para dados comparativos
│       │
│       ├── utils/
│       │   ├── chartFormatters.ts         # Formatadores para gráficos
│       │   ├── dataTransformers.ts        # Transformação de dados
│       │   └── metricCalculators.ts       # Cálculos de métricas
│       │
│       └── pages/
│           ├── MainDashboard.tsx          # Dashboard principal
│           ├── StudentEvolutionPage.tsx   # Página de evolução do estudante
│           ├── PerformanceAnalysisPage.tsx # Análise de desempenho
│           └── InterventionImpactPage.tsx # Impacto das intervenções
```

### Estrutura de Dados

#### Modelo para Progresso do Estudante

```typescript
interface IStudentProgress {
  studentId: string;
  name: string;
  metrics: {
    period: string; // Ex: "2024-01", "2024-Q1"
    overallScore: number; // 0 a 100
    areas: {
      name: string; // Ex: "Matemática", "Leitura"
      score: number; // 0 a 100
      changeFromPrevious: number; // Percentual de mudança
    }[];
    interventions: {
      id: string;
      date: string;
      type: string;
      impact: number; // -100 a 100
    }[];
    activities: {
      date: string;
      count: number;
      completion: number; // 0 a 100
    }[];
  }[];
}
```

#### Modelo para Métricas de Dashboard

```typescript
interface IDashboardMetrics {
  currentPeriod: string;
  metrics: {
    name: string; // Nome da métrica
    value: number; // Valor atual
    previousValue: number; // Valor anterior
    changePercentage: number; // Mudança percentual
    trend: 'up' | 'down' | 'stable'; // Tendência
    goal?: number; // Meta, se aplicável
  }[];
  topPerformingAreas: {
    name: string;
    score: number;
    trend: 'up' | 'down' | 'stable';
  }[];
  improvementAreas: {
    name: string;
    score: number;
    potentialGain: number;
  }[];
}
```

## Implementação dos Componentes Principais

### 1. ProgressChart (Gráfico de Evolução)

```typescript
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '@mui/material/styles';

interface IProgressChartProps {
  data: {
    period: string;
    value: number;
    average?: number;
    goal?: number;
  }[];
  dataKeys: {
    name: string;
    key: string;
    color: string;
  }[];
  title?: string;
  height?: number;
}

export const ProgressChart: React.FC<IProgressChartProps> = ({
  data,
  dataKeys,
  title,
  height = 300,
}) => {
  const theme = useTheme();

  return (
    <div className="chart-container">
      {title && <h3 className="chart-title">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
          <XAxis dataKey="period" />
          <YAxis />
          <Tooltip />
          <Legend />
          {dataKeys && dataKeys.map((dk) => (
            <Line
              key={dk.key}
              type="monotone"
              dataKey={dk.key}
              name={dk.name}
              stroke={dk.color}
              activeDot={{ r: 8 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
```

### 2. PerformanceRadar (Gráfico de Radar)

```typescript
import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '@mui/material/styles';

interface IPerformanceRadarProps {
  data: {
    area: string;
    current: number;
    previous?: number;
    average?: number;
  }[];
  title?: string;
  height?: number;
}

export const PerformanceRadar: React.FC<IPerformanceRadarProps> = ({
  data,
  title,
  height = 300,
}) => {
  const theme = useTheme();

  return (
    <div className="chart-container">
      {title && <h3 className="chart-title">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke={theme.palette.divider} />
          <PolarAngleAxis dataKey="area" />
          <PolarRadiusAxis />
          <Radar
            name="Atual"
            dataKey="current"
            stroke={theme.palette.primary.main}
            fill={theme.palette.primary.main}
            fillOpacity={0.6}
          />
          {data[0]?.previous && (
            <Radar
              name="Anterior"
              dataKey="previous"
              stroke={theme.palette.secondary.main}
              fill={theme.palette.secondary.main}
              fillOpacity={0.6}
            />
          )}
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
```

### 3. MetricCard (Cartão de Métrica)

```typescript
import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

interface IMetricCardProps {
  title: string;
  value: number | string;
  previousValue?: number;
  changePercentage?: number;
  trend?: 'up' | 'down' | 'stable';
  format?: 'number' | 'percentage' | 'currency';
  prefix?: string;
  suffix?: string;
}

export const MetricCard: React.FC<IMetricCardProps> = ({
  title,
  value,
  previousValue,
  changePercentage,
  trend = 'stable',
  format = 'number',
  prefix = '',
  suffix = '',
}) => {
  const formatValue = (val: number | string) => {
    if (typeof val === 'string') return val;
    
    if (format === 'percentage') {
      return `${prefix}${val.toFixed(1)}${suffix || '%'}`;
    } else if (format === 'currency') {
      return `${prefix || 'R$'}${val.toFixed(2)}${suffix}`;
    }
    
    return `${prefix}${val}${suffix}`;
  };

  const renderTrendIcon = () => {
    if (trend === 'up') {
      return <TrendingUpIcon className="trend-icon trend-up" />;
    } else if (trend === 'down') {
      return <TrendingDownIcon className="trend-icon trend-down" />;
    }
    return <TrendingFlatIcon className="trend-icon trend-stable" />;
  };

  return (
    <Card className="metric-card">
      <CardContent>
        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" component="div" className="metric-value">
          {formatValue(value)}
        </Typography>
        
        {changePercentage !== undefined && (
          <Box display="flex" alignItems="center" className="metric-change">
            {renderTrendIcon()}
            <Typography
              variant="body2"
              className={`change-value ${trend}`}
            >
              {changePercentage > 0 ? '+' : ''}{changePercentage.toFixed(1)}%
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
```

## Integrações de API

### Endpoints Necessários

1. `/api/dashboard/metrics` - Retorna métricas resumidas do dashboard
2. `/api/students/:id/progress` - Retorna dados de progresso de um estudante
3. `/api/performance/areas` - Retorna dados de desempenho por área
4. `/api/interventions/impact` - Retorna dados de impacto das intervenções

### Hook de Exemplo para Busca de Dados

```typescript
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

export const useStudentProgress = (studentId: string, period?: string) => {
  return useQuery({
    queryKey: ['studentProgress', studentId, period],
    queryFn: async () => {
      const params = period ? { period } : {};
      const response = await api.get(`/api/students/${studentId}/progress`, { params });
      return response.data;
    },
    enabled: !!studentId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};
```

## Layout do Dashboard Principal

```typescript
import React, { useState } from 'react';
import { Box, Grid, Typography, Paper, Tabs, Tab } from '@mui/material';
import { MetricCard } from '../components/MetricCard';
import { ProgressChart } from '../components/ProgressChart';
import { PerformanceRadar } from '../components/PerformanceRadar';
import { ComparisonBarChart } from '../components/ComparisonBarChart';
import { HeatmapCalendar } from '../components/HeatmapCalendar';
import { FilterControls } from '../components/FilterControls';
import { useMetrics } from '../hooks/useMetrics';
import { useStudentProgress } from '../hooks/useStudentProgress';

export const MainDashboard: React.FC = () => {
  const [period, setPeriod] = useState('current');
  const [selectedTab, setSelectedTab] = useState(0);
  const { data: metrics, isLoading: metricsLoading } = useMetrics(period);
  const { data: progressData, isLoading: progressLoading } = useStudentProgress('all', period);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  if (metricsLoading || progressLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Dashboard de Evolução</Typography>
        <FilterControls period={period} onChangePeriod={setPeriod} />
      </Box>

      {/* Cartões de métricas */}
      <Grid container spacing={3} mb={4}>
        {metrics?.metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <MetricCard
              title={metric.name}
              value={metric.value}
              previousValue={metric.previousValue}
              changePercentage={metric.changePercentage}
              trend={metric.trend}
            />
          </Grid>
        ))}
      </Grid>

      {/* Tabs para diferentes visões */}
      <Paper sx={{ mb: 4 }}>
        <Tabs value={selectedTab} onChange={handleTabChange} variant="fullWidth">
          <Tab label="Evolução Geral" />
          <Tab label="Desempenho por Área" />
          <Tab label="Impacto de Intervenções" />
        </Tabs>

        {/* Conteúdo das tabs */}
        <Box p={3}>
          {selectedTab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <ProgressChart
                  data={progressData?.overallProgress || []}
                  dataKeys={[
                    { name: 'Pontuação', key: 'value', color: '#3f51b5' },
                    { name: 'Média', key: 'average', color: '#f50057' },
                    { name: 'Meta', key: 'goal', color: '#4caf50' },
                  ]}
                  title="Evolução da Pontuação Geral"
                />
              </Grid>
            </Grid>
          )}

          {selectedTab === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <PerformanceRadar
                  data={progressData?.areaPerformance || []}
                  title="Desempenho por Área"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <ComparisonBarChart
                  data={progressData?.areaComparison || []}
                  title="Comparação de Desempenho"
                />
              </Grid>
            </Grid>
          )}

          {selectedTab === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <HeatmapCalendar
                  data={progressData?.interventionData || []}
                  title="Mapa de Intervenções e Atividades"
                />
              </Grid>
            </Grid>
          )}
        </Box>
      </Paper>
    </Box>
  );
};
```

## Cronograma de Implementação Detalhado

| Fase | Tarefa | Subtarefas | Prazo Estimado | Responsável |
|------|--------|------------|----------------|-------------|
| 1    | **Preparação dos Dados** | Definir modelos de dados, Criar dados de exemplo, Preparar endpoints | 2 dias | Time de Backend |
| 2    | **Componentes Base** | Implementar cartões de métricas, Criar estrutura base do dashboard | 1 dia | Time de Frontend |
| 3    | **ProgressChart** | Implementar gráfico de linhas, Adicionar interatividade, Suporte a múltiplas séries | 1 dia | Time de Frontend |
| 4    | **PerformanceRadar** | Implementar gráfico de radar, Adicionar áreas comparativas | 1 dia | Time de Frontend |
| 5    | **ComparisonBarChart** | Implementar gráfico de barras, Adicionar funcionalidade de comparação | 0.5 dias | Time de Frontend |
| 6    | **HeatmapCalendar** | Implementar visualização de mapa de calor | 1.5 dias | Time de Frontend |
| 7    | **Integração com API** | Conectar componentes aos dados reais, Implementar hooks de dados | 1 dia | Time Full-Stack |
| 8    | **Filtros e Controles** | Implementar filtros por período, área e categoria | 1 dia | Time de Frontend |
| 9    | **Testes e Otimização** | Testes de usabilidade, Otimização de performance | 2 dias | Time Full-Stack |

## Considerações Técnicas

1. **Performance e Otimização**
   - Implementar lazy loading para os componentes de gráfico
   - Utilizar memoização para evitar renderizações desnecessárias
   - Implementar paginação ou virtualização para listas grandes

2. **Acessibilidade**
   - Garantir contraste adequado nas visualizações
   - Incluir descrições alternativas para gráficos
   - Implementar navegação por teclado

3. **Responsividade**
   - Adaptar layout para dispositivos móveis, tablets e desktop
   - Ajustar tamanho e complexidade dos gráficos conforme o dispositivo
   - Considerar diferentes orientações de tela

## Referências e Recursos

- [Documentação do Recharts](https://recharts.org/en-US/)
- [Documentação do D3.js](https://d3js.org/)
- [Guia de Material UI](https://mui.com/material-ui/getting-started/usage/)
- [Padrões de Dashboard do Material Design](https://material.io/design/communication/data-visualization.html) 