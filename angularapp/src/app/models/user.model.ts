export interface User {
    id?: number;
    email?: string;
    password?: string;
    name?: string;
    phone?: string;
    address?: string;
    profilePicture?: string;
    mimeType?: string;
    role?: "ADMIN" | "MANAGER" | "USER";
}