import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UserStoreService } from '../../services/user-store.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-manager-dashboard',
  standalone: false,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './manager-dashboard.component.html',
  styleUrl: './manager-dashboard.component.css'
})
export class ManagerDashboardComponent {
  user?: User;
  error: string = '';
  userDetailsAvailable: boolean = false;
  userData: string | null = null;
  userId: number = 0;
  token: string = '';
  profileImage: SafeResourceUrl | ArrayBuffer | null = 'assets/images/default-profile.png';

  constructor(
    private userService: UserService,
    private userStoreService: UserStoreService,
    private sanitizer: DomSanitizer
  ) {
    this.userData = sessionStorage.getItem('authUser');
    if (this.userData) {
      const userDetails = JSON.parse(this.userData);
      this.userId = userDetails.userId;
      this.token = userDetails.token;
    } else {
      console.error('No user data found in sessionStorage');
    }
  }

  ngOnInit(): void {
    if (this.userId) {
      this.getUserDetails(this.userId, this.token);
    } else {
      console.error('User id is missing');
    }
  }

  getUserDetails(userId: number, token: string): void {
    this.userService.getUserDetails(userId, token).subscribe(
      (data) => {
        this.user = data;
        this.userDetailsAvailable = true;
        if (data.profilePicture) {
          const imageUrl = `data:image/jpeg;base64,${data.profilePicture}`;
          this.profileImage = this.sanitizer.bypassSecurityTrustResourceUrl(imageUrl);
        } else {
          this.profileImage = 'assets/images/default-profile.png';
        }
      },
      (errorResponse: HttpErrorResponse) => {
        this.userDetailsAvailable = false;
        this.error = errorResponse.error.message || 'Failed to load user details';
      }
    );
  }

}
