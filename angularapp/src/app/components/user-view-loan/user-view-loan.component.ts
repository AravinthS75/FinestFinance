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
  error: string | null = null;
  tenure: number | null = null;
  token: string | null = null;
  isLoading: boolean = true;
  isPyaing: boolean = false;

  statusFilter = '';
  varientFilter = '';
  amountFilter = 100000000;
  amountRange = 100000000;

  showPaymentSuccess: boolean = false;
  showPaymentError: boolean = false;
  paymentErrorMessage: string = '';

  currentPage = 1;
  itemsPerPage = 4;

  Math = Math;

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
        error: (err) => {
          console.error('Error fetching loans:', err);
          this.error = 'Error fetching loans';
        }
      });
    }
  }

  get statusOptions(): string[] {
    return [...new Set(this.loans.map(loan => loan.status).filter(status => status !== undefined))];
  }
  
  get varientOptions(): string[] {
    return [...new Set(this.loans.map(loan => loan.loanVarient).filter(varient => varient !== undefined))];
  }
  
  get filteredLoans(): Loan[] {
    return this.loans.filter(loan =>
      loan.loanAmount !== undefined &&
      (!this.statusFilter || loan.status === this.statusFilter) &&
      (!this.varientFilter || loan.loanVarient === this.varientFilter) &&
      loan.loanAmount <= this.amountFilter
    );
  }
  
  updateAmountFilter(event: any) {
    this.amountFilter = event.target.value;
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
        // Update the loans array
        const index = this.loans.findIndex(loan => loan.id === updatedLoan.id);
        if (index !== -1) {
          this.loans[index] = updatedLoan;
        }
        
        this.isPyaing = false;
        this.showPaymentSuccess = true;
        this.toastr.success('EMI payment processed successfully!', 'Success');
        this.selectedLoan = updatedLoan;
      },
      error: (err) => {
        this.isPyaing = false;
        this.showPaymentError = true;
        this.paymentErrorMessage = err.error?.message || 'Payment failed. Please try again.';
        this.toastr.error('Payment failed', 'Error');
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

  get totalPages(): number {
    return Math.ceil(this.filteredLoans.length / this.itemsPerPage);
  }
  
  get displayedLoans(): Loan[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredLoans.slice(start, start + this.itemsPerPage);
  }
  
  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }
  
  previousPage() {
    if (this.currentPage > 1) this.currentPage--;
  }
  
  goToPage(page: number) {
    this.currentPage = page;
  }
  
  getPageNumbers(): number[] {
    const pages = [];
    const maxVisiblePages = 5;
    let start = Math.max(1, this.currentPage - 2);
    let end = Math.min(this.totalPages, start + maxVisiblePages - 1);
    
    if (end - start < maxVisiblePages - 1) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

}