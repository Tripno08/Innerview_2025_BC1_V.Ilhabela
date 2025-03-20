export const config = {
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret_key_dev_only',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
};
