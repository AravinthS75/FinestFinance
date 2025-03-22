import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserStoreService } from '../../services/user-store.service';
import { NavigationEnd, Router } from '@angular/router';
import { AuthUser } from '../../models/auth-user.model';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-admin-navbar',
  standalone: false,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './admin-navbar.component.html',
  styleUrl: './admin-navbar.component.css'
})
export class AdminNavbarComponent implements OnInit {
  welcomeMessage: string = 'Welcome! ADMIN';
  currentUrl: string | null = null;
  userProfilePic: string = 'assets/images/default-profile.png';
  isMobileMenuOpen = false;
  dropdownState: { [key: string]: boolean } = {};
  authUser: AuthUser | null = null;
  user: User | null = null;

  constructor(
    private store: UserStoreService,
    private router: Router,
    private userService: UserService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
        this.isMobileMenuOpen = false;
      }
    });
  }

  ngOnInit(): void {
    this.store.userChanges.subscribe((authUser: AuthUser | null) => {
      if (authUser) {
        this.welcomeMessage = `Welcome ${authUser.name} (ADMIN)`;
        this.authUser = authUser;
        this.userService.getUserDetails(authUser.userId, authUser.token).subscribe({
          next: (user: User) => {
            this.user = user;
            this.userProfilePic = user.profilePicture
              ? `data:image/jpeg;base64,${user.profilePicture}`
              : 'assets/images/default-profile.png';
          },
          error: (err) => {
            console.error('Failed to retrieve user details', err);
            this.userProfilePic = authUser.profilePicture
              ? `data:image/jpeg;base64,${authUser.profilePicture}`
              : 'assets/images/default-profile.png';
          }
        });
      }
    });
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleDropdown(dropdownName: string): void {
    this.dropdownState[dropdownName] = !this.dropdownState[dropdownName];
    Object.keys(this.dropdownState).forEach(key => {
      if (key !== dropdownName) {
        this.dropdownState[key] = false;
      }
    });
    document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : 'auto';
  }

  logout(): void {
    this.store.logout();
    this.router.navigate(['/login']);
  }

  isActive(url: string): boolean {
    return this.currentUrl === url;
  }
}
