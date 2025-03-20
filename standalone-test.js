// Função de soma
function sum(a, b) {
  return a + b;
}

// Testes básicos
describe('Operações matemáticas', () => {
  test('soma 1 + 2 para obter 3', () => {
    expect(sum(1, 2)).toBe(3);
  });

  test('soma números negativos', () => {
    expect(sum(-1, -2)).toBe(-3);
  });

  test('soma zero', () => {
    expect(sum(0, 0)).toBe(0);
  });
}); 