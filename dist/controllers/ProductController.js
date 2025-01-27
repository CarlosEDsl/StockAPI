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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
class ProductController {
    constructor(productService) {
        this.productService = productService;
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { name, description, price, quantity, userId } = req.body;
                const image = ((_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer) || null;
                if (!name || !description || !price || !quantity || !userId) {
                    return res.status(400).json({
                        error: 'Todos os campos são obrigatórios'
                    });
                }
                let blobImage;
                if (!image) {
                    blobImage = new Blob([], { type: 'image/jpeg' });
                }
                else {
                    blobImage = new Blob([image], { type: 'image/jpeg' });
                }
                const product = yield this.productService.create(name, description, blobImage, Number(price), Number(quantity), userId);
                return res.status(201).json(product);
            }
            catch (error) {
                return res.status(400).json({
                    error: error instanceof Error ? error.message : 'Erro ao criar produto'
                });
            }
        });
    }
    findById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const product = yield this.productService.findById(id);
                return res.json(product);
            }
            catch (error) {
                return res.status(404).json({
                    error: error instanceof Error ? error.message : 'Produto não encontrado'
                });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { id } = req.params;
                const { name, description, price, quantity } = req.body;
                const image = (_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer;
                const updateData = {};
                if (name)
                    updateData.name = name;
                if (description)
                    updateData.description = description;
                if (price)
                    updateData.price = Number(price);
                if (quantity)
                    updateData.quantity = Number(quantity);
                if (image)
                    updateData.image = new Blob([image]);
                const product = yield this.productService.update(id, updateData);
                return res.json(product);
            }
            catch (error) {
                return res.status(400).json({
                    error: error instanceof Error ? error.message : 'Erro ao atualizar produto'
                });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield this.productService.delete(id);
                return res.status(204).send();
            }
            catch (error) {
                return res.status(404).json({
                    error: error instanceof Error ? error.message : 'Erro ao deletar produto'
                });
            }
        });
    }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const products = yield this.productService.findByUserId(userId);
                return res.json(products);
            }
            catch (error) {
                return res.status(400).json({
                    error: 'Erro ao listar produtos'
                });
            }
        });
    }
    addStock(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { quantity } = req.body;
                if (!quantity || quantity <= 0) {
                    return res.status(400).json({
                        error: 'Quantidade inválida'
                    });
                }
                const product = yield this.productService.addStock(id, Number(quantity));
                return res.json(product);
            }
            catch (error) {
                return res.status(400).json({
                    error: error instanceof Error ? error.message : 'Erro ao adicionar estoque'
                });
            }
        });
    }
    removeStock(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { quantity } = req.body;
                if (!quantity || quantity <= 0) {
                    return res.status(400).json({
                        error: 'Quantidade inválida'
                    });
                }
                const product = yield this.productService.removeStock(id, Number(quantity));
                return res.json(product);
            }
            catch (error) {
                return res.status(400).json({
                    error: error instanceof Error ? error.message : 'Erro ao remover estoque'
                });
            }
        });
    }
    checkAvailability(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { quantity } = req.query;
                if (!quantity) {
                    return res.status(400).json({
                        error: 'Quantidade não especificada'
                    });
                }
                const isAvailable = yield this.productService.checkAvailability(id, Number(quantity));
                return res.json({ available: isAvailable });
            }
            catch (error) {
                return res.status(400).json({
                    error: error instanceof Error ? error.message : 'Erro ao verificar disponibilidade'
                });
            }
        });
    }
}
exports.ProductController = ProductController;
