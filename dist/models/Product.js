"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const typeorm_1 = require("typeorm");
let Product = class Product {
    constructor(name, description, image, price, quantity, userId, id) {
        if (!id)
            this._id = crypto.randomUUID();
        else
            this._id = id;
        this._name = name;
        this._description = description;
        this._image = image;
        this._price = price;
        this._quantity = quantity;
        this._userId = userId;
    }
    get userId() {
        return this._userId;
    }
    get id() {
        return this._id;
    }
    get name() {
        return this._name;
    }
    get description() {
        return this._description;
    }
    get image() {
        return this._image;
    }
    get price() {
        return this._price;
    }
    get quantity() {
        return this._quantity;
    }
    set name(name) {
        this._name = name;
    }
    set description(description) {
        this._description = description;
    }
    set image(image) {
        this._image = image;
    }
    set price(price) {
        if (price < 0)
            throw new Error('O preço não pode ser negativo');
        this._price = price;
    }
    set quantity(quantity) {
        if (quantity < 0)
            throw new Error('A quantidade não pode ser negativa');
        this._quantity = quantity;
    }
    toJSON() {
        return {
            id: this._id,
            name: this._name,
            description: this._description,
            image: this._image,
            price: this._price,
            quantity: this._quantity
        };
    }
};
exports.Product = Product;
exports.Product = Product = __decorate([
    (0, typeorm_1.Entity)("products"),
    __metadata("design:paramtypes", [String, String, Blob, Number, Number, String, String])
], Product);
