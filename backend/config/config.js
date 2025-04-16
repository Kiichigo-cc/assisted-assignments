import dotenv from "dotenv";
dotenv.config();

export default {
  development: {
    dialect: "sqlite",
    storage: "./database.sqlite",
  },
  test: {
    dialect: "sqlite",
    storage: ":memory:",
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
