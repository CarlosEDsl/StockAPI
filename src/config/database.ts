import { DataSource } from "typeorm";
import { Product } from "../models/Product";
import { User } from "../models/User";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "stock_api",
    synchronize: true,
    logging: false,
    entities: [Product, User],
    subscribers: [],
    migrations: [],
});

export const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'stock_api',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}; 