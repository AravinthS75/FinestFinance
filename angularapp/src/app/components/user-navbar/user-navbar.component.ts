import { Component, ElementRef, HostListener, ViewEncapsulation } from '@angular/core';
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

      closeMobileMenu(): void {
        this.isMobileMenuOpen = false;
        this.dropdownState = {};
        document.body.style.overflow = 'auto';
      }

      homeNav(): void{
        this.router.navigate(['/']).then(()=>{
          window.location.reload();
        });
      }

      personalLoanNav(): void{
        this.router.navigate(['/user/personal-loan']).then(()=>{
          window.location.reload();
        });
      }

      businessLoanNav(): void{
        this.router.navigate(['/user/business-loan']).then(()=>{
          window.location.reload();
        });
      }
    
      homeLoanNav(): void{
        this.router.navigate(['/user/home-loan']).then(()=>{
          window.location.reload();
        });
      }

      viewLoansNav(): void{
        this.router.navigate(['/user/view-loan']).then(()=>{
          window.location.reload();
        });
      }

      viewProfileNav(): void{
        this.router.navigate(['/user/dashboard']).then(()=>{
          window.location.reload();
        });
      }

      editProfileNav(): void{
        this.router.navigate(['/user/edit-profile']).then(()=>{
          window.location.reload();
        });
      }

      logout(): void {
        this.store.logout();
        this.router.navigate(['/login']).then(()=>{
          window.location.reload();
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
      
      isActive(url: string): boolean {
        return this.currentUrl === url;
      }
}
