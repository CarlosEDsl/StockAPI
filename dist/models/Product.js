"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const typeorm_1 = require("typeorm");
let Product = (() => {
    let _classDecorators = [(0, typeorm_1.Entity)("products")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var Product = _classThis = class {
        constructor(name, description, image, price, quantity, userId) {
            this._id = crypto.randomUUID();
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
    __setFunctionName(_classThis, "Product");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Product = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Product = _classThis;
})();
exports.Product = Product;
