import path from 'path';

export const config = {
  storage: {
    driver: process.env.STORAGE_DRIVER || 'local',
    tmpFolder: path.resolve(__dirname, '..', '..', 'tmp'),
    uploadsFolder: path.resolve(__dirname, '..', '..', 'uploads'),
    baseUrl: process.env.APP_API_URL || 'http://localhost:3333',

    // Configurações para outros drivers (S3, etc) podem ser adicionadas aqui
    s3: {
      bucket: process.env.AWS_BUCKET,
      region: process.env.AWS_REGION,
    },
  },
};
