import { Component, ViewEncapsulation } from '@angular/core';
import { Loan } from '../../models/loan.model';
import { AdminService } from '../../services/admin.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { saveAs } from 'file-saver';
import { HttpErrorResponse } from '@angular/common/http';
import { LoanService } from '../../services/loan.service';

@Component({
  selector: 'app-admin-view-loans',
  standalone: false,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './admin-view-loans.component.html',
  styleUrl: './admin-view-loans.component.css',
  animations: [
    trigger('cardAnim', [
      state('void', style({ transform: 'scale(0.9)', opacity: 0 })),
      transition(':enter', [
        animate('300ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ])
  ]
})
export class AdminViewLoansComponent {
  loans: Loan[] = [];
  loanUser: any = {};
  selectedLoan: Loan | null = null;
  showManagerPopup = false;
  managers: any[] = [];
  managerLoading: boolean = false;
  userData: string | null = null;
  token: string = '';
  error: string = '';
  userProfilePicture: string | ArrayBuffer | null = 'assets/images/default-profile.png';
  managerProfilePicture: string | ArrayBuffer | null = 'assets/images/default-profile.png';
  isLoading: boolean = false;
  currentPage = 1;
  itemsPerPage = 4;
  statusFilter = '';
  variantFilter = '';
  amountFilter = 1000000;
  amountRange = 1000000;
  statusChart: any;
  amountChart: any;

  constructor(private adminService: AdminService, private loanService: LoanService) {
    this.userData = sessionStorage.getItem('authUser');
    if (this.userData) {
      const userDetails = JSON.parse(this.userData);
      this.token = userDetails.token;
    } else {
      console.error('No user data found in sessionStorage');
    }
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.adminService.getAllLoans(this.token).subscribe(
      (data) => {
        this.loans = data;
        console.log(data);
        if(data)
        this.isLoading = false;
        if(this.loans.length===0)
        this.error = 'No loans found!';
      },
      (errorResponse: HttpErrorResponse) => {
        this.error = errorResponse.error.message || 'Failed to load manager details';
        this.isLoading = false;
      }
    );
  }

  get statusOptions(): string[] {
    return [...new Set(this.loans.map(loan => loan.status).filter(status => status !== undefined))];
  }

  get variantOptions(): string[] {
    return [...new Set(this.loans.map(loan => loan.loanVarient).filter(variant => variant !== undefined))];
  }

  get filteredLoans(): Loan[] {
    return this.loans.filter(loan =>
      loan.loanAmount !== undefined &&
      (!this.statusFilter || loan.status === this.statusFilter) &&
      (!this.variantFilter || loan.loanVarient === this.variantFilter) &&
      loan.loanAmount <= this.amountFilter
    );
  }

  get displayedLoans(): Loan[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredLoans.slice(start, start + this.itemsPerPage);
  }

  openLoanDetails(loan: Loan): void {
    this.selectedLoan = loan;
    if (loan.user?.profilePicture) 
      this.userProfilePicture = `data:image/jpeg;base64,${loan.user.profilePicture}`;
    if(loan.assignedManager?.profilePicture)
      this.managerProfilePicture = `data:image/jpeg;base64,${loan.assignedManager.profilePicture}`;
    else
      this.managerProfilePicture = 'assets/images/default-profile.png';
  }

  closeLoanDetails(): void {
    this.selectedLoan = null;
  }

  openManagerPopup() {
    this.showManagerPopup = true;
    if(this.managers.length === 0)
    this.managerLoading = true;
    this.adminService.getAllManagers(this.token).subscribe(
      (managers) => {
        this.managers = managers.map(manager => {
          if (manager.profilePicture && !manager.profilePicture.startsWith('data:')) {
            manager.profilePicture = `data:image/jpeg;base64,${manager.profilePicture}`;
          }
          return manager;
        });
        console.log('Managers:', managers);
        this.managerLoading = false;
      },
      (error) => this.error = 'Failed to fetch managers'
    );
  }

assignManager(managerId: number) {
  if (!this.selectedLoan) return;
  const userId = this.selectedLoan.user?.id;
  const loanId = this.selectedLoan.id;
  console.log("userId: ",userId);
  console.log("loanId: ",loanId);
  console.log("managerId: ",managerId);
  if (!userId || !loanId) {
    this.error = 'Invalid user or loan ID';
    return;
  }

  this.loanService.adminSetAssignedManager(this.token, userId, loanId, managerId)
    .subscribe({
      next: (updatedLoan) => {
        this.selectedLoan = updatedLoan;
        this.showManagerPopup = false;
        this.adminService.getAllLoans(this.token).subscribe(loans => this.loans = loans);
        this.ngOnInit();
      },
      error: (err) => this.error = err.message || 'Failed to assign manager'
    });
}

  get totalPages(): number {
    return Math.ceil(this.filteredLoans.length / this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  previousPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  updateAmountFilter(event: any) {
    this.amountFilter = event.target.value;
    this.currentPage = 1;
  }

  getStatusClass(status: string | undefined): string {
    return status ? status.toLowerCase() : 'unknown';
  }

  exportToCSV() {
    let csvContent = 'Borrower Name, Borrower Email, Borrower Phone, Loan Variant, Status, Loan Amount, Purpose, Approver Name, Interest Rate, Tenure, EMI Ammount\n';
    this.loans.forEach(loan => {
      csvContent += `${loan.user?.name},${loan.user?.email},${loan.user?.phone},${loan.loanVarient},${loan.status},${loan.loanAmount},${loan.purpose},${loan.approverName},${loan.interestRatePerAnnum}% p.a,${loan.tenure} months,${loan.emiAmount}\n`;
    });
    const blob = new Blob([csvContent], { type: 'text/csv' });
    saveAs(blob, 'loans_data.csv');
  }

}
