export const sum = (a: number, b: number): number => a + b;

/**
 * Calcula a média aritmética de um array de números
 */
export const average = (numbers: number[]): number => {
  if (!numbers || numbers.length === 0) return 0;
  return numbers.reduce((acc, val) => acc + val, 0) / numbers.length;
};

/**
 * Calcula a porcentagem de um valor em relação a um total
 */
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return (value / total) * 100;
};

/**
 * Arredonda um número para um número específico de casas decimais
 */
export const roundToDecimalPlaces = (num: number, decimalPlaces: number = 2): number => {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(num * factor) / factor;
};
