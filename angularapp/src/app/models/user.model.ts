export interface User {
    userId?:number
    email?:String
    password?:String
    username?:String
    mobileNumber?:String
    role?: "ADMIN" | "MANAGER" | "USER";

}