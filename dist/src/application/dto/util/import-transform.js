"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformImportsToRelative = transformImportsToRelative;
function transformImportsToRelative(code) {
    return code
        .replace(/from\s+['"]@domain\/([^'"]+)['"]/g, (_, path) => `from '../../../domain/${path}'`)
        .replace(/from\s+['"]@application\/([^'"]+)['"]/g, (_, path) => `from '../../../application/${path}'`)
        .replace(/from\s+['"]@infrastructure\/([^'"]+)['"]/g, (_, path) => `from '../../../infrastructure/${path}'`)
        .replace(/from\s+['"]@interfaces\/([^'"]+)['"]/g, (_, path) => `from '../../../interfaces/${path}'`)
        .replace(/from\s+['"]@shared\/([^'"]+)['"]/g, (_, path) => `from '../../../shared/${path}'`);
}
//# sourceMappingURL=import-transform.js.map