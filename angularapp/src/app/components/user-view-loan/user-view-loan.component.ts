import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LoanService } from '../../services/loan.service';
import { AuthService } from '../../services/auth.service';
import { Loan } from '../../models/loan.model';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService
import { trigger, state, style, transition, animate } from '@angular/animations'; // Import animations

@Component({
  selector: 'app-user-view-loan',
  standalone: false,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './user-view-loan.component.html',
  styleUrl: './user-view-loan.component.css',
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition(':enter, :leave', [
        animate('0.3s ease-in-out')
      ])
    ])
  ]
})
export class UserViewLoanComponent implements OnInit {
  loans: Loan[] = [];
  selectedLoan: Loan | null = null;
  userId: number | null = null;
  userData: string | null = null;
  tenure: number | null = null;
  token: string | null = null;
  isLoading: boolean = true;
  isPyaing: boolean = false;

  showPaymentSuccess: boolean = false;
  showPaymentError: boolean = false;
  paymentErrorMessage: string = '';

  constructor(
    private loanService: LoanService,
    private authService: AuthService,
    private toastr: ToastrService // Inject ToastrService
  ) {
    this.userData = sessionStorage.getItem('authUser');
    if (this.userData) {
      const userDetails = JSON.parse(this.userData);
      this.token = userDetails.token;
      this.userId = userDetails.userId;
    } else {
      console.error('No user data found in sessionStorage');
    }
  }

  ngOnInit(): void {
    if (this.token && this.userId) {
      this.loanService.getLoansByUserId(this.token, this.userId).subscribe({
        next: (loans) => {
          this.loans = loans;
          this.isLoading = false;
        },
        error: (err) => console.error('Error fetching loans:', err)
      });
    }
  }

  openModal(loan: Loan): void {
    this.selectedLoan = loan;
    this.tenure = loan.tenure ? Number(loan.tenure) : 0;
    console.log(loan);
  }

  closeModal(): void {
    this.selectedLoan = null;
  }

  payEmi(): void {
    if (!this.selectedLoan || !this.token || !this.selectedLoan.id) return;
    this.isPyaing = true;
    this.showPaymentSuccess = false;
    this.showPaymentError = false;

    this.loanService.payEmi(this.token, this.selectedLoan.id).subscribe({
      next: (updatedLoan) => {
        const index = this.loans.findIndex(loan => loan.id === updatedLoan.id);
        if (index !== -1) this.loans[index] = updatedLoan;
        this.isPyaing = false;
        this.showPaymentSuccess = true; // Show success popup
        this.toastr.success('EMI payment processed successfully!', 'Success'); // Toast notification
        console.log("EMI paid successfully. Updated loan:", updatedLoan);
        this.selectedLoan = updatedLoan;
      },
      error: (err) => {
        this.isPyaing = false;
        this.showPaymentError = true; // Show error popup
        this.paymentErrorMessage = err.message || 'An error occurred while processing the payment.';
        this.toastr.error('Failed to process EMI payment.', 'Error'); // Toast notification
        console.error('Error paying EMI:', err);
      }
    });
  }

  retryPayment(): void {
    this.showPaymentError = false;
    this.payEmi();
  }

  closePaymentSuccessPopup(): void {
    this.showPaymentSuccess = false;
  }

  closePaymentErrorPopup(): void {
    this.showPaymentError = false;
  }
}