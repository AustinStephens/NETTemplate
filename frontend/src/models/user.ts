import { Basket } from "./basket";

export interface User {
    emailAddress: string;
    token: string;
    basket?: Basket;
}