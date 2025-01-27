import { Request, Response } from 'express';
import { UserService } from '../services/UserService';

export class UserController {
    constructor(private userService: UserService) {}

    async create(req: Request, res: Response): Promise<Response> {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    error: 'Email e senha são obrigatórios'
                });
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    error: 'Email inválido'
                });
            }

            if (password.length < 6) {
                return res.status(400).json({
                    error: 'A senha deve ter pelo menos 6 caracteres'
                });
            }

            const user = await this.userService.create(email, password);

            const { password: _, ...userWithoutPassword } = user;
            return res.status(201).json(userWithoutPassword);
        } catch (error) {
            return res.status(400).json({
                error: error instanceof Error ? error.message : 'Erro ao criar usuário'
            });
        }
    }

    async authenticate(req: Request, res: Response): Promise<Response> {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    error: 'Email e senha são obrigatórios'
                });
            }

            const user = await this.userService.authenticate(email, password);

            const { password: _, ...userWithoutPassword } = user;
            return res.json({
                user: userWithoutPassword
            });
        } catch (error) {
            return res.status(401).json({
                error: 'Credenciais inválidas'
            });
        }
    }

    async findById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const user = await this.userService.findById(id);

            const { password: _, ...userWithoutPassword } = user;
            return res.json(userWithoutPassword);
        } catch (error) {
            return res.status(404).json({
                error: error instanceof Error ? error.message : 'Usuário não encontrado'
            });
        }
    }

    async update(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({
                    error: 'Email é obrigatório'
                });
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    error: 'Email inválido'
                });
            }

            const user = await this.userService.update(id, email);

            const { password: _, ...userWithoutPassword } = user;
            return res.json(userWithoutPassword);
        } catch (error) {
            return res.status(400).json({
                error: error instanceof Error ? error.message : 'Erro ao atualizar usuário'
            });
        }
    }

    async updatePassword(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const { currentPassword, newPassword } = req.body;

            if (!currentPassword || !newPassword) {
                return res.status(400).json({
                    error: 'Senha atual e nova senha são obrigatórias'
                });
            }

            if (newPassword.length < 6) {
                return res.status(400).json({
                    error: 'A nova senha deve ter pelo menos 6 caracteres'
                });
            }

            await this.userService.updatePassword(id, currentPassword, newPassword);
            return res.status(204).send();
        } catch (error) {
            return res.status(400).json({
                error: error instanceof Error ? error.message : 'Erro ao atualizar senha'
            });
        }
    }

    async delete(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            await this.userService.delete(id);
            return res.status(204).send();
        } catch (error) {
            return res.status(404).json({
                error: error instanceof Error ? error.message : 'Erro ao deletar usuário'
            });
        }
    }

    async list(req: Request, res: Response): Promise<Response> {
        try {
            const users = await this.userService.list();
            
            const usersWithoutPassword = users.map(user => {
                const { password: _, ...userWithoutPassword } = user;
                return userWithoutPassword;
            });
            return res.json(usersWithoutPassword);
        } catch (error) {
            return res.status(400).json({
                error: 'Erro ao listar usuários'
            });
        }
    }
}
