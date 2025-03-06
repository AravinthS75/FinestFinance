import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoanService } from '../../services/loan.service';
import { Loan } from '../../models/loan.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-apply-personal-loan',
  standalone: false,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './user-apply-personal-loan.component.html',
  styleUrls: ['./user-apply-personal-loan.component.css' ]
})
export class UserApplyPersonalLoanComponent implements OnInit {

  loanForm!: FormGroup;
  isSuccess: boolean = false;
  emiAmount: number = 0;
  eligibility: number = 0;
  userId: number | null = null;
  interestRatePerAnnum: number = 11;
  userData: string | null = null;
  token: string = '';

  // Store the information from Bajaj Finserv page here.  Expanded details.
  features: string[] = [
    "Quick disbursal: Get your loan amount disbursed within 24 hours* of approval.",
    "Flexible tenure: Choose a repayment tenure that suits your financial situation, ranging from 12 to 60 months.",
    "Minimal documentation: Apply for a personal loan with minimal paperwork and a hassle-free process.",
    "No collateral required: Enjoy the benefit of unsecured loans, eliminating the need to pledge any assets as collateral."
  ];
  eligibilityCriteria: any = {
    age: "21-67 years: Applicants must be within this age range at the time of application.",
    employment: "Salaried or self-employed: Open to both salaried individuals and self-employed professionals.",
    income: "Minimum income as specified by Bajaj Finserv: Meet the minimum monthly income criteria to qualify.",
    creditScore: "Good credit score required: A strong credit history improves your chances of approval and may get you better rates."
  };
  applicationSteps: string[] = [
    "Fill out the online application form: Provide your personal, financial, and employment details accurately.",
    "Submit required documents: Upload scanned copies of necessary documents such as ID proof, address proof, and income proof.",
    "Get approval: Our team will review your application and documents to determine your eligibility.",
    "Receive disbursal: Upon approval, the loan amount will be disbursed to your bank account within a short period."
  ];

  loanBenefits = [
        {
            title: 'Multiple loan benefits',
            description: 'Get loan for wedding, travel, home renovation & more'
        },
        {
            title: 'High loan amount',
            description: 'Personal loan up to 25 lakh'
        },
        {
            title: 'Flexible tenure',
            description: 'Personal loan repayment tenure between 6 months to 5 years'
        }
    ];

  constructor(private fb: FormBuilder, private loanService: LoanService) {
    this.initializeForm();
    this.initializeUserData();
  }

  ngOnInit(): void {
    this.calculateEMI();
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  private initializeForm(): void {
    this.loanForm = this.fb.group({
      loanAmount: [25000, [
        Validators.required,
        Validators.min(25000),
        Validators.max(2000000)
      ]],
      purpose: ['', [Validators.required, this.noWhitespaceValidator]], 
      tenure: [1, [Validators.required, Validators.min(1), Validators.max(10)]]
    });

    this.loanForm.valueChanges.subscribe(() => {
      this.calculateEMI();
    });
  }

  private noWhitespaceValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (control.value && control.value.trim().length === 0) {
      return { 'whitespace': true };
    }
    return null;
  }  

  private initializeUserData(): void {
    this.userData = sessionStorage.getItem('authUser');
    if (this.userData) {
      const userDetails = JSON.parse(this.userData);
      this.userId = userDetails.userId || null;
      this.token = userDetails.token || '';
    }
  }

  closeSuccess(): void {
    this.isSuccess = false;
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
          this.isSuccess = true;
          this.initializeForm();
        },
        error: (err) => {
          console.error('Loan application failed:', err);
          Swal.fire({
            title: 'Error!',
            text: 'Failed to submit the loan application. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK',
            backdrop: true
          });
        }
      });
    }
  }
}