import { User } from '../models/User';
import mysql from 'mysql2/promise';
import { dbConfig } from '../config/database';

export interface IUserRepository {
    create(user: User): Promise<User>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    update(id: string, user: Partial<User>): Promise<User | null>;
    delete(id: string): Promise<void>;
    list(): Promise<User[]>;
}

export class UserRepository implements IUserRepository {
    private pool: mysql.Pool;

    constructor() {
        this.pool = mysql.createPool(dbConfig);
    }

    async create(user: User): Promise<User> {
        const [result] = await this.pool.execute(
            'INSERT INTO users (_id, _email, _password) VALUES (?, ?, ?)',
            [user.id, user.email, user.password]
        );
        return user;
    }

    async findById(id: string): Promise<User | null> {
        const [rows] = await this.pool.execute(
            'SELECT * FROM users WHERE _id = ?',
            [id]
        );
        const row = (rows as any[])[0];
        if (!row) return null;
        
        const user = new User(row._email, row._password);
        Object.defineProperty(user, '_id', { value: row._id });
        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        const [rows] = await this.pool.execute(
            'SELECT * FROM users WHERE _email = ?',
            [email]
        );
        const row = (rows as any[])[0];
        if (!row) return null;

        const user = new User(row._email, row._password);
        Object.defineProperty(user, '_id', { value: row._id });
        return user;
    }

    async update(id: string, userData: Partial<User>): Promise<User | null> {
        const fields = [];
        const values = [];
        
        if ('email' in userData) {
            fields.push('_email = ?');
            values.push(userData.email);
        }
        if ('password' in userData) {
            fields.push('_password = ?');
            values.push(userData.password);
        }
        
        if (fields.length === 0) return null;
        
        values.push(id);
        await this.pool.execute(
            `UPDATE users SET ${fields.join(', ')} WHERE _id = ?`,
            values
        );
        
        return this.findById(id);
    }

    async delete(id: string): Promise<void> {
        await this.pool.execute('DELETE FROM users WHERE _id = ?', [id]);
    }

    async list(): Promise<User[]> {
        const [rows] = await this.pool.execute('SELECT * FROM users');
        return (rows as any[]).map(row => {
            const user = new User(row._email, row._password);
            Object.defineProperty(user, '_id', { value: row._id });
            return user;
        });
    }
}
