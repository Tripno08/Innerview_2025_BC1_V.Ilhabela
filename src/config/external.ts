export const config = {
  lms: {
    apiUrl: process.env.LMS_API_URL || 'http://lms.example.com/api',
    apiKey: process.env.LMS_API_KEY || '',
    timeout: Number(process.env.LMS_API_TIMEOUT) || 5000,
  },

  sis: {
    apiUrl: process.env.SIS_API_URL || 'http://sis.example.com/api',
    apiKey: process.env.SIS_API_KEY || '',
    timeout: Number(process.env.SIS_API_TIMEOUT) || 5000,
  },
};
