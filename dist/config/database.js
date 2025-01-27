"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConfig = exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const Product_1 = require("../models/Product");
const User_1 = require("../models/User");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "stock_api",
    synchronize: true,
    logging: false,
    entities: [Product_1.Product, User_1.User],
    subscribers: [],
    migrations: [],
});
exports.dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'stock_api',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};
