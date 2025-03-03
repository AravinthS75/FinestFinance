import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoanService } from '../../services/loan.service';
import { Loan } from '../../models/loan.model';

@Component({
  selector: 'app-user-apply-personal-loan',
  standalone: false,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './user-apply-personal-loan.component.html',
  styleUrl: './user-apply-personal-loan.component.css'
})
export class UserApplyPersonalLoanComponent {
  loanForm!: FormGroup;
  emiAmount: number = 0;
  userId: number | null= null;
  interestRatePerAnnum: number = 12.5;
  userData: string | null = null;
  token: string = '';

  constructor(private fb: FormBuilder, private loanService: LoanService) {
    this.initializeForm();
    this.initializeUserData();
  }

  private initializeForm(): void {
    this.loanForm = this.fb.group({
      loanAmount: [50000, [
        Validators.required,
        Validators.min(10000),
        Validators.max(1000000)
      ]],
      purpose: ['', [Validators.required, Validators.maxLength(200)]],
      tenure: [5, [Validators.required, Validators.min(1), Validators.max(10)]]
    });

    this.loanForm.valueChanges.subscribe(() => this.calculateEMI());
  }

  private initializeUserData(): void {
    this.userData = sessionStorage.getItem('authUser');
    if (this.userData) {
      const userDetails = JSON.parse(this.userData);
      console.log(userDetails);
      this.userId = userDetails.userId || null;
      this.token = userDetails.token || '';
    }
  }

  calculateEMI(): void {
    const principal = this.loanForm.value.loanAmount || 0;
    const tenureYears = this.loanForm.value.tenure || 5;
    const monthlyRate = this.interestRatePerAnnum / 1200;
    const months = tenureYears * 12;
    
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                (Math.pow(1 + monthlyRate, months) - 1);
    this.emiAmount = isNaN(emi) ? 0 : emi;
  }

  onSubmit(): void {
    if (this.loanForm.valid && this.token) {
      const loanData: Loan = {
        ...this.loanForm.value,
        loanVarient: 'personal',
        interestRatePerAnnum: this.interestRatePerAnnum,
        emiAmount: this.emiAmount,
        status: 'PENDING',
        createdAt: new Date(),
        pendingAmount: this.loanForm.value.loanAmount,
        dueDate: null, // Initially, this can be null and updated later
        updatedAt: null // Initially, this can be null and updated later
      };
  
      this.loanService.userApplyPersonalLoan(this.token, this.userId, loanData).subscribe({
        next: (response) => {
          console.log('Loan application successful:', response);
          // Handle success (show message/reset form)
        },
        error: (err) => {
          console.error('Loan application failed:', err);
          // Handle error
        }
      });
    }
  }
}
