/**
 * Funções utilitárias para manipulação de strings
 */
export class StringUtils {
  /**
   * Capitaliza a primeira letra de cada palavra em uma string
   */
  static capitalizeWords(text: string): string {
    if (!text) return '';

    return text
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  /**
   * Remove espaços em branco extras de uma string
   */
  static trimExtraSpaces(text: string): string {
    if (!text) return '';

    return text.replace(/\s+/g, ' ').trim();
  }

  /**
   * Converte uma string para snake_case
   */
  static toSnakeCase(text: string): string {
    if (!text) return '';

    return text
      .trim()
      .replace(/\s+/g, '_')
      .replace(/([A-Z])/g, (letter) => `_${letter.toLowerCase()}`)
      .replace(/^_/, '')
      .replace(/_+/g, '_')
      .toLowerCase();
  }

  /**
   * Mascara informações sensíveis como emails e documentos
   * @param text O texto a ser mascarado
   * @param visibleChars Número de caracteres visíveis no início
   * @param visibleDomainChars Número de caracteres visíveis no final (para emails)
   */
  static maskSensitiveInfo(
    text: string,
    visibleChars: number = 3,
    visibleDomainChars: number = 3,
  ): string {
    if (!text) return '';

    // Verifica se é um email
    if (text.includes('@')) {
      const [localPart, domain] = text.split('@');
      const maskedLocalPart = this.maskText(localPart, visibleChars, 5); // Garante 5 asteriscos

      // Se tiver domínio, mostra alguns caracteres do domínio
      if (domain) {
        const domainParts = domain.split('.');
        const domainName = domainParts[0];
        const tld = domainParts.slice(1).join('.');
        const maskedDomain = this.maskText(domainName, visibleDomainChars, 4); // Garante 4 asteriscos
        return `${maskedLocalPart}@${maskedDomain}.${tld}`;
      }

      return maskedLocalPart;
    }

    // Para outros tipos de texto (como CPF, telefone, etc)
    return this.maskText(text, visibleChars, 5); // Garante 5 asteriscos
  }

  /**
   * Função auxiliar para mascarar texto
   * @param text Texto a ser mascarado
   * @param visibleChars Número de caracteres visíveis
   * @param asteriskCount Número fixo de asteriscos a usar
   */
  private static maskText(text: string, visibleChars: number, asteriskCount: number = 5): string {
    if (text.length <= visibleChars) return text;

    const visible = text.substring(0, visibleChars);
    const masked = '*'.repeat(asteriskCount);

    return `${visible}${masked}`;
  }
}
