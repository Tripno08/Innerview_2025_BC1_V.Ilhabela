// Extensões para tipos Prisma que são gerados automaticamente mas precisam
// ser declarados explicitamente para TypeScript. Isso resolve erros com
// chaves compostas (composite keys) e referências relationships.

// Declarar explicitamente os tipos de chaves compostas para o Prisma

// EstudanteDificuldade
interface EstudanteDificuldadeWhereUniqueInput {
  estudanteId_dificuldadeId?: {
    estudanteId: string;
    dificuldadeId: string;
  };
}

// MembroEquipe
interface MembroEquipeWhereUniqueInput {
  equipeId_usuarioId?: {
    equipeId: string;
    usuarioId: string;
  };
}

// EstudanteEquipe
interface EstudanteEquipeWhereUniqueInput {
  equipeId_estudanteId?: {
    equipeId: string;
    estudanteId: string;
  };
}

// DificuldadeAprendizagem
interface DificuldadeAprendizagemWhereInput {
  tipo?: string | { equals?: string; in?: string[] };
  categoria?: string | { equals?: string; in?: string[] };
}

// Exportar todos os tipos
export {
  EstudanteDificuldadeWhereUniqueInput,
  MembroEquipeWhereUniqueInput,
  EstudanteEquipeWhereUniqueInput,
  DificuldadeAprendizagemWhereInput,
};
