// navbar.component.ts
import { Component, HostListener, ViewEncapsulation } from '@angular/core';
import { UserStoreService } from '../../services/user-store.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})  
export class NavbarComponent {
  currentUrl: string | null = null;
  isMobileMenuOpen = false;
  activeDropdown: string | null = null;
  dropdowns: { [key: string]: boolean } = {};
  
  constructor(private router: Router, private user: UserStoreService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
        this.closeMobileMenu();
      }
    });
  }

  isActive(url: string): boolean {
    return this.currentUrl === url;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }  

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    document.body.style.overflow = 'auto';
  }

  toggleDropdown(menu: string) {
    Object.keys(this.dropdowns).forEach(key => {
      if (key !== menu) {
        this.dropdowns[key] = false;
      }
    });

    // Toggle the clicked dropdown
    this.dropdowns[menu] = !this.dropdowns[menu];
  }

  closeAllDropdowns() {
    Object.keys(this.dropdowns).forEach(key => this.dropdowns[key] = false);
  }

  /** 
   * Close mobile menu and dropdowns when clicking outside
   */
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.main-nav')) {
      this.closeMobileMenu();
      this.closeAllDropdowns();
    }
  }

  @HostListener('window:scroll')
  handleScroll() {
    this.closeMobileMenu();
    this.closeAllDropdowns();
  }

  closeAllMenus() {
    this.isMobileMenuOpen = false;
    this.activeDropdown = null;
    document.body.style.overflow = 'auto';
  }
  

  homeNav(): void{
    this.router.navigate(['/']).then(()=>{
      window.location.reload();
    });
  }

  personalLoanNav(): void{
    this.router.navigate(['/loan/personal/description']).then(()=>{
      window.location.reload();
    });
  }

  businessLoanNav(): void{
    this.router.navigate(['/loan/business/description']).then(()=>{
      window.location.reload();
    });
  }

  homeLoanNav(): void{
    this.router.navigate(['/loan/business/description']).then(()=>{
      window.location.reload();
    });
  }

  loginNav(): void{
    this.router.navigate(['/login']).then(()=>{
      window.location.reload();
    });
  }

  registerNav(): void{
    this.router.navigate(['/register']).then(()=>{
      window.location.reload();
    });
  }
}