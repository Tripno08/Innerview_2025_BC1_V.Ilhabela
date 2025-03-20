export declare class StringUtils {
    static capitalizeWords(text: string): string;
    static trimExtraSpaces(text: string): string;
    static toSnakeCase(text: string): string;
    static maskSensitiveInfo(text: string, visibleChars?: number, visibleDomainChars?: number): string;
    private static maskText;
}
