import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ViewEncapsulation } from '@angular/core';
import { Loan } from '../../models/loan.model';
import { saveAs } from 'file-saver';
import { AdminService } from '../../services/admin.service';
import { LoanService } from '../../services/loan.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ManagerService } from '../../services/manager.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-manager-view-loan',
  standalone: false,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './manager-view-loan.component.html',
  styleUrl: './manager-view-loan.component.css',
  animations: [
      trigger('cardAnim', [
        state('void', style({ transform: 'scale(0.9)', opacity: 0 })),
        transition(':enter', [
          animate('300ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
        ])
      ])
    ]
})
export class ManagerViewLoanComponent {
  loans: Loan[] = [];
  loanUser: any = {};
  selectedLoan: Loan | null = null;
  userData: string | null = null;
  managerName: string | null = null;
  token: string = '';
  showAllDetailsPopup: boolean = false;
  error: string = '';
  userProfilePicture: string | ArrayBuffer | null = 'assets/images/default-profile.png';
  isLoading: boolean = false;
  currentPage = 1;
  itemsPerPage = 4;
  statusFilter = '';
  variantFilter = '';
  amountFilter = 100000000;
  amountRange = 100000000;
  showDocumentPopup = false;
  selectedDocumentUrl: SafeResourceUrl | null = null;
  selectedDocumentType: 'aadhar' | 'pan' | null = null;

  rejectionReasons: string[] = [
    "Insufficient Income",
    "Poor Credit History",
    "Incomplete Documentation",
    "High Debt-to-Income Ratio",
    "Other"
  ];

  showRejectionPopup: boolean = false;
  selectedRejectionReason: string | null = null;

  constructor(private managerService: ManagerService, private loanService: LoanService,
    private sanitizer: DomSanitizer) {
    this.userData = sessionStorage.getItem('authUser');
    if (this.userData) {
      const userDetails = JSON.parse(this.userData);
      this.token = userDetails.token;
      this.managerName = userDetails.name;
    } else {
      console.error('No user data found in sessionStorage');
    }
  }

  ngOnInit(): void {
    if(this.loans.length === 0)
    this.isLoading = true;
    if(this.managerName!=null){
    this.managerService.getAllAssignedLoans(this.token, this.managerName).subscribe(
      (data) => {
        this.loans = data;
        if(data)
        this.isLoading = false;
      },
      (errorResponse: HttpErrorResponse) => {
        if(errorResponse.error.message === "Cannot invoke \"java.util.List.isEmpty()\" because \"managedLoans\" is null")
        this.error = 'You have no managed loans';
        else
        this.error = errorResponse.error.message || 'Failed to load data';
        this.isLoading = false;
      }
    );
  }
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
  }

  closeLoanDetails(): void {
    this.selectedLoan = null;
  }

  approveLoan(): void {
    if (this.selectedLoan?.id) {
      const action$ = this.managerService.updateLoanStatus(this.token, this.selectedLoan.id, 'APPROVED', "");
  
      action$.subscribe({
        next: (updatedLoan) => {
          const index = this.loans.findIndex(l => l.id === updatedLoan.id);
          if (index > -1) {
            this.loans[index] = updatedLoan;
          }
          this.selectedLoan = null;
          this.ngOnInit();
        },
        error: (err) => {
          console.error('Error updating status:', err);
          this.error = 'Failed to update loan status';
        }
      });
    }
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

  openAllDetailsPopup() {
    this.showAllDetailsPopup = true;
  }

  closeAllDetailsPopup() {
      this.showAllDetailsPopup = false;
  }

  exportToCSV() {
    let csvContent = 'Borrower Name, Borrower Email, Borrower Phone, Loan Variant, Status, Loan Amount, Purpose, Approver Name, Interest Rate, Tenure, EMI Ammount\n';
    this.loans.forEach(loan => {
      csvContent += `${loan.user?.name},${loan.user?.email},${loan.user?.phone},${loan.loanVarient},${loan.status},${loan.loanAmount},${loan.purpose},${loan.approverName},${loan.interestRatePerAnnum}% p.a,${loan.tenure} months,${loan.emiAmount}\n`;
    });
    const blob = new Blob([csvContent], { type: 'text/csv' });
    saveAs(blob, 'loans_data.csv');
  }

  openDocumentPopup(type: 'aadhar' | 'pan') {
    this.selectedDocumentType = type;
    console.log('Selected Document Type:', type);
    console.log('Aadhar Card Data:', this.selectedLoan?.aadharCard);
    console.log('Pan Card Data:', this.selectedLoan?.panCard);
  
    this.selectedDocumentUrl = type === 'aadhar' 
        ? this.getSafeAadharUrl() 
        : this.getSafePanUrl();
    
    console.log('Selected Document URL:', this.selectedDocumentUrl);
    this.showDocumentPopup = true;
  }
  
  closeDocumentPopup() {
    this.showDocumentPopup = false;
    this.selectedDocumentUrl = null;
    this.selectedDocumentType = null;
  }
  
  getSafeAadharUrl(): SafeResourceUrl | null {
    if (this.selectedLoan?.aadharCard) {
        const pdfData = this.selectedLoan.aadharCard;
        const blob = this.base64ToBlob(pdfData, 'application/pdf');
        const url = URL.createObjectURL(blob);
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    return null;
  }
  
  getSafePanUrl(): SafeResourceUrl | null {
    if (this.selectedLoan?.panCard) {
        const pdfData = this.selectedLoan.panCard;
        const blob = this.base64ToBlob(pdfData, 'application/pdf');
        const url = URL.createObjectURL(blob);
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    return null;
  }
  
  base64ToBlob(base64Data: string, contentType: string): Blob {
    const base64WithoutPrefix = base64Data.split(',')[1] || base64Data;
    const byteCharacters = atob(base64WithoutPrefix);
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
  
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
  
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
  
    return new Blob(byteArrays, { type: contentType });
  }
  
// Helper function to download base64 as PDF
downloadAadharPdf() {
    if (this.selectedLoan?.aadharCard) {
        const pdfData = this.selectedLoan.aadharCard;
        const blob = this.base64ToBlob(pdfData, 'application/pdf');
        saveAs(blob, 'aadhar_card.pdf');
    }
}

downloadPanPdf() {
    if (this.selectedLoan?.panCard) {
        const pdfData = this.selectedLoan.panCard;
        const blob = this.base64ToBlob(pdfData, 'application/pdf');
        saveAs(blob, 'pan_card.pdf');
    }
}

openRejectionPopup() {
  this.showRejectionPopup = true;
  this.selectedRejectionReason = null;
}

closeRejectionPopup() {
  this.showRejectionPopup = false;
  this.selectedRejectionReason = null;
}

// Method to select a rejection reason
selectRejectionReason(reason: string) {
  this.selectedRejectionReason = reason;
}

confirmRejection() {
  if (this.selectedRejectionReason && this.selectedLoan?.id) {
    this.managerService.updateLoanStatus(this.token, this.selectedLoan.id, 'REJECTED', this.selectedRejectionReason)
      .subscribe({
        next: (updatedLoan) => {
          const index = this.loans.findIndex(l => l.id === updatedLoan.id);
          if (index > -1) {
            this.loans[index] = updatedLoan;
          }
          this.closeRejectionPopup();
          this.selectedLoan = null;
          this.ngOnInit();
        },
        error: (err) => {
          console.error('Error rejecting loan:', err);
          this.error = 'Failed to reject the loan';
        }
      });
  }
}
}
