import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoanService } from '../../services/loan.service';
import { Loan } from '../../models/loan.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-apply-home-loan',
  standalone: false,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './user-apply-home-loan.component.html',
  styleUrls: ['./user-apply-home-loan.component.css']
})
export class UserApplyHomeLoanComponent implements OnInit {

  @ViewChild('aadharInput') aadharInput!: ElementRef;
  @ViewChild('panInput') panInput!: ElementRef;

  loanForm!: FormGroup;
  isSuccess: boolean = false;
  emiAmount: number = 0;
  eligibility: number = 0;
  userId: number | null = null;
  interestRatePerAnnum: number = 8.5;
  userData: string | null = null;
  token: string = '';

  aadharFile: File | null = null;
  panFile: File | null = null;

  propertyTypes: string[] = ['Apartment', 'Independent House', 'Villa', 'Plot'];
  employmentTypes: string[] = ['Salaried', 'Self-Employed'];

  loanPurposes: string[] = [
    'Purchase of New Property',
    'Construction of House',
    'Home Renovation',
    'Balance Transfer',
    'Other'
  ];

  showOtherPurposeInput: boolean = false;

  features: string[] = [
    "High Loan Amounts: Finance your dream home with substantial loan amounts.",
    "Competitive Interest Rates: Benefit from some of the best interest rates in the market.",
    "Flexible Repayment Options: Choose a repayment plan that aligns with your financial goals.",
    "Quick Approvals: Get your loan approved swiftly with our efficient process."
  ];

  eligibilityCriteria: any = {
    age: "21 - 65 years: Applicants should be within this age range.",
    employment: "Stable income: Proof of stable employment or business.",
    creditScore: "750+: A good credit score improves chances of approval."
  };

  documentsRequired: any = {
    KYC_Documents: "KYC Documents (identity and address proof)",
    income_proof: "Proof of income (salary slips or P&L statement)",
    business_proof: "Proof of business (for self-employed applicants), and",
    account_Statements: "Account statements for the last 6 months"
  }

  applicationSteps: string[] = [
    "Complete the Online Application: Fill in the required details in our easy-to-use form.",
    "Upload Necessary Documents: Provide scanned copies of your ID, address, and income proofs.",
    "Get Loan Approval: Our experts will review your application and verify the documents.",
    "Receive Loan Disbursement: Once approved, the loan amount is disbursed to your account."
  ];

  loanBenefits = [
    {
      title: 'Affordable EMI Options',
      description: 'Manage your monthly payments with our tailored EMI plans.'
    },
    {
      title: 'Dedicated Support',
      description: 'Get assistance from our dedicated team throughout the loan process.'
    },
    {
      title: 'Minimal Documentation',
      description: 'Enjoy a hassle-free process with our reduced documentation requirements.'
    }
  ];

  constructor(private fb: FormBuilder, private loanService: LoanService) {
    this.initializeForm();
    this.initializeUserData();
  }

  ngOnInit(): void {
    this.calculateEMI();
    this.loanForm.valueChanges.subscribe(() => {
      this.calculateEMI();
    });

    this.loanForm.get('purpose')?.valueChanges.subscribe(value => {
      this.showOtherPurposeInput = value === 'Other';
      if (this.showOtherPurposeInput) {
        this.loanForm.addControl('otherPurposeDescription', this.fb.control('', [Validators.required, this.noWhitespaceValidator]));
      } else {
        this.loanForm.removeControl('otherPurposeDescription');
      }
      this.loanForm.patchValue({
        aadhar: this.aadharFile ? this.aadharFile.name : null,
        pancard: this.panFile ? this.panFile.name : null
      });
    });
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }


  private initializeForm(): void {
    this.loanForm = this.fb.group({
      loanAmount: [500000, [
        Validators.required,
        Validators.min(400000),
        Validators.max(150000000)
      ]],
      propertyType: ['', Validators.required],
      employmentType: ['', Validators.required],
      purpose: ['', Validators.required],
      tenure: [10, [Validators.required, Validators.min(10), Validators.max(32)]],
      aadhar: [null, [Validators.required]],
      pancard: [null, [Validators.required]]
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
    const tenureYears = this.loanForm.value.tenure || 10;
    const monthlyRate = this.interestRatePerAnnum / 1200;
    const months = tenureYears * 12;

    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    this.emiAmount = isNaN(emi) ? 0 : emi;
  }


  onFileChange(event: Event, type: 'aadhar' | 'pan'): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    const control = type === 'aadhar' ? this.loanForm.get('aadhar') : this.loanForm.get('pancard');
  
    if (file) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      
      if (extension !== 'pdf') {
        control?.setErrors({ invalidFile: true });
        return;
      }
  
      if (type === 'aadhar') {
        this.aadharFile = file;
      } else {
        this.panFile = file;
      }
  
      control?.setErrors(null);
      control?.setValue(file.name);
    } else {
      control?.setErrors({ required: true });
      control?.markAsTouched();
    }
  }

  onSubmit(): void {
    // Manual validation check
    let isValid = true;
    
    if (!this.aadharFile) {
      this.loanForm.get('aadhar')?.setErrors({ required: true });
      isValid = false;
    }
    
    if (!this.panFile) {
      this.loanForm.get('pancard')?.setErrors({ required: true });
      isValid = false;
    }

    if (!isValid || !this.loanForm.valid || !this.token) {
      this.loanForm.markAllAsTouched();
      return;
    }

    const loanData: Loan = {
      ...this.loanForm.value,
      loanVarient: 'home',
      interestRatePerAnnum: this.interestRatePerAnnum,
      emiAmount: this.emiAmount,
      tenure: this.loanForm.value.tenure * 12,
      status: 'PENDING',
      createdAt: new Date(),
      pendingAmount: this.loanForm.value.loanAmount,
      dueDate: null,
      updatedAt: null,
      aadharCard: '', // Placeholder for base64 data
      panCard: ''     // Placeholder for base64 data
    };

    if (this.showOtherPurposeInput && this.loanForm.get('otherPurposeDescription')) {
      loanData.purpose = this.loanForm.get('otherPurposeDescription')?.value;
    }

    Promise.all([
      this.readFileAsBase64(this.aadharFile!),
      this.readFileAsBase64(this.panFile!)
    ]).then(([aadharBase64, panBase64]) => {
      loanData.aadharCard = aadharBase64;
      loanData.panCard = panBase64;

      this.loanService.userApplyPersonalLoan(this.token, this.userId, loanData).subscribe({
        next: (response) => {
          console.log('Loan application successful:', response);
          this.isSuccess = true;
          this.initializeForm();
          this.aadharFile = null;
          this.panFile = null;
          this.aadharInput.nativeElement.value = '';
          this.panInput.nativeElement.value = '';
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
    }).catch((error) => {
      console.error('Error reading files:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to process the uploaded files. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
        backdrop: true
      });
    });
  }

  private readFileAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.result && typeof reader.result === 'string') {
          const base64String = reader.result.split(',')[1];
          if (base64String) {
            resolve(base64String);
          } else {
            reject(new Error('Failed to extract base64 data from file.'));
          }
        } else {
          reject(new Error('FileReader result is not a valid string.'));
        }
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  }

}