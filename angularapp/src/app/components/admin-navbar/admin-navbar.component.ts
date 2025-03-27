import { Component, ElementRef, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
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
  styleUrls: ['./admin-navbar.component.css']
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
    private userService: UserService,
    private eRef: ElementRef
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
        this.closeMobileMenu();
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

  // Close the mobile menu if user clicks/touches outside the component.
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.closeMobileMenu();
    }
  }

  // Close the mobile menu if the user scrolls.
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event): void {
    this.closeMobileMenu();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleDropdown(dropdownName: string, event?: Event): void {
    // In mobile, if an event is provided, stop propagation to avoid closing the nav.
    if (window.innerWidth <= 740 && event) {
      event.stopPropagation();
    }
    this.dropdownState[dropdownName] = !this.dropdownState[dropdownName];
    Object.keys(this.dropdownState).forEach(key => {
      if (key !== dropdownName) {
        this.dropdownState[key] = false;
      }
    });
    document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : 'auto';
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    this.dropdownState = {};
    document.body.style.overflow = 'auto';
  }

  logout(): void {
    this.store.logout();
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }

  isActive(url: string): boolean {
    return this.currentUrl === url;
  }

  homeNav(): void {
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
  }

  viewLoansNav(): void {
    this.router.navigate(['/admin/view-loans']).then(() => {
      window.location.reload();
    });
  }

  viewManagersNav(): void {
    this.router.navigate(['/admin/view-managers']).then(() => {
      window.location.reload();
    });
  }

  viewUersNav(): void {
    this.router.navigate(['/admin/view-users']).then(() => {
      window.location.reload();
    });
  }

  viewProfileNav(): void {
    this.router.navigate(['/admin/dashboard']).then(() => {
      window.location.reload();
    });
  }

  editProfileNav(): void {
    this.router.navigate(['/admin/edit-profile']).then(() => {
      window.location.reload();
    });
  }
}
