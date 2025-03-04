import { User } from "./user.model";

export class Loan {
    id?:number;
    user?: User;
    loanAmount?:number;
    purpose?:string;
    loanVarient?:string;
    assignedManager?: User;
    interestRatePerAnnum?:number;
    tenure?:string;
    emiAmount?:number;
    dueDate?:Date;
    status?:"PENDING"|"APPROVED"|"REJECTED";
    createdAt?:Date;
    updatedAt?:Date;
    approverName?:string;
}