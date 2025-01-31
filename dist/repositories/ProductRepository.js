"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepository = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const database_1 = require("../config/database");
const Product_1 = require("../models/Product");
class ProductRepository {
    constructor() {
        this.pool = promise_1.default.createPool(database_1.dbConfig);
    }
    create(product) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield this.pool.execute('INSERT INTO products (id, name, description, price, quantity, userId, image) VALUES (?, ?, ?, ?, ?, ?, ?)', [
                product.id,
                product.name,
                product.description,
                product.price,
                product.quantity,
                product.userId,
                product.image ? Buffer.from(yield product.image.arrayBuffer()).toString('base64') : null
            ]);
            return product;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield this.pool.execute('SELECT * FROM products WHERE id = ?', [id]);
            const row = rows[0];
            return row ? new Product_1.Product(row.id, row.name, row.description, row.price, row.quantity, row.userId) : null;
        });
    }
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield this.pool.execute('SELECT * FROM products WHERE userId = ?', [userId]);
            return rows.map(row => new Product_1.Product(row.name, row.description, row.image, row.price, row.quantity, row.userId, row.id));
        });
    }
    update(id, productData) {
        return __awaiter(this, void 0, void 0, function* () {
            const fields = [];
            const values = [];
            if ('name' in productData) {
                fields.push('name = ?');
                values.push(productData.name);
            }
            if ('description' in productData) {
                fields.push('description = ?');
                values.push(productData.description);
            }
            if ('price' in productData) {
                fields.push('price = ?');
                values.push(productData.price);
            }
            if ('quantity' in productData) {
                fields.push('quantity = ?');
                values.push(productData.quantity);
            }
            if ('userId' in productData) {
                fields.push('userId = ?');
                values.push(productData.userId);
            }
            if (fields.length === 0)
                return null;
            values.push(id);
            yield this.pool.execute(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`, values);
            return this.findById(id);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.pool.execute('DELETE FROM products WHERE id = ?', [id]);
        });
    }
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield this.pool.execute('SELECT * FROM products');
            return rows.map(row => new Product_1.Product(row.name, row.description, row.image, row.price, row.quantity, row.userId));
        });
    }
    updateStock(id, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield this.findById(id);
            if (!product)
                return null;
            const newQuantity = product.quantity + quantity;
            if (newQuantity < 0) {
                throw new Error('Quantidade em estoque não pode ser negativa');
            }
            yield this.pool.execute('UPDATE products SET quantity = ? WHERE id = ?', [newQuantity, id]);
            return this.findById(id);
        });
    }
}
exports.ProductRepository = ProductRepository;
