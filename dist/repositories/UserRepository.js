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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const User_1 = require("../models/User");
const promise_1 = __importDefault(require("mysql2/promise"));
const database_1 = require("../config/database");
class UserRepository {
    constructor() {
        this.pool = promise_1.default.createPool(database_1.dbConfig);
    }
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield this.pool.execute('INSERT INTO users (_id, _email, _password) VALUES (?, ?, ?)', [user.id, user.email, user.password]);
            return user;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield this.pool.execute('SELECT * FROM users WHERE _id = ?', [id]);
            const row = rows[0];
            if (!row)
                return null;
            const user = new User_1.User(row._email, row._password);
            Object.defineProperty(user, '_id', { value: row._id });
            return user;
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield this.pool.execute('SELECT * FROM users WHERE _email = ?', [email]);
            const row = rows[0];
            if (!row)
                return null;
            const user = new User_1.User(row._email, row._password);
            Object.defineProperty(user, '_id', { value: row._id });
            return user;
        });
    }
    update(id, userData) {
        return __awaiter(this, void 0, void 0, function* () {
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
            if (fields.length === 0)
                return null;
            values.push(id);
            yield this.pool.execute(`UPDATE users SET ${fields.join(', ')} WHERE _id = ?`, values);
            return this.findById(id);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.pool.execute('DELETE FROM users WHERE _id = ?', [id]);
        });
    }
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield this.pool.execute('SELECT * FROM users');
            return rows.map(row => {
                const user = new User_1.User(row._email, row._password);
                Object.defineProperty(user, '_id', { value: row._id });
                return user;
            });
        });
    }
}
exports.UserRepository = UserRepository;
