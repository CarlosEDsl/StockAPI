"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("reflect-metadata");
const database_1 = require("./config/database");
const UserRepository_1 = require("./repositories/UserRepository");
const ProductRepository_1 = require("./repositories/ProductRepository");
const UserService_1 = require("./services/UserService");
const ProductService_1 = require("./services/ProductService");
const UserController_1 = require("./controllers/UserController");
const ProductController_1 = require("./controllers/ProductController");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const userRepository = new UserRepository_1.UserRepository();
const productRepository = new ProductRepository_1.ProductRepository();
const userService = new UserService_1.UserService(userRepository);
const productService = new ProductService_1.ProductService(productRepository);
const userController = new UserController_1.UserController(userService);
const productController = new ProductController_1.ProductController(productService);
app.post('/users', (req, res) => userController.create(req, res));
app.post('/users/auth', (req, res) => userController.authenticate(req, res));
app.get('/users/:id', (req, res) => userController.findById(req, res));
app.put('/users/:id', (req, res) => userController.update(req, res));
app.put('/users/:id/password', (req, res) => userController.updatePassword(req, res));
app.delete('/users/:id', (req, res) => userController.delete(req, res));
app.get('/users', (req, res) => userController.list(req, res));
app.post('/products', (req, res) => productController.create(req, res));
app.get('/products/:id', (req, res) => productController.findById(req, res));
app.put('/products/:id', (req, res) => productController.update(req, res));
app.delete('/products/:id', (req, res) => productController.delete(req, res));
app.get('/products/list/:userId', (req, res) => productController.list(req, res));
app.post('/products/:id/stock/add', (req, res) => productController.addStock(req, res));
app.post('/products/:id/stock/remove', (req, res) => productController.removeStock(req, res));
app.get('/products/:id/availability', (req, res) => productController.checkAvailability(req, res));
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.status || 500;
    const errorResponse = {
        error: err.message || 'Algo deu errado! Por favor, tente novamente mais tarde.'
    };
    res.status(statusCode).json(errorResponse);
});
const PORT = 8080;
database_1.connection.connect((err) => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados:", err);
        process.exit(1);
    }
    else {
        console.log("📦 Conectado ao MySQL com sucesso!");
        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
        });
    }
});
process.on('unhandledRejection', (reason) => {
    console.error('🔥 Erro não tratado:', reason.message);
});
process.on('uncaughtException', (error) => {
    console.error('🔥 Exceção não capturada:', error.message);
    process.exit(1);
});
