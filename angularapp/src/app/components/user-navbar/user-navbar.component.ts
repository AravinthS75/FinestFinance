import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { UserStoreService } from '../../services/user-store.service';
import { AuthUser } from '../../models/auth-user.model';

@Component({
  selector: 'app-user-navbar',
  standalone: false,
  
  templateUrl: './user-navbar.component.html',
  styleUrl: './user-navbar.component.css'
})
export class UserNavbarComponent {
  currentUrl: string | null = null;
  isDropdownOpen: boolean = false;

  constructor(private store: UserStoreService, private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
      }
    });
  }

  ngOnInit(): void {
  }

  logout(): void {
    this.store.logout();
    this.router.navigate(['/login']);
  }

  isActive(url: string): boolean {
    return this.currentUrl === url;
  }

  openDropdown(): void {
    this.isDropdownOpen = true;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }
}
