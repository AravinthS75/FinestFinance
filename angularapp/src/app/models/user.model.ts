export interface User {
    id?:number
    email?:String
    password?:String
    name?:String
    phone?:String
    role?: "ADMIN" | "MANAGER" | "USER";
}