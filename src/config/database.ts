import { Product } from "../models/Product";
import { User } from "../models/User";

import mysql from 'mysql2';

export const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "stock_api"
});

export const dbConfig = {
    host: "localhost",
    user: "root",
    password: "root",
    database: "stock_api",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

