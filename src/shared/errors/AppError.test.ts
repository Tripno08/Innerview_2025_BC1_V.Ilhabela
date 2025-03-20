import { AppError } from './AppError';

describe('AppError', () => {
  it('deve criar um erro com os valores padrão', () => {
    // Arrange & Act
    const error = new AppError('Mensagem de erro');

    // Assert
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
    expect(error.message).toBe('Mensagem de erro');
    expect(error.statusCode).toBe(400);
    expect(error.name).toBe('AppError');
  });

  it('deve criar um erro com status code personalizado', () => {
    // Arrange & Act
    const error = new AppError('Não autorizado', 401);

    // Assert
    expect(error.message).toBe('Não autorizado');
    expect(error.statusCode).toBe(401);
    expect(error.name).toBe('AppError');
  });

  it('deve capturar stack trace corretamente', () => {
    // Arrange & Act
    const error = new AppError('Erro com stack');

    // Assert
    expect(error.stack).toBeDefined();
    expect(error.stack?.includes('AppError.test.ts')).toBe(true);
  });
});
