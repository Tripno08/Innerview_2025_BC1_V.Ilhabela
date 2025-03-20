import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset } from 'jest-mock-extended';
import { EstudanteRepository } from './estudante.repository';
import { UnitOfWork } from '../database/unit-of-work';
import { AppError } from '@shared/errors/app-error';
// A importação de Estudante é utilizada indiretamente nos mocks

// Mock do Prisma Client
const mockPrisma = mockDeep<PrismaClient>();
const mockUnitOfWork = {
  withTransaction: jest.fn((callback) => callback(mockPrisma)),
  withoutTransaction: jest.fn((callback) => callback(mockPrisma)),
};

// Mock do UnitOfWork
jest.mock('../database/unit-of-work', () => ({
  UnitOfWork: jest.fn().mockImplementation(() => mockUnitOfWork),
}));

describe('EstudanteRepository', () => {
  let estudanteRepository: EstudanteRepository;

  beforeEach(() => {
    mockReset(mockPrisma);
    jest.clearAllMocks();

    // Criar instância do repositório com o UnitOfWork mockado
    estudanteRepository = new EstudanteRepository(mockUnitOfWork as unknown as UnitOfWork);
  });

  describe('adicionarDificuldade', () => {
    it('deve adicionar uma dificuldade a um estudante com sucesso', async () => {
      // Arrange
      const estudanteId = 'estudante-123';
      const dificuldadeId = 'dificuldade-123';
      const dadosAdicionais = {
        tipo: 'SEVERA',
        observacoes: 'Observações sobre a dificuldade',
      };

      // Mock para verificar se o estudante existe
      mockPrisma.estudante.findUnique.mockResolvedValueOnce({
        id: estudanteId,
        nome: 'Estudante Teste',
        serie: '5º Ano',
        dataNascimento: new Date(),
        status: 'ATIVO',
        usuarioId: 'professor-123',
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      });

      // Mock para verificar se a dificuldade existe
      mockPrisma.dificuldadeAprendizagem.findUnique.mockResolvedValueOnce({
        id: dificuldadeId,
        nome: 'Dificuldade Teste',
        descricao: 'Descrição da dificuldade',
        categoria: 'LEITURA',
        nivel: 'MODERADO',
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      });

      // Mock para verificar se a associação já existe
      mockPrisma.estudanteDificuldade.findUnique.mockResolvedValueOnce(null);

      // Mock para criar a associação
      mockPrisma.estudanteDificuldade.create.mockResolvedValueOnce({
        estudanteId,
        dificuldadeId,
        tipo: dadosAdicionais.tipo,
        observacoes: dadosAdicionais.observacoes,
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      });

      // Mock para buscar o estudante atualizado
      // Simulando a resposta do findById após adicionar a dificuldade
      const estudanteComDificuldade = {
        id: estudanteId,
        nome: 'Estudante Teste',
        serie: '5º Ano',
        dataNascimento: new Date(),
        status: 'ATIVO',
        usuarioId: 'professor-123',
        dificuldades: [
          {
            dificuldade: {
              id: dificuldadeId,
              nome: 'Dificuldade Teste',
              descricao: 'Descrição da dificuldade',
              categoria: 'LEITURA',
              nivel: 'MODERADO',
              criadoEm: new Date(),
              atualizadoEm: new Date(),
            },
            tipo: dadosAdicionais.tipo,
            observacoes: dadosAdicionais.observacoes,
          },
        ],
        avaliacoes: [],
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      };

      // Mock do método findById que será chamado no final
      jest
        .spyOn(estudanteRepository, 'findById')
        .mockResolvedValueOnce(estudanteComDificuldade as Record<string, unknown>);

      // Act
      const resultado = await estudanteRepository.adicionarDificuldade(
        estudanteId,
        dificuldadeId,
        dadosAdicionais,
      );

      // Assert
      expect(mockPrisma.estudante.findUnique).toHaveBeenCalledWith({
        where: { id: estudanteId },
      });

      expect(mockPrisma.dificuldadeAprendizagem.findUnique).toHaveBeenCalledWith({
        where: { id: dificuldadeId },
      });

      expect(mockPrisma.estudanteDificuldade.findUnique).toHaveBeenCalledWith({
        where: {
          estudanteId_dificuldadeId: {
            estudanteId,
            dificuldadeId,
          },
        },
      });

      expect(mockPrisma.estudanteDificuldade.create).toHaveBeenCalledWith({
        data: {
          estudanteId,
          dificuldadeId,
          tipo: dadosAdicionais.tipo,
          observacoes: dadosAdicionais.observacoes,
        },
      });

      expect(estudanteRepository.findById).toHaveBeenCalledWith(estudanteId);
      expect(resultado).toEqual(estudanteComDificuldade);
    });

    it('deve usar PRIMARIA como tipo padrão quando não fornecido', async () => {
      // Arrange
      const estudanteId = 'estudante-123';
      const dificuldadeId = 'dificuldade-123';

      // Mock para verificar se o estudante existe
      mockPrisma.estudante.findUnique.mockResolvedValueOnce({
        id: estudanteId,
        nome: 'Estudante Teste',
        serie: '5º Ano',
        dataNascimento: new Date(),
        status: 'ATIVO',
        usuarioId: 'professor-123',
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      });

      // Mock para verificar se a dificuldade existe
      mockPrisma.dificuldadeAprendizagem.findUnique.mockResolvedValueOnce({
        id: dificuldadeId,
        nome: 'Dificuldade Teste',
        descricao: 'Descrição da dificuldade',
        categoria: 'LEITURA',
        nivel: 'MODERADO',
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      });

      // Mock para verificar se a associação já existe
      mockPrisma.estudanteDificuldade.findUnique.mockResolvedValueOnce(null);

      // Mock para buscar o estudante atualizado após adicionar a dificuldade
      jest
        .spyOn(estudanteRepository, 'findById')
        .mockResolvedValueOnce({} as Record<string, unknown>);

      // Act
      await estudanteRepository.adicionarDificuldade(estudanteId, dificuldadeId);

      // Assert
      expect(mockPrisma.estudanteDificuldade.create).toHaveBeenCalledWith({
        data: {
          estudanteId,
          dificuldadeId,
          tipo: 'PRIMARIA',
          observacoes: undefined,
        },
      });
    });

    it('deve lançar erro quando o estudante não for encontrado', async () => {
      // Arrange
      const estudanteId = 'estudante-inexistente';
      const dificuldadeId = 'dificuldade-123';

      // Mock para verificar se o estudante existe - retorna null
      mockPrisma.estudante.findUnique.mockResolvedValueOnce(null);

      // Act & Assert
      await expect(
        estudanteRepository.adicionarDificuldade(estudanteId, dificuldadeId),
      ).rejects.toThrow(new AppError('Estudante não encontrado', 404, 'STUDENT_NOT_FOUND'));
    });

    it('deve lançar erro quando a dificuldade não for encontrada', async () => {
      // Arrange
      const estudanteId = 'estudante-123';
      const dificuldadeId = 'dificuldade-inexistente';

      // Mock para verificar se o estudante existe
      mockPrisma.estudante.findUnique.mockResolvedValueOnce({
        id: estudanteId,
        nome: 'Estudante Teste',
        serie: '5º Ano',
        dataNascimento: new Date(),
        status: 'ATIVO',
        usuarioId: 'professor-123',
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      });

      // Mock para verificar se a dificuldade existe - retorna null
      mockPrisma.dificuldadeAprendizagem.findUnique.mockResolvedValueOnce(null);

      // Act & Assert
      await expect(
        estudanteRepository.adicionarDificuldade(estudanteId, dificuldadeId),
      ).rejects.toThrow(new AppError('Dificuldade não encontrada', 404, 'DIFFICULTY_NOT_FOUND'));
    });

    it('deve lançar erro quando a dificuldade já estiver associada ao estudante', async () => {
      // Arrange
      const estudanteId = 'estudante-123';
      const dificuldadeId = 'dificuldade-123';

      // Mock para verificar se o estudante existe
      mockPrisma.estudante.findUnique.mockResolvedValueOnce({
        id: estudanteId,
        nome: 'Estudante Teste',
        serie: '5º Ano',
        dataNascimento: new Date(),
        status: 'ATIVO',
        usuarioId: 'professor-123',
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      });

      // Mock para verificar se a dificuldade existe
      mockPrisma.dificuldadeAprendizagem.findUnique.mockResolvedValueOnce({
        id: dificuldadeId,
        nome: 'Dificuldade Teste',
        descricao: 'Descrição da dificuldade',
        categoria: 'LEITURA',
        nivel: 'MODERADO',
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      });

      // Mock para verificar se a associação já existe - retorna uma associação existente
      mockPrisma.estudanteDificuldade.findUnique.mockResolvedValueOnce({
        estudanteId,
        dificuldadeId,
        tipo: 'PRIMARIA',
        observacoes: 'Já associada',
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      });

      // Act & Assert
      await expect(
        estudanteRepository.adicionarDificuldade(estudanteId, dificuldadeId),
      ).rejects.toThrow(
        new AppError(
          'Dificuldade já associada a este estudante',
          409,
          'DIFFICULTY_ALREADY_ASSOCIATED',
        ),
      );
    });
  });
});
