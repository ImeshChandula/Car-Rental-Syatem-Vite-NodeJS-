export default () => ({
  port: process.env.PORT || 5000,
  environment: process.env.NODE_ENV || 'development',
  database: {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '3306', 10),
    username: process.env.DB_USERNAME ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_DATABASE ?? 'test',
  },
  domain: {
    production: process.env.PRODUCTION_WEB_URL,
    development: process.env.DEVELOPMENT_WEB_URL || 'http://localhost:5173',
  }
});
