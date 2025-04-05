import { Component, ViewEncapsulation } from '@angular/core';
import { User } from '../../models/user.model';
import { AdminService } from '../../services/admin.service';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';
import { ManagerService } from '../../services/manager.service';

@Component({
  selector: 'app-manager-view-users',
  standalone: false,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './manager-view-users.component.html',
  styleUrl: './manager-view-users.component.css'
})
export class ManagerViewUsersComponent {

  users: User[] = [];
  userData: string | null = null;
  isLoading: boolean  = false;
  token: string = '';
  error: string = '';
  selectedUser: User | null = null;
  isModalOpen: boolean = false;
  modalState: 'open' | 'closed' = 'closed';

  constructor(
    private managerService: ManagerService,
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
    this.isLoading = true;
    this.managerService.getAllUsers(this.token).subscribe((data) => {
      this.users = data;
      // console.log(this.users);
      this.isLoading = false;
    },
    (errorResponse: HttpErrorResponse) => {
            this.error = errorResponse.error.message || 'Failed to load Users list!';
            this.isLoading = false;
          }
  );
  }

  getProfileImage(user: User): SafeStyle {
    if (user.profilePicture) {
      const style = `url(data:image/jpeg;base64,${user.profilePicture})`;
      return this.sanitizer.bypassSecurityTrustStyle(style);
    }
    return this.sanitizer.bypassSecurityTrustStyle(`url(assets/images/default-profile.png)`);
  }
  
  openLoanModal(user: User): void {
    this.selectedUser = user;
    this.isModalOpen = true;
    this.modalState = 'open';
    document.body.style.overflow = 'hidden';
  }
  
  closeLoanModal(): void {
    this.isModalOpen = false;
    this.selectedUser = null;
    document.body.style.overflow = '';
    this.modalState = 'closed';
  }

}
