// Konfiguracja bazy danych - dane pobierane są ze zmiennych procesowych ("process.env.X")

const options: any = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: process.env.DB_SYNC === 'true',
  charset: 'utf8mb4_unicode_ci',
};

export default options;
