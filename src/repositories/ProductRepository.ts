import { Repository } from 'typeorm';
import { Product } from '../models/Product';
import { AppDataSource } from '../config/database';

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
    private repository: Repository<Product>;

    constructor() {
        this.repository = AppDataSource.getRepository(Product);
    }

    async create(product: Product): Promise<Product> {
        return this.repository.save(product);
    }

    async findById(id: string): Promise<Product | null> {
        return this.repository.findOneBy({ id });
    }

    async findByUserId(userId: string): Promise<Product[]> {
        return this.repository.findBy({ userId });
    }

    async update(id: string, productData: Partial<Product>): Promise<Product | null> {
        await this.repository.update({ id }, productData);
        return this.findById(id);
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete({ id });
    }

    async list(): Promise<Product[]> {
        return this.repository.find();
    }

    async updateStock(id: string, quantity: number): Promise<Product | null> {
        const product = await this.findById(id);
        if (!product) return null;

        const newQuantity = product.quantity + quantity;
        if (newQuantity < 0) {
            throw new Error('Quantidade em estoque não pode ser negativa');
        }

        await this.repository.update(
            { id },
            { quantity: newQuantity }
        );

        return this.findById(id);
    }
}
