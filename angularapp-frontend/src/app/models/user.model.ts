import { Loan } from "./loan.model";

export interface User {
    id?: number;
    email?: string;
    password?: string;
    name?: string;
    phone?: string;
    loans?: Loan[];
    managedLoans?: Loan[];
    address?: string;
    profilePicture?: string;
    mimeType?: string;
    role?: "ADMIN" | "MANAGER" | "USER";
}