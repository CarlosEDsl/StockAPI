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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const user = yield this.userService.create(email, password);
                const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
                return res.status(201).json(userWithoutPassword);
            }
            catch (error) {
                return res.status(400).json({
                    error: error instanceof Error ? error.message : 'Erro ao criar usuário'
                });
            }
        });
    }
    authenticate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    return res.status(400).json({
                        error: 'Email e senha são obrigatórios'
                    });
                }
                const user = yield this.userService.authenticate(email, password);
                const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
                return res.json({
                    user: userWithoutPassword
                });
            }
            catch (error) {
                return res.status(401).json({
                    error: 'Credenciais inválidas'
                });
            }
        });
    }
    findById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const user = yield this.userService.findById(id);
                const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
                return res.json(userWithoutPassword);
            }
            catch (error) {
                return res.status(404).json({
                    error: error instanceof Error ? error.message : 'Usuário não encontrado'
                });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const user = yield this.userService.update(id, email);
                const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
                return res.json(userWithoutPassword);
            }
            catch (error) {
                return res.status(400).json({
                    error: error instanceof Error ? error.message : 'Erro ao atualizar usuário'
                });
            }
        });
    }
    updatePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                yield this.userService.updatePassword(id, currentPassword, newPassword);
                return res.status(204).send();
            }
            catch (error) {
                return res.status(400).json({
                    error: error instanceof Error ? error.message : 'Erro ao atualizar senha'
                });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield this.userService.delete(id);
                return res.status(204).send();
            }
            catch (error) {
                return res.status(404).json({
                    error: error instanceof Error ? error.message : 'Erro ao deletar usuário'
                });
            }
        });
    }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.userService.list();
                const usersWithoutPassword = users.map(user => {
                    const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
                    return userWithoutPassword;
                });
                return res.json(usersWithoutPassword);
            }
            catch (error) {
                return res.status(400).json({
                    error: 'Erro ao listar usuários'
                });
            }
        });
    }
}
exports.UserController = UserController;
