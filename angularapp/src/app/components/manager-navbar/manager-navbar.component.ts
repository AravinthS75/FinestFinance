import { Component, ElementRef, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthUser } from '../../models/auth-user.model';
import { NavigationEnd, Router } from '@angular/router';
import { UserStoreService } from '../../services/user-store.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-manager-navbar',
  standalone: false,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './manager-navbar.component.html',
  styleUrls: ['./manager-navbar.component.css']
})
export class ManagerNavbarComponent implements OnInit {
  welcomeMessage: string = 'Welcome! MANAGER';
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
        this.welcomeMessage = `Welcome ${authUser.name} (MANAGER)`;
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

  // Listen for clicks anywhere in the document.
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.closeMobileMenu();
    }
  }

  // Listen for scroll events on the window.
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event): void {
    this.closeMobileMenu();
  }

  isActive(url: string): boolean {
    return this.currentUrl === url;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleDropdown(dropdownName: string, event?: Event): void {
    // For mobile: stop propagation so that clicking on the dropdown doesn't trigger the document click listener.
    if (window.innerWidth <= 740 && event) {
      event.stopPropagation();
    }
    this.dropdownState[dropdownName] = !this.dropdownState[dropdownName];
    Object.keys(this.dropdownState).forEach(key => {
      if (key !== dropdownName) {
        this.dropdownState[key] = false;
      }
    });
    // Optional: lock page scroll when mobile menu is open.
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

  homeNav(): void {
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
  }

  viewLoansNav(): void {
    this.router.navigate(['/manager/view-loans']).then(() => {
      window.location.reload();
    });
  }

  viewUsersNav(): void {
    this.router.navigate(['/manager/view-users']).then(() => {
      window.location.reload();
    });
  }

  viewProfileNav(): void {
    this.router.navigate(['/manager/dashboard']).then(() => {
      window.location.reload();
    });
  }

  editProfileNav(): void {
    this.router.navigate(['/manager/edit-profile']).then(() => {
      window.location.reload();
    });
  }
}
