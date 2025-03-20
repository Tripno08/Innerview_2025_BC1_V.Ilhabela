import { StringUtils } from './string-utils';

describe('StringUtils', () => {
  describe('capitalizeWords', () => {
    it('deve capitalizar a primeira letra de cada palavra', () => {
      expect(StringUtils.capitalizeWords('hello world')).toBe('Hello World');
    });

    it('deve lidar com string vazia', () => {
      expect(StringUtils.capitalizeWords('')).toBe('');
    });

    it('deve lidar com valores nulos', () => {
      expect(StringUtils.capitalizeWords(null as unknown as string)).toBe('');
    });

    it('deve normalizar todas as letras após a primeira', () => {
      expect(StringUtils.capitalizeWords('hELLo WoRLD')).toBe('Hello World');
    });
  });

  describe('trimExtraSpaces', () => {
    it('deve remover espaços extras', () => {
      expect(StringUtils.trimExtraSpaces('  hello   world  ')).toBe('hello world');
    });

    it('deve lidar com string vazia', () => {
      expect(StringUtils.trimExtraSpaces('')).toBe('');
    });

    it('deve lidar com valores nulos', () => {
      expect(StringUtils.trimExtraSpaces(null as unknown as string)).toBe('');
    });
  });

  describe('toSnakeCase', () => {
    it('deve converter para snake_case', () => {
      expect(StringUtils.toSnakeCase('Hello World')).toBe('hello_world');
    });

    it('deve lidar com camelCase', () => {
      expect(StringUtils.toSnakeCase('helloWorld')).toBe('hello_world');
    });

    it('deve lidar com string vazia', () => {
      expect(StringUtils.toSnakeCase('')).toBe('');
    });

    it('deve lidar com valores nulos', () => {
      expect(StringUtils.toSnakeCase(null as unknown as string)).toBe('');
    });
  });

  describe('maskSensitiveInfo', () => {
    it('deve mascarar um email corretamente', () => {
      expect(StringUtils.maskSensitiveInfo('usuario@dominio.com')).toBe('usu*****@dom****.com');
      expect(StringUtils.maskSensitiveInfo('usuario@dominio.com.br')).toBe(
        'usu*****@dom****.com.br',
      );
    });

    it('deve mascarar CPF corretamente', () => {
      expect(StringUtils.maskSensitiveInfo('123.456.789-00')).toBe('123*****');
    });

    it('deve permitir configurar a quantidade de caracteres visíveis', () => {
      expect(StringUtils.maskSensitiveInfo('usuario@dominio.com', 4, 2)).toBe(
        'usua*****@do****.com',
      );
    });

    it('deve lidar com string vazia', () => {
      expect(StringUtils.maskSensitiveInfo('')).toBe('');
    });

    it('deve lidar com valores nulos', () => {
      expect(StringUtils.maskSensitiveInfo(null as unknown as string)).toBe('');
    });

    it('não deve mascarar textos muito curtos', () => {
      expect(StringUtils.maskSensitiveInfo('ab')).toBe('ab');
    });
  });
});
