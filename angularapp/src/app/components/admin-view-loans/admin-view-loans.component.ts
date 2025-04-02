import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Loan } from '../../models/loan.model';
import { AdminService } from '../../services/admin.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { saveAs } from 'file-saver';
import { HttpErrorResponse } from '@angular/common/http';
import { LoanService } from '../../services/loan.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-admin-view-loans',
    standalone: false,
    encapsulation: ViewEncapsulation.None,
    templateUrl: './admin-view-loans.component.html',
    styleUrls: ['./admin-view-loans.component.css'],
    animations: [
        trigger('cardAnim', [
            state('void', style({ transform: 'scale(0.9)', opacity: 0 })),
            transition(':enter', [
                animate('300ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
            ])
        ])
    ]
})
export class AdminViewLoansComponent implements OnInit {
    loans: Loan[] = [];
    loanUser: any = {};
    selectedLoan: Loan | null = null;
    showManagerPopup = false;
    showAllDetailsPopup: boolean = false;
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
    amountFilter = 100000000;
    amountRange = 100000000;
    statusChart: any;
    amountChart: any;
    showDocumentPopup = false;
    selectedDocumentUrl: SafeResourceUrl | null = null;
    selectedDocumentType: 'aadhar' | 'pan' | null = null;

    constructor(
        private adminService: AdminService,
        private loanService: LoanService,
        private sanitizer: DomSanitizer
    ) {
        this.userData = sessionStorage.getItem('authUser');
        if (this.userData) {
            const userDetails = JSON.parse(this.userData);
            this.token = userDetails.token;
        } else {
            console.error('No user data found in sessionStorage');
        }
    }

    ngOnInit(): void {
        if(this.loans.length==0)
        this.isLoading = true;
        this.adminService.getAllLoans(this.token).subscribe(
            (data) => {
                this.loans = data;
                if (data)
                    this.isLoading = false;
                if (this.loans.length === 0)
                    this.error = 'No loans found!';
            },
            (errorResponse: HttpErrorResponse) => {
                this.error = errorResponse.error.message || 'Failed to load loans';
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
        if (loan.assignedManager?.profilePicture)
            this.managerProfilePicture = `data:image/jpeg;base64,${loan.assignedManager.profilePicture}`;
        else
            this.managerProfilePicture = 'assets/images/default-profile.png';
    }

    closeLoanDetails(): void {
        this.selectedLoan = null;
    }

    openManagerPopup() {
        this.showManagerPopup = true;
        if (this.managers.length === 0)
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

    openDocumentPopup(type: 'aadhar' | 'pan') {
        this.selectedDocumentType = type;
        this.selectedDocumentUrl = type === 'aadhar' 
            ? this.getSafeAadharUrl() 
            : this.getSafePanUrl();
        this.showDocumentPopup = true;
    }
    
    closeDocumentPopup() {
        this.showDocumentPopup = false;
        this.selectedDocumentUrl = null;
        this.selectedDocumentType = null;
    }

    openAllDetailsPopup() {
        this.showAllDetailsPopup = true;
    }

    closeAllDetailsPopup() {
        this.showAllDetailsPopup = false;
    }
    
    assignManager(managerId: number) {
        if (!this.selectedLoan) return;
        const userId = this.selectedLoan.user?.id;
        const loanId = this.selectedLoan.id;
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
        this.closeLoanDetails();
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

    // Helper functions to make safe URLs for PDFs
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

    // Helper function to convert base64 to Blob
    base64ToBlob(base64Data: string, contentType: string): Blob {
        const byteCharacters = atob(base64Data);
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

}