import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { User } from '../../models/user.model';
import { DomSanitizer, SafeResourceUrl, SafeStyle } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-admin-view-users',
  standalone: false,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './admin-view-users.component.html',
  styleUrls: ['./admin-view-users.component.css']
})
export class AdminViewUsersComponent implements OnInit{
  users: User[] = [];
  filteredUsers: User[] = [];
  userData: string | null = null;
  isLoading: boolean = false;
  token: string = '';
  error: string = '';
  selectedUser: User | null = null;
  isModalOpen: boolean = false;
  modalState: 'open' | 'closed' = 'closed';
  searchTerm: string = ''; // For search input

  constructor(
    private adminService: AdminService,
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
    this.adminService.getAllUsers(this.token).subscribe(
      (data) => {
        this.users = data;
        // Initialize filteredUsers with the complete list when data loads
        this.filteredUsers = data;
        this.isLoading = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.error = errorResponse.error.message || 'Failed to load users list.';
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

  // Method to filter the list of users based on searchTerm
  filterUsers(): void {
    if (!this.searchTerm) {
      // If search term is empty, show all users
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
