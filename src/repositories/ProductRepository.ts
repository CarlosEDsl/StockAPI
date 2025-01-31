import mysql from 'mysql2/promise';
import { dbConfig } from '../config/database';
import { Product } from '../models/Product';

export interface IProductRepository {
    create(product: Product): Promise<Product>;
    findById(id: string): Promise<Product | null>;
    findByUserId(userId: string): Promise<Product[]>;
    update(id: string, product: Partial<Product>): Promise<Product | null>;
    delete(id: string): Promise<void>;
    list(): Promise<Product[]>;
    updateStock(id: string, quantity: number): Promise<Product | null>;
}

export class ProductRepository implements IProductRepository {
    private pool: mysql.Pool;

    constructor() {
        this.pool = mysql.createPool(dbConfig);
    }

    async create(product: Product): Promise<Product> {
        const [result] = await this.pool.execute(
            'INSERT INTO products (id, name, description, price, quantity, userId, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
                product.id,
                product.name,
                product.description,
                product.price,
                product.quantity,
                product.userId,
                product.image ? Buffer.from(await product.image.arrayBuffer()).toString('base64') : null
            ]
        );
        return product;
    }
    

    async findById(id: string): Promise<Product | null> {
        const [rows] = await this.pool.execute(
            'SELECT * FROM products WHERE id = ?',
            [id]
        );
        const row = (rows as any[])[0];
        return row ? new Product(row.id, row.name, row.description, row.price, row.quantity, row.userId) : null;
    }

    async findByUserId(userId: string): Promise<Product[]> {
        const [rows] = await this.pool.execute(
            'SELECT * FROM products WHERE userId = ?',
            [userId]
        );
        return (rows as any[]).map(row => new Product(row.name, row.description, row.image, row.price, row.quantity, row.userId, row.id));
    }

    async update(id: string, productData: Partial<Product>): Promise<Product | null> {
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

        if (fields.length === 0) return null;

        values.push(id);
        await this.pool.execute(
            `UPDATE products SET ${fields.join(', ')} WHERE id = ?`,
            values
        );

        return this.findById(id);
    }

    async delete(id: string): Promise<void> {
        await this.pool.execute('DELETE FROM products WHERE id = ?', [id]);
    }

    async list(): Promise<Product[]> {
        const [rows] = await this.pool.execute('SELECT * FROM products');
        return (rows as any[]).map(row => new Product(row.name, row.description, row.image, row.price, row.quantity, row.userId));
    }

    async updateStock(id: string, quantity: number): Promise<Product | null> {
        const product = await this.findById(id);
        if (!product) return null;

        const newQuantity = product.quantity + quantity;
        if (newQuantity < 0) {
            throw new Error('Quantidade em estoque não pode ser negativa');
        }

        await this.pool.execute(
            'UPDATE products SET quantity = ? WHERE id = ?',
            [newQuantity, id]
        );

        return this.findById(id);
    }
}
