import express, { Express, Request, Response, NextFunction } from 'express';

import { UserRepository } from './repositories/UserRepository';
import { ProductRepository } from './repositories/ProductRepository';

import { UserService } from './services/UserService';
import { ProductService } from './services/ProductService';

import { UserController } from './controllers/UserController';
import { ProductController } from './controllers/ProductController';

interface ErrorResponse {
    error: string;
}

interface ServerError extends Error {
    status?: number;
}

const app: Express = express();

app.use(express.json());

const userRepository = new UserRepository();
const productRepository = new ProductRepository();

const userService = new UserService(userRepository);
const productService = new ProductService(productRepository);

const userController = new UserController(userService);
const productController = new ProductController(productService);

app.post('/users', (req: Request, res: Response) => userController.create(req, res));
app.post('/users/auth', (req: Request, res: Response) => userController.authenticate(req, res));
app.get('/users/:id', (req: Request, res: Response) => userController.findById(req, res));
app.put('/users/:id', (req: Request, res: Response) => userController.update(req, res));
app.put('/users/:id/password', (req: Request, res: Response) => userController.updatePassword(req, res));
app.delete('/users/:id', (req: Request, res: Response) => userController.delete(req, res));
app.get('/users', (req: Request, res: Response) => userController.list(req, res));

app.post(
    '/products', 
    (req: Request, res: Response) => productController.create(req, res)
);
app.get('/products/:id', (req: Request, res: Response) => productController.findById(req, res));
app.put(
    '/products/:id', 
    (req: Request, res: Response) => productController.update(req, res)
);
app.delete('/products/:id', (req: Request, res: Response) => productController.delete(req, res));
app.get('/products/list/:userId', (req: Request, res: Response) => productController.list(req, res));
app.post(
    '/products/:id/stock/add', 
    (req: Request, res: Response) => productController.addStock(req, res)
);
app.post(
    '/products/:id/stock/remove', 
    (req: Request, res: Response) => productController.removeStock(req, res)
);
app.get(
    '/products/:id/availability',
    (req: Request, res: Response) => productController.checkAvailability(req, res)
);

app.use((err: ServerError, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    const statusCode = err.status || 500;
    const errorResponse: ErrorResponse = {
        error: err.message || 'Algo deu errado! Por favor, tente novamente mais tarde.'
    };
    res.status(statusCode).json(errorResponse);
});

const PORT: number = 8080;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});


process.on('unhandledRejection', (reason: Error) => {
    console.error('🔥 Erro não tratado:', reason.message);
});

process.on('uncaughtException', (error: Error) => {
    console.error('🔥 Exceção não capturada:', error.message);
    process.exit(1);
});
