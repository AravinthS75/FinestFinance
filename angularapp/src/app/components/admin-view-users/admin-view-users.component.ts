import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { User } from '../../models/user.model';
import { DomSanitizer, SafeResourceUrl, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-view-users',
  standalone: false,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './admin-view-users.component.html',
  styleUrl: './admin-view-users.component.css'
})
export class AdminViewUsersComponent implements OnInit{
  users: User[] = [];
  userData: string | null = null;
  token: string = '';
  selectedUser: User | null = null;
  showModal: boolean = false;

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
    this.adminService.getAllUsers(this.token).subscribe((data) => {
      this.users = data;
      console.log(this.users);
    });
  }

  getProfileImage(user: User): SafeStyle {
    if (user.profilePicture) {
      const style = `url(data:image/jpeg;base64,${user.profilePicture})`;
      return this.sanitizer.bypassSecurityTrustStyle(style);
    }
    // Make sure the default image exists at the specified location
    return this.sanitizer.bypassSecurityTrustStyle(`url(assets/images/default-profile.png)`);
  }
  
  openLoanModal(user: User): void {
    this.selectedUser = user;
    this.showModal = true;
  }
  
  closeLoanModal(): void {
    this.showModal = false;
  }
}
