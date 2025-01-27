import { Product } from '../models/Product';
import { IProductRepository } from '../repositories/ProductRepository';

export class ProductService {
    constructor(private productRepository: IProductRepository) {}

    async create(
        name: string,
        description: string,
        image: Blob,
        price: number,
        quantity: number,
        userId: string
    ): Promise<Product> {
        if (price < 0) {
            throw new Error('O preço não pode ser negativo');
        }

        if (quantity < 0) {
            throw new Error('A quantidade não pode ser negativa');
        }

        const product = new Product(name, description, image, price, quantity, userId);
        return this.productRepository.create(product);
    }

    async findById(id: string): Promise<Product> {
        const product = await this.productRepository.findById(id);
        
        if (!product) {
            throw new Error('Produto não encontrado');
        }

        return product;
    }

    async update(
        id: string,
        data: {
            name?: string;
            description?: string;
            image?: Blob;
            price?: number;
            quantity?: number;
        }
    ): Promise<Product> {
        const product = await this.productRepository.findById(id);
        
        if (!product) {
            throw new Error('Produto não encontrado');
        }

        if (data.price !== undefined && data.price < 0) {
            throw new Error('O preço não pode ser negativo');
        }

        if (data.quantity !== undefined && data.quantity < 0) {
            throw new Error('A quantidade não pode ser negativa');
        }

        const updatedProduct = await this.productRepository.update(id, data);
        if (!updatedProduct) {
            throw new Error('Falha ao atualizar produto');
        }

        return updatedProduct;
    }

    async delete(id: string): Promise<void> {
        const product = await this.productRepository.findById(id);
        
        if (!product) {
            throw new Error('Produto não encontrado');
        }

        await this.productRepository.delete(id);
    }

    async list(): Promise<Product[]> {
        return this.productRepository.list();
    }

    async addStock(id: string, quantity: number): Promise<Product> {
        if (quantity <= 0) {
            throw new Error('A quantidade a ser adicionada deve ser maior que zero');
        }

        const product = await this.productRepository.updateStock(id, quantity);
        
        if (!product) {
            throw new Error('Produto não encontrado');
        }

        return product;
    }

    async removeStock(id: string, quantity: number): Promise<Product> {
        if (quantity <= 0) {
            throw new Error('A quantidade a ser removida deve ser maior que zero');
        }

        const product = await this.productRepository.findById(id);
        
        if (!product) {
            throw new Error('Produto não encontrado');
        }

        if (product.quantity < quantity) {
            throw new Error('Quantidade insuficiente em estoque');
        }

        const updatedProduct = await this.productRepository.updateStock(id, -quantity);
        if (!updatedProduct) {
            throw new Error('Falha ao atualizar estoque');
        }

        return updatedProduct;
    }

    async findByUserId(userId: string): Promise<Product[]> {
        return this.productRepository.findByUserId(userId);
    }

    async checkAvailability(id: string, quantity: number): Promise<boolean> {
        const product = await this.productRepository.findById(id);
        
        if (!product) {
            throw new Error('Produto não encontrado');
        }

        return product.quantity >= quantity;
    }
}
