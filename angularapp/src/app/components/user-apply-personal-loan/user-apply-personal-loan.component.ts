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
  eligibility: number = 0;
  userId: number | null= null;
  interestRatePerAnnum: number = 11;
  userData: string | null = null;
  token: string = '';

  constructor(private fb: FormBuilder, private loanService: LoanService) {
    this.initializeForm();
    this.initializeUserData();
  }

  private initializeForm(): void {
    this.loanForm = this.fb.group({
      loanAmount: [100000, [
        Validators.required,
        Validators.min(25000),
        Validators.max(2000000)
      ]],
      purpose: ['', Validators.required],
      employmentType: ['SALARIED', Validators.required],
      monthlyIncome: [50000, [
        Validators.required,
        Validators.min(15000)
      ]],
      tenure: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      city: ['', Validators.required]
    });

    this.loanForm.valueChanges.subscribe(() => {
      this.calculateEMI();
      this.calculateEligibility();
    });
  }

  calculateEligibility(): void {
    const income = this.loanForm.value.monthlyIncome || 0;
    this.eligibility = income * 18; // 18 times monthly income
    this.eligibility = Math.min(this.eligibility, 2000000);
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
