import { useState, useEffect } from 'react';
import { NivelRTI } from '../types/rti-mtss';

// Definindo interfaces para os dados
export interface DistribuicaoNiveisData {
  periodo: string;
  universal: number;
  seletivo: number;
  intensivo: number;
}

export interface ProgressoEstudanteData {
  data: string;
  pontuacao: number;
  media: number;
  objetivo: number;
}

export interface ObjetivoMonitoramentoData {
  id: number | string;
  descricao: string;
  atual: number;
  meta: number;
  unidade: string;
}

export interface RTIProgressData {
  distribuicaoNiveis: DistribuicaoNiveisData[];
  progressoEstudante: ProgressoEstudanteData[];
  objetivosMonitoramento: ObjetivoMonitoramentoData[];
}

interface UseRTIProgressOptions {
  estudanteId?: string;
  nivelFilter?: NivelRTI;
  periodo?: string;
  useMockData?: boolean;
}

// Dados mockados para desenvolvimento
const mockDistribuicaoNiveis: DistribuicaoNiveisData[] = [
  { periodo: 'Jan', universal: 75, seletivo: 15, intensivo: 10 },
  { periodo: 'Fev', universal: 72, seletivo: 18, intensivo: 10 },
  { periodo: 'Mar', universal: 70, seletivo: 20, intensivo: 10 },
  { periodo: 'Abr', universal: 68, seletivo: 22, intensivo: 10 },
  { periodo: 'Mai', universal: 70, seletivo: 20, intensivo: 10 },
  { periodo: 'Jun', universal: 72, seletivo: 18, intensivo: 10 },
];

const mockProgressoEstudante: ProgressoEstudanteData[] = [
  { data: '01/01', pontuacao: 65, media: 70, objetivo: 75 },
  { data: '15/01', pontuacao: 68, media: 70, objetivo: 75 },
  { data: '01/02', pontuacao: 72, media: 71, objetivo: 75 },
  { data: '15/02', pontuacao: 74, media: 71, objetivo: 75 },
  { data: '01/03', pontuacao: 78, media: 72, objetivo: 75 },
  { data: '15/03', pontuacao: 80, media: 72, objetivo: 75 },
];

const mockObjetivosMonitoramento: ObjetivoMonitoramentoData[] = [
  { id: 1, descricao: 'Fluência em leitura', atual: 75, meta: 95, unidade: 'palavras/min' },
  { id: 2, descricao: 'Participação em aula', atual: 60, meta: 80, unidade: '%' },
  { id: 3, descricao: 'Conclusão de tarefas', atual: 85, meta: 90, unidade: '%' },
];

/**
 * Hook para gerenciar dados de progresso RTI/MTSS
 */
const useRTIProgress = ({
  estudanteId,
  nivelFilter,
  periodo = 'semestre',
  useMockData = import.meta.env.MODE === 'development'
}: UseRTIProgressOptions = {}) => {
  const [data, setData] = useState<RTIProgressData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Aqui viria a chamada para a API real
        // Por enquanto, usamos dados mockados
        if (useMockData) {
          await new Promise(resolve => setTimeout(resolve, 500)); // Simular tempo de resposta

          const mockData: RTIProgressData = {
            distribuicaoNiveis: mockDistribuicaoNiveis,
            progressoEstudante: mockProgressoEstudante,
            objetivosMonitoramento: mockObjetivosMonitoramento
          };

          // Se tivermos filtro de nível, podemos ajustar os dados
          if (nivelFilter) {
            // Lógica para filtrar dados por nível (simplificada para exemplo)
          }

          // Se tivermos um ID de estudante, podemos customizar os dados
          if (estudanteId) {
            // Lógica para buscar dados específicos do estudante
            // Em um cenário real, faria uma chamada como:
            // const monitoramento = await rtiService.obterMonitoramentoEstudante(estudanteId);
          }

          // Ajusta os dados conforme o período selecionado
          // Esta é uma lógica simplificada para o exemplo
          const dadosFiltrados = {...mockData};
          if (periodo === 'mes') {
            dadosFiltrados.distribuicaoNiveis = mockData.distribuicaoNiveis.slice(-2);
            dadosFiltrados.progressoEstudante = mockData.progressoEstudante.slice(-3);
          } else if (periodo === 'trimestre') {
            dadosFiltrados.distribuicaoNiveis = mockData.distribuicaoNiveis.slice(-3);
          }

          setData(dadosFiltrados);
        } else {
          // Código para dados reais da API
          // Implementar quando a API estiver pronta
          throw new Error("API para dados de progresso ainda não implementada");
        }
      } catch (err) {
        console.error('Erro ao obter dados de progresso RTI:', err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Erro desconhecido ao carregar dados de progresso.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [estudanteId, nivelFilter, periodo, useMockData]);

  /**
   * Recarrega os dados de progresso
   */
  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Lógica similar ao useEffect, mas em uma função separada para chamada manual
      if (useMockData) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setData({
          distribuicaoNiveis: mockDistribuicaoNiveis,
          progressoEstudante: mockProgressoEstudante,
          objetivosMonitoramento: mockObjetivosMonitoramento
        });
      } else {
        // Implementar quando a API estiver pronta
        throw new Error("API para dados de progresso ainda não implementada");
      }
    } catch (err) {
      console.error('Erro ao recarregar dados de progresso RTI:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro desconhecido ao recarregar dados.');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    refreshData
  };
};

export default useRTIProgress; 