import { User } from "./user.model";

export class Loan {
    id?:number;
    user?: User;
    amount?:number;
    purpose?:string;
    loanVariant?:string;
    interestRatePerAnnum?:number;
    tenure?:string;
    emiAmount?:number;
    dueDate?:Date;
    status?:"PENDING"|"APPROVED"|"REJECTED";
    createdAt?:Date;
    updatedAt?:Date;
    approverName?:string;
}