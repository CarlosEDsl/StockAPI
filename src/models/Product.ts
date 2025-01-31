import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity("products")
export class Product {
    private _id: string;
    private _name: string;
    private _description: string;
    private _image: Blob;
    private _price: number;
    private _quantity: number;
    private _userId: string;

    constructor(
        name: string,
        description: string,
        image: Blob,
        price: number,
        quantity: number,
        userId: string,
        id?: string
    ) {
        if(!id)
            this._id = crypto.randomUUID();
        else
            this._id = id;
        this._name = name;
        this._description = description;
        this._image = image;
        this._price = price;
        this._quantity = quantity;
        this._userId = userId;
    }

    get userId(): string {
        return this._userId;
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get description(): string {
        return this._description;
    }

    get image(): Blob {
        return this._image;
    }

    get price(): number {
        return this._price;
    }

    get quantity(): number {
        return this._quantity;
    }

    set name(name: string) {
        this._name = name;
    }

    set description(description: string) {
        this._description = description;
    }

    set image(image: Blob) {
        this._image = image;
    }

    set price(price: number) {
        if (price < 0) throw new Error('O preço não pode ser negativo');
        this._price = price;
    }

    set quantity(quantity: number) {
        if (quantity < 0) throw new Error('A quantidade não pode ser negativa');
        this._quantity = quantity;
    }

    toJSON() {
        return {
            id: this._id,
            name: this._name,
            description: this._description,
            image: this._image,
            price: this._price,
            quantity: this._quantity
        };
    }
}
