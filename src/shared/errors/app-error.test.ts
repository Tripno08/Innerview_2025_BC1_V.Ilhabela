import { AppError } from './app-error';

describe('AppError', () => {
  it('deve criar um erro com os valores padrão', () => {
    // Arrange & Act
    const error = new AppError('Mensagem de erro');

    // Assert
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
    expect(error.message).toBe('Mensagem de erro');
    expect(error.statusCode).toBe(400);
    expect(error.code).toBe('BAD_REQUEST');
    expect(error.isOperational).toBe(true);
  });

  it('deve criar um erro com status code personalizado', () => {
    // Arrange & Act
    const error = new AppError('Não autorizado', 401);

    // Assert
    expect(error.message).toBe('Não autorizado');
    expect(error.statusCode).toBe(401);
    expect(error.code).toBe('BAD_REQUEST');
    expect(error.isOperational).toBe(true);
  });

  it('deve criar um erro com código personalizado', () => {
    // Arrange & Act
    const error = new AppError('Recurso não encontrado', 404, 'NOT_FOUND');

    // Assert
    expect(error.message).toBe('Recurso não encontrado');
    expect(error.statusCode).toBe(404);
    expect(error.code).toBe('NOT_FOUND');
    expect(error.isOperational).toBe(true);
  });

  it('deve criar um erro não operacional', () => {
    // Arrange & Act
    const error = new AppError('Erro interno', 500, 'INTERNAL_ERROR', false);

    // Assert
    expect(error.message).toBe('Erro interno');
    expect(error.statusCode).toBe(500);
    expect(error.code).toBe('INTERNAL_ERROR');
    expect(error.isOperational).toBe(false);
  });

  it('deve capturar stack trace corretamente', () => {
    // Arrange & Act
    const error = new AppError('Erro com stack');

    // Assert
    expect(error.stack).toBeDefined();
    expect(error.stack?.includes('app-error.test.ts')).toBe(true);
  });

  it('deve definir o nome do erro como o nome da classe', () => {
    // Arrange & Act
    const error = new AppError('Erro com nome');

    // Assert
    expect(error.name).toBe('AppError');
  });
});
