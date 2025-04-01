import { Component, ViewEncapsulation, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoanService } from '../../services/loan.service';
import { Loan } from '../../models/loan.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-apply-business-loan',
  standalone: false,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './user-apply-business-loan.component.html',
  styleUrls: ['./user-apply-business-loan.component.css']
})
export class UserApplyBusinessLoanComponent implements OnInit {

  @ViewChild('aadharInput') aadharInput!: ElementRef;
  @ViewChild('panInput') panInput!: ElementRef;

  loanForm!: FormGroup;
  isSuccess: boolean = false;
  emiAmount: number = 0;
  eligibility: number = 0;
  userId: number | null = null;
  interestRatePerAnnum: number = 18;
  userData: string | null = null;
  token: string = '';

  aadharFile: File | null = null;
  panFile: File | null = null;

  businessTypes: string[] = [
    'Sole Proprietorship',
    'Partnership',
    'Private Limited Company',
    'Limited Liability Partnership (LLP)',
    'Other'
  ];

  collateralOptions: string[] = ['Yes', 'No'];

  loanPurposes: string[] = [
    'Working Capital',
    'Equipment Purchase',
    'Expansion',
    'Marketing',
    'Other'
  ];

  features: string[] = [
    "High loan amount: Get access to significant funding to fuel your business growth.",
    "Flexible tenure: Choose a repayment tenure that suits your business cash flow.",
    "Competitive interest rates: Benefit from attractive interest rates to optimize your loan costs.",
    "Quick approval process: Experience a streamlined application process for faster loan disbursal."
  ];

  eligibilityCriteria: any = {
    businessAge: "Minimum 2 years: Your business should have been operational for at least 2 years.",
    annualTurnover: "As per lender's requirement: Meet the minimum annual turnover criteria specified by the lender.",
    creditScore: "Good credit score: A healthy credit score improves your chances of loan approval."
  };

  documentsRequired: any = {
    KYC_Documents: "KYC Documents: Aadhaar/ passport/ voter's ID/ driving license",
    pan_Card: "PAN card",
    business_proof: "Proof of business ownership",
    finalcials_Documents: "Other financial documents"
  }

  applicationSteps: string[] = [
    "Fill out the online application form: Provide accurate details about your business and financial information.",
    "Submit required documents: Upload scanned copies of necessary documents such as business registration, financial statements, and KYC documents.",
    "Get approval: Our team will review your application and documents to determine your eligibility.",
    "Receive disbursal: Upon approval, the loan amount will be disbursed to your business bank account."
  ];

  loanBenefits = [
    {
      title: 'Funding for business growth',
      description: 'Get the funds you need to expand your business operations'
    },
    {
      title: 'Competitive interest rates',
      description: 'Benefit from attractive interest rates to optimize your loan costs'
    },
    {
      title: 'Flexible repayment options',
      description: 'Choose a repayment tenure that aligns with your business cash flow'
    }
  ];

  showOtherPurposeInput: boolean = false;

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
      loanAmount: [7500000, [
        Validators.required,
        Validators.min(200000),
        Validators.max(7500000)
      ]],
      businessType: ['', Validators.required],
      purpose: ['', Validators.required],
      tenure: [1, [Validators.required, Validators.min(1), Validators.max(5)]],
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
    const tenureYears = this.loanForm.value.tenure || 5;
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
      loanVarient: 'business',
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