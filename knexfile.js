export default {
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: "pascallim",
    password: process.env.DB_PASSWORD,
    database: "test",
  },
  migrations: {
    directory: "./src/db/migrations",
    stub: "./src/db/migration.stub",
  },
}
