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
  filteredUsers: User[] = [];
  userData: string | null = null;
  isLoading: boolean = false;
  token: string = '';
  error: string = '';
  selectedUser: User | null = null;
  isModalOpen: boolean = false;
  modalState: 'open' | 'closed' = 'closed';
  
  // Search term for filtering users
  searchTerm: string = '';

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
    this.managerService.getAllUsers(this.token).subscribe(
      (data) => {
        this.users = data;
        // Initialize filteredUsers with the full list
        this.filteredUsers = data;
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

  // Method to filter the list of users based on the search term
  filterUsers(): void {
    if (!this.searchTerm) {
      // If the search term is empty, show all users
      this.filteredUsers = this.users;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredUsers = this.users.filter(user =>
        user.name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        (user.phone && user.phone.toLowerCase().includes(term))
      );
    }
  }
}
