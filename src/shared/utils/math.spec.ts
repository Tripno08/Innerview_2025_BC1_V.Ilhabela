import { sum, average, calculatePercentage, roundToDecimalPlaces } from './math';

describe('Math Utils', () => {
  describe('sum', () => {
    it('should correctly sum two numbers', () => {
      expect(sum(2, 3)).toBe(5);
      expect(sum(-1, 1)).toBe(0);
      expect(sum(0, 0)).toBe(0);
    });
  });

  describe('average', () => {
    it('should calculate the average of a list of numbers', () => {
      expect(average([1, 2, 3, 4, 5])).toBe(3);
      expect(average([10, 20, 30, 40])).toBe(25);
    });

    it('should return 0 for empty arrays', () => {
      expect(average([])).toBe(0);
    });

    it('should handle null or undefined input', () => {
      // @ts-expect-error: Testando comportamento com null
      expect(average(null)).toBe(0);
      // @ts-expect-error: Testando comportamento com undefined
      expect(average(undefined)).toBe(0);
    });
  });

  describe('calculatePercentage', () => {
    it('should calculate percentage correctly', () => {
      expect(calculatePercentage(25, 100)).toBe(25);
      expect(calculatePercentage(50, 200)).toBe(25);
      expect(calculatePercentage(150, 300)).toBe(50);
    });

    it('should return 0 when total is 0', () => {
      expect(calculatePercentage(25, 0)).toBe(0);
    });
  });

  describe('roundToDecimalPlaces', () => {
    it('should round to specified number of decimal places', () => {
      expect(roundToDecimalPlaces(3.14159, 2)).toBe(3.14);
      expect(roundToDecimalPlaces(3.14159, 3)).toBe(3.142);
      expect(roundToDecimalPlaces(3.14159, 0)).toBe(3);
    });

    it('should use 2 decimal places by default', () => {
      expect(roundToDecimalPlaces(3.14159)).toBe(3.14);
    });

    it('should handle integers', () => {
      expect(roundToDecimalPlaces(5, 2)).toBe(5);
    });
  });
});
