export const testConfig = {
  database: {
    url: 'mysql://test_user:test_password@localhost:3307/innerview_test',
  },
  redis: {
    host: 'localhost',
    port: 6380,
    keyPrefix: 'test:',
  },
  storage: {
    tmpFolder: './tmp/test',
    uploadsFolder: './uploads/test',
  },
  auth: {
    secret: 'test_secret',
    expiresIn: '15m',
  },
};

describe('Config tests', () => {
  it('should pass a basic test', () => {
    expect(1 + 1).toBe(2);
  });
});
