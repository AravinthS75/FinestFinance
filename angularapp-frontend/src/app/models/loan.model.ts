import { User } from "./user.model";

export class Loan {
    id?:number;
    user?: User;
    loanAmount?:number;
    purpose?:string;
    loanVarient?:string;
    propertyType?:string;
    employmentType?:string;
    businessType?:string;
    assignedManager?: User;
    interestRatePerAnnum?:number;
    tenure?:string;
    emiAmount?:number;
    pendingAmount?:number;
    dueDate?:Date;
    rejectReason?: string;
    status?:"PENDING"|"APPROVED"|"REJECTED"|"COMPLETED";
    createdAt?:Date;
    updatedAt?:Date;
    approverName?:string;
    aadharCard?: string;
    panCard?: string;
}