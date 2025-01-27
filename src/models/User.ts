export class User {
    private _id: string;
    private _email: string;
    private _password: string;

    constructor(
        email: string,
        password: string
    ) {
        this._id = crypto.randomUUID();
        this._email = this.validateEmail(email);
        this._password = password;
    }

    get id(): string {
        return this._id;
    }

    get email(): string {
        return this._email;
    }

    get password(): string {
        return this._password;
    }

    set email(email: string) {
        this._email = this.validateEmail(email);
    }

    set password(password: string) {
        if (password.length < 6) {
            throw new Error('A senha deve ter pelo menos 6 caracteres');
        }
        this._password = password;
    }

    private validateEmail(email: string): string {
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
