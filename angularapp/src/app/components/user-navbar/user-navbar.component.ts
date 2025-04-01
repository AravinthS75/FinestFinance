import { Component, HostListener, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { UserStoreService } from '../../services/user-store.service';
import { AuthUser } from '../../models/auth-user.model';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-navbar',
  standalone: false,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './user-navbar.component.html',
  styleUrl: './user-navbar.component.css'
})
export class UserNavbarComponent {
  welcomeMessage: string = 'Welcome! USER';
  currentUrl: string | null = null;
  userProfilePic: string = 'assets/images/default-profile.png';
  authUser: AuthUser | null = null;
  user: User | null = null;
  isMobileMenuOpen = false;
  dropdownState: { [key: string]: boolean } = {};

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
        this.welcomeMessage = `Welcome ${authUser.name} (USER)`;
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
  
    @HostListener('document:click', ['$event'])
    handleClickOutside(event: Event): void {
      const target = event.target as HTMLElement;
      if (!target.closest('.main-nav')) {
        this.closeMobileMenu();
        this.closeAllDropdowns();
        this.uncheckHamburger();
      }
    }
  
    @HostListener('window:scroll')
    handleScroll(): void {
        this.closeMobileMenu();
        this.uncheckHamburger();
        this.closeAllDropdowns();
    }
  
    @HostListener('document:touchstart', ['$event'])
    handleTouchOutside(event: Event): void {
      const target = event.target as HTMLElement;
      if (!target.closest('.main-nav')) {
        this.closeMobileMenu();
        this.closeAllDropdowns();
        this.uncheckHamburger();
      }
    }
  
    private uncheckHamburger(): void {
      const hamburgerCheckbox = document.querySelector<HTMLInputElement>('.hamburger-btn input[type="checkbox"]');
      if (hamburgerCheckbox && hamburgerCheckbox.checked) {
        hamburgerCheckbox.checked = false;
      }
    }

  homeNav(): void {
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
  }

  personalLoanNav(): void{
    this.router.navigate(['/user/personal-loan']).then(() => {
      window.location.reload();
    });
  }

  businessLoanNav(): void{
    this.router.navigate(['/user/business-loan']).then(() => {
      window.location.reload();
    });
  }

  homeLoanNav(): void{
    this.router.navigate(['/user/home-loan']).then(() => {
      window.location.reload();
    });
  }

  viewLoansNav(): void{
    this.router.navigate(['/user/view-loan']).then(() => {
      window.location.reload();
    });
  }

  viewProfileNav(): void{
    this.router.navigate(['/user/dashboard']).then(() => {
      window.location.reload();
    });
  }

  editProfileNav(): void{
    this.router.navigate(['/user/edit-profile']).then(() => {
      window.location.reload();
    });
  }

  logout(): void {
    this.store.logout();
    this.router.navigate(['/login']);
  }

  isActive(url: string): boolean {
    return this.currentUrl === url;
  }
}
