import { Component, ViewEncapsulation } from '@angular/core';
import { Loan } from '../../models/loan.model';
import { AdminService } from '../../services/admin.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { saveAs } from 'file-saver';
import { HttpErrorResponse } from '@angular/common/http';

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
  loanManager: any = {};
  userData: string | null = null;
  token: string = '';
  error: string = '';
  isLoading: boolean = false;
  currentPage = 1;
  itemsPerPage = 2;
  statusFilter = '';
  variantFilter = '';
  amountFilter = 100000;
  amountRange = 100000;
  statusChart: any;
  amountChart: any;

  constructor(private adminService: AdminService) {
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
      },
      (errorResponse: HttpErrorResponse) => {
        this.error = errorResponse.error.message || 'Failed to load manager details';
        this.isLoading = false;
      }
    );
    this.isLoading = false;
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
    let csvContent = 'Loan Variant, Status, Loan Amount, Approver Name, Interest Rate\n';
    this.loans.forEach(loan => {
      csvContent += `${loan.loanVarient},${loan.status},${loan.loanAmount},${loan.approverName},${loan.interestRatePerAnnum}\n`;
    });
    const blob = new Blob([csvContent], { type: 'text/csv' });
    saveAs(blob, 'loans_data.csv');
  }

}
