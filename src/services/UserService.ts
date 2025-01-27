import bcrypt from 'bcrypt';
import { User } from '../models/User';
import { IUserRepository } from '../repositories/UserRepository';

export class UserService {
    private readonly SALT_ROUNDS = 10;

    constructor(private userRepository: IUserRepository) {}

    async create(email: string, password: string): Promise<User> {
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('Email já está em uso');
        }

        const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);

        const user = new User(email, hashedPassword);
        return this.userRepository.create(user);
    }

    async authenticate(email: string, password: string): Promise<User> {
        const user = await this.userRepository.findByEmail(email);
        
        if (!user) {
            throw new Error('Email ou senha inválidos');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            throw new Error('Email ou senha inválidos');
        }

        return user;
    }

    async updatePassword(userId: string, currentPassword: string, newPassword: string): Promise<User> {
        const user = await this.userRepository.findById(userId);
        
        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        
        if (!isPasswordValid) {
            throw new Error('Senha atual incorreta');
        }

        const hashedPassword = await bcrypt.hash(newPassword, this.SALT_ROUNDS);
        
        const updatedUser = await this.userRepository.update(userId, { password: hashedPassword });
        if (!updatedUser) {
            throw new Error('Falha ao atualizar a senha');
        }
        
        return updatedUser;
    }

    async findById(id: string): Promise<User> {
        const user = await this.userRepository.findById(id);
        
        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        return user;
    }

    async update(id: string, email: string): Promise<User> {
        const user = await this.userRepository.findById(id);
        
        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        if (email) {
            const existingUser = await this.userRepository.findByEmail(email);
            if (existingUser && existingUser.id !== id) {
                throw new Error('Email já está em uso');
            }
        }

        const updatedUser = await this.userRepository.update(id, { email });
        if (!updatedUser) {
            throw new Error('Falha ao atualizar usuário');
        }
        
        return updatedUser;
    }

    async delete(id: string): Promise<void> {
        const user = await this.userRepository.findById(id);
        
        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        await this.userRepository.delete(id);
    }

    async list(): Promise<User[]> {
        return this.userRepository.list();
    }
}
