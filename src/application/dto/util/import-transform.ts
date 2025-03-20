/**
 * Converte importações com alias para caminhos relativos
 */
export function transformImportsToRelative(code: string): string {
  return code
    .replace(/from\s+['"]@domain\/([^'"]+)['"]/g, (_, path) => `from '../../../domain/${path}'`)
    .replace(
      /from\s+['"]@application\/([^'"]+)['"]/g,
      (_, path) => `from '../../../application/${path}'`,
    )
    .replace(
      /from\s+['"]@infrastructure\/([^'"]+)['"]/g,
      (_, path) => `from '../../../infrastructure/${path}'`,
    )
    .replace(
      /from\s+['"]@interfaces\/([^'"]+)['"]/g,
      (_, path) => `from '../../../interfaces/${path}'`,
    )
    .replace(/from\s+['"]@shared\/([^'"]+)['"]/g, (_, path) => `from '../../../shared/${path}'`);
}
