import { Component, ElementRef, HostListener, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  encapsulation: ViewEncapsulation.None,
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  currentUrl: string | null = null;
  currentYear: number = new Date().getFullYear();
  isMobileMenuOpen = false;
  dropdownState: { [key: string]: boolean } = {};

  constructor(private router: Router, private eRef: ElementRef) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
        this.closeMobileMenu();
      }
    });
  }

  // Close the mobile menu if the click is outside the component
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.closeMobileMenu();
    }
  }

  // Close the mobile menu when the user scrolls
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
    // For mobile: stop propagation so clicking dropdown doesn't trigger the document click listener
    if (window.innerWidth <= 740 && event) {
      event.stopPropagation();
    }
    this.dropdownState[dropdownName] = !this.dropdownState[dropdownName];
    Object.keys(this.dropdownState).forEach(key => {
      if (key !== dropdownName) {
        this.dropdownState[key] = false;
      }
    });
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    this.dropdownState = {};
  }

  homeNav(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
  }
}
