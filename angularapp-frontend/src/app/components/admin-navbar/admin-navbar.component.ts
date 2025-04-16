import { Component, OnInit, ViewEncapsulation, HostListener, ElementRef  } from '@angular/core';
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
  authUser: AuthUser | null = null;
  user: User | null = null;
  dropdownState: { [key: string]: boolean } = {};

  constructor(
    private store: UserStoreService,
    private router: Router,
    private userService: UserService
  ) {
    // Close menu on route change
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
        this.closeMobileMenu();
        this.closeAllDropdowns();
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

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    document.body.style.overflow = 'auto';
  }

  toggleDropdown(dropdownName: string): void {
    this.dropdownState[dropdownName] = !this.dropdownState[dropdownName];
    Object.keys(this.dropdownState).forEach(key => {
      if (key !== dropdownName) {
        this.dropdownState[key] = false;
      }
    });
  }

  closeAllDropdowns(): void {
    Object.keys(this.dropdownState).forEach(key => this.dropdownState[key] = false);
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

  viewUsersNav(): void {
    this.router.navigate(['/admin/view-users']).then(() => {
      window.location.reload();
    });
  }

  viewProfileNav(): void{
    this.router.navigate(['/admin/dashboard']).then(() => {
      window.location.reload();
    });
  }

  editProfileNav(): void{
    this.router.navigate(['/admin/edit-profile']).then(() => {
      window.location.reload();
    });
  }


  logout(): void {
    this.store.logout();
    this.router.navigate(['/login']);
    this.closeMobileMenu();
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.main-nav')) {
      this.closeMobileMenu();
      this.closeAllDropdowns();
      this.uncheckHamburger(); // Add this line
    }
  }

  @HostListener('window:scroll')
  handleScroll(): void {
    this.closeMobileMenu();
    this.closeAllDropdowns();
    this.uncheckHamburger(); // Add this line
  }

  @HostListener('document:touchstart', ['$event'])
  handleTouchOutside(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.main-nav')) {
      this.closeMobileMenu();
      this.closeAllDropdowns();
      this.uncheckHamburger(); // Add this line
    }
  }

  private uncheckHamburger(): void {
    const hamburgerCheckbox = document.querySelector<HTMLInputElement>('.hamburger-btn input[type="checkbox"]');
    if (hamburgerCheckbox && hamburgerCheckbox.checked) {
      hamburgerCheckbox.checked = false;
    }
  }
  
  isActive(url: string): boolean {
    return this.currentUrl === url;
  }

}
