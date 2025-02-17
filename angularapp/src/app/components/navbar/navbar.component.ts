import { Component } from '@angular/core';
import { UserStoreService } from '../../services/user-store.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,
  
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  currentUrl: string | null = null;
  
  constructor(private store: UserStoreService, private router: Router) {
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.currentUrl = event.url;
        }
      });
    }

    isActive(url: string): boolean {
      return this.currentUrl === url;
    }
    dropdowns: { [key: string]: boolean } = {};

    toggleDropdown(menu: string) {
      // Close other dropdowns before opening the clicked one
      Object.keys(this.dropdowns).forEach(key => {
        if (key !== menu) this.dropdowns[key] = false;
      });
  
      // Toggle the clicked dropdown
      this.dropdowns[menu] = !this.dropdowns[menu];
    }
}
