import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';

export class ProductController {
    constructor(private productService: ProductService) {}

    async create(req: Request, res: Response): Promise<Response> {
        try {
            const { name, description, price, quantity, userId } = req.body;
            const image = req.file?.buffer || null;

            if (!name || !description || !price || !quantity || !userId) {
                return res.status(400).json({
                    error: 'Todos os campos são obrigatórios'
                });
            }
            let blobImage:Blob;
            if (!image) {
                blobImage = new Blob([], {type: 'image/jpeg'})
            }
            else {
                blobImage = new Blob([image], {type: 'image/jpeg'})
            }

            const product = await this.productService.create(
                name,
                description,
                blobImage,
                Number(price),
                Number(quantity),
                userId
            );

            return res.status(201).json(product);
        } catch (error) {
            return res.status(400).json({
                error: error instanceof Error ? error.message : 'Erro ao criar produto'
            });
        }
    }

    async findById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const product = await this.productService.findById(id);
            return res.json(product);
        } catch (error) {
            return res.status(404).json({
                error: error instanceof Error ? error.message : 'Produto não encontrado'
            });
        }
    }

    async update(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const { name, description, price, quantity } = req.body;
            const image = req.file?.buffer;

            const updateData: any = {};
            if (name) updateData.name = name;
            if (description) updateData.description = description;
            if (price) updateData.price = Number(price);
            if (quantity) updateData.quantity = Number(quantity);
            if (image) updateData.image = new Blob([image]);

            const product = await this.productService.update(id, updateData);
            return res.json(product);
        } catch (error) {
            return res.status(400).json({
                error: error instanceof Error ? error.message : 'Erro ao atualizar produto'
            });
        }
    }

    async delete(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            await this.productService.delete(id);
            return res.status(204).send();
        } catch (error) {
            return res.status(404).json({
                error: error instanceof Error ? error.message : 'Erro ao deletar produto'
            });
        }
    }

    async list(req: Request, res: Response): Promise<Response> {
        try {
            const { userId } = req.params;
            const products = await this.productService.findByUserId(userId);
            return res.json(products);
        } catch (error) {
            return res.status(400).json({
                error: 'Erro ao listar produtos'
            });
        }
    }

    async addStock(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const { quantity } = req.body;

            if (!quantity || quantity <= 0) {
                return res.status(400).json({
                    error: 'Quantidade inválida'
                });
            }

            const product = await this.productService.addStock(id, Number(quantity));
            return res.json(product);
        } catch (error) {
            return res.status(400).json({
                error: error instanceof Error ? error.message : 'Erro ao adicionar estoque'
            });
        }
    }

    async removeStock(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const { quantity } = req.body;

            if (!quantity || quantity <= 0) {
                return res.status(400).json({
                    error: 'Quantidade inválida'
                });
            }

            const product = await this.productService.removeStock(id, Number(quantity));
            return res.json(product);
        } catch (error) {
            return res.status(400).json({
                error: error instanceof Error ? error.message : 'Erro ao remover estoque'
            });
        }
    }

    async checkAvailability(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const { quantity } = req.query;

            if (!quantity) {
                return res.status(400).json({
                    error: 'Quantidade não especificada'
                });
            }

            const isAvailable = await this.productService.checkAvailability(
                id,
                Number(quantity)
            );

            return res.json({ available: isAvailable });
        } catch (error) {
            return res.status(400).json({
                error: error instanceof Error ? error.message : 'Erro ao verificar disponibilidade'
            });
        }
    }
}
