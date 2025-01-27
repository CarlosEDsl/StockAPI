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
exports.ProductRepository = void 0;
const Product_1 = require("../models/Product");
const database_1 = require("../config/database");
class ProductRepository {
    constructor() {
        this.repository = database_1.AppDataSource.getRepository(Product_1.Product);
    }
    create(product) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.save(product);
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.findOneBy({ id });
        });
    }
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.findBy({ userId });
        });
    }
    update(id, productData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repository.update({ id }, productData);
            return this.findById(id);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repository.delete({ id });
        });
    }
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.find();
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
            yield this.repository.update({ id }, { quantity: newQuantity });
            return this.findById(id);
        });
    }
}
exports.ProductRepository = ProductRepository;
