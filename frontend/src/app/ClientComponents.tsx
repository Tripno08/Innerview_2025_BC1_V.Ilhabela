"use client";

import { useEffect } from "react";
import { addApiDiagnosticsTool } from '@/services/apiHealthCheck';

/**
 * Componentes do lado do cliente que precisam da diretiva "use client"
 * Separados do layout principal para resolver problemas de compatibilidade 
 * com os metadados do Next.js que precisam ser executados no servidor
 */

// Componente para carregar a ferramenta de diagnóstico de API
export default function ClientComponents() {
  useEffect(() => {
    // Só adiciona a ferramenta em ambiente de desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      addApiDiagnosticsTool();
    }
  }, []);

  return null;
} 