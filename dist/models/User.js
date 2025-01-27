"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(email, password) {
        this._id = crypto.randomUUID();
        this._email = this.validateEmail(email);
        this._password = password;
    }
    get id() {
        return this._id;
    }
    get email() {
        return this._email;
    }
    get password() {
        return this._password;
    }
    set email(email) {
        this._email = this.validateEmail(email);
    }
    set password(password) {
        if (password.length < 6) {
            throw new Error('A senha deve ter pelo menos 6 caracteres');
        }
        this._password = password;
    }
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Email inválido');
        }
        return email;
    }
    toJSON() {
        return {
            id: this._id,
            email: this._email,
            password: this._password
        };
    }
}
exports.User = User;
