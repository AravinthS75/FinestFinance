import { Component } from '@angular/core';
import { Loan } from '../../models/loan.model';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-view-loans',
  standalone: false,
  
  templateUrl: './admin-view-loans.component.html',
  styleUrl: './admin-view-loans.component.css'
})
export class AdminViewLoansComponent {
  loans:Loan[] = [];
  userData: string | null = null;
  token : string = '';

  constructor(private adminService: AdminService){
    this.userData = sessionStorage.getItem('authUser');
    if (this.userData) {
      const userDetails = JSON.parse(this.userData);
      this.token = userDetails.token;
    } else {
      console.error('No user data found in sessionStorage');
    }
  }

  ngOnInit(): void {
      this.adminService.getAllLoans(this.token).subscribe(
        (data) => {
            this.loans = data;
            console.log(this.loans);
        }
      );
  }

}
