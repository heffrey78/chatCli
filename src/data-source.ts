import "reflect-metadata"
import { DataSource } from "typeorm"
import { Conversation } from "./database/entities/Conversation"
import { Message } from "./database/entities/Message"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: 5432,
    username: "postgres", //process.env.DB_USERNAME,
    password: "BigBlockRed15!", //process.env.DB_PASSWORD,
    database: "chatcli", //process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [Conversation, Message],
    migrations: [],
    subscribers: [],
})
