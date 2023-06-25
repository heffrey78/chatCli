import "reflect-metadata"
import { DataSource } from "typeorm"
import * as dotenv from "dotenv";
dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: ["./dist/database/entities/**/*.js"],
    migrations: ["./dist/migration/**/*.js"],
    subscribers: [],
})
