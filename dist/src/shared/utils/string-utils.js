"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringUtils = void 0;
class StringUtils {
    static capitalizeWords(text) {
        if (!text)
            return '';
        return text
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }
    static trimExtraSpaces(text) {
        if (!text)
            return '';
        return text.replace(/\s+/g, ' ').trim();
    }
    static toSnakeCase(text) {
        if (!text)
            return '';
        return text
            .trim()
            .replace(/\s+/g, '_')
            .replace(/([A-Z])/g, (letter) => `_${letter.toLowerCase()}`)
            .replace(/^_/, '')
            .replace(/_+/g, '_')
            .toLowerCase();
    }
    static maskSensitiveInfo(text, visibleChars = 3, visibleDomainChars = 3) {
        if (!text)
            return '';
        if (text.includes('@')) {
            const [localPart, domain] = text.split('@');
            const maskedLocalPart = this.maskText(localPart, visibleChars, 5);
            if (domain) {
                const domainParts = domain.split('.');
                const domainName = domainParts[0];
                const tld = domainParts.slice(1).join('.');
                const maskedDomain = this.maskText(domainName, visibleDomainChars, 4);
                return `${maskedLocalPart}@${maskedDomain}.${tld}`;
            }
            return maskedLocalPart;
        }
        return this.maskText(text, visibleChars, 5);
    }
    static maskText(text, visibleChars, asteriskCount = 5) {
        if (text.length <= visibleChars)
            return text;
        const visible = text.substring(0, visibleChars);
        const masked = '*'.repeat(asteriskCount);
        return `${visible}${masked}`;
    }
}
exports.StringUtils = StringUtils;
//# sourceMappingURL=string-utils.js.map