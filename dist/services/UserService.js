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
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = require("../models/User");
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.SALT_ROUNDS = 10;
    }
    create(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this.userRepository.findByEmail(email);
            if (existingUser) {
                throw new Error('Email já está em uso');
            }
            const hashedPassword = yield bcrypt_1.default.hash(password, this.SALT_ROUNDS);
            const user = new User_1.User(email, hashedPassword);
            return this.userRepository.create(user);
        });
    }
    authenticate(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(email);
            const user = yield this.userRepository.findByEmail(email);
            if (!user) {
                throw new Error('Email ou senha inválidos');
            }
            const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error('Email ou senha inválidos');
            }
            return user;
        });
    }
    updatePassword(userId, currentPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findById(userId);
            if (!user) {
                throw new Error('Usuário não encontrado');
            }
            const isPasswordValid = yield bcrypt_1.default.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                throw new Error('Senha atual incorreta');
            }
            const hashedPassword = yield bcrypt_1.default.hash(newPassword, this.SALT_ROUNDS);
            const updatedUser = yield this.userRepository.update(userId, { password: hashedPassword });
            if (!updatedUser) {
                throw new Error('Falha ao atualizar a senha');
            }
            return updatedUser;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findById(id);
            if (!user) {
                throw new Error('Usuário não encontrado');
            }
            return user;
        });
    }
    update(id, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findById(id);
            if (!user) {
                throw new Error('Usuário não encontrado');
            }
            if (email) {
                const existingUser = yield this.userRepository.findByEmail(email);
                if (existingUser && existingUser.id !== id) {
                    throw new Error('Email já está em uso');
                }
            }
            const updatedUser = yield this.userRepository.update(id, { email });
            if (!updatedUser) {
                throw new Error('Falha ao atualizar usuário');
            }
            return updatedUser;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findById(id);
            if (!user) {
                throw new Error('Usuário não encontrado');
            }
            yield this.userRepository.delete(id);
        });
    }
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepository.list();
        });
    }
}
exports.UserService = UserService;
