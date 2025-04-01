import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
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

  logout(): void {
    this.store.logout();
    this.router.navigate(['/login']);
    this.closeMobileMenu();
  }

  homeNav(): void {
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
  }

  viewLoansNav(): void{
    this.router.navigate(['/manager/view-loans']).then(() => {
      window.location.reload();
    });
  }

  viewUsersNav(): void{
    this.router.navigate(['/manager/view-users']).then(() => {
      window.location.reload();
    });
  }

  viewProfileNav(): void{
    this.router.navigate(['/manager/dashboard']).then(() => {
      window.location.reload();
    });
  }

  editProfileNav(): void{
    this.router.navigate(['/manager/edit-profile']).then(() => {
      window.location.reload();
    });
  }

  isActive(url: string): boolean {
    return this.currentUrl === url;
  }
 
}