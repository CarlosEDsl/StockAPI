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
exports.ProductService = void 0;
const Product_1 = require("../models/Product");
class ProductService {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    create(name, description, image, price, quantity, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (price < 0) {
                throw new Error('O preço não pode ser negativo');
            }
            if (quantity < 0) {
                throw new Error('A quantidade não pode ser negativa');
            }
            const product = new Product_1.Product(name, description, image, price, quantity, userId);
            return this.productRepository.create(product);
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield this.productRepository.findById(id);
            if (!product) {
                throw new Error('Produto não encontrado');
            }
            return product;
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield this.productRepository.findById(id);
            if (!product) {
                throw new Error('Produto não encontrado');
            }
            if (data.price !== undefined && data.price < 0) {
                throw new Error('O preço não pode ser negativo');
            }
            if (data.quantity !== undefined && data.quantity < 0) {
                throw new Error('A quantidade não pode ser negativa');
            }
            const updatedProduct = yield this.productRepository.update(id, data);
            if (!updatedProduct) {
                throw new Error('Falha ao atualizar produto');
            }
            return updatedProduct;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield this.productRepository.findById(id);
            if (!product) {
                throw new Error('Produto não encontrado');
            }
            yield this.productRepository.delete(id);
        });
    }
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.productRepository.list();
        });
    }
    addStock(id, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            if (quantity <= 0) {
                throw new Error('A quantidade a ser adicionada deve ser maior que zero');
            }
            const product = yield this.productRepository.updateStock(id, quantity);
            if (!product) {
                throw new Error('Produto não encontrado');
            }
            return product;
        });
    }
    removeStock(id, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            if (quantity <= 0) {
                throw new Error('A quantidade a ser removida deve ser maior que zero');
            }
            const product = yield this.productRepository.findById(id);
            if (!product) {
                throw new Error('Produto não encontrado');
            }
            if (product.quantity < quantity) {
                throw new Error('Quantidade insuficiente em estoque');
            }
            const updatedProduct = yield this.productRepository.updateStock(id, -quantity);
            if (!updatedProduct) {
                throw new Error('Falha ao atualizar estoque');
            }
            return updatedProduct;
        });
    }
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.productRepository.findByUserId(userId);
        });
    }
    checkAvailability(id, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield this.productRepository.findById(id);
            if (!product) {
                throw new Error('Produto não encontrado');
            }
            return product.quantity >= quantity;
        });
    }
}
exports.ProductService = ProductService;
