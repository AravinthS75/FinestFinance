import { Component, OnInit } from '@angular/core';
import { UserStoreService } from '../../services/user-store.service';
import { NavigationEnd, Router } from '@angular/router';
import { AuthUser } from '../../models/auth-user.model';

@Component({
  selector: 'app-admin-navbar',
  standalone: false,
  
  templateUrl: './admin-navbar.component.html',
  styleUrl: './admin-navbar.component.css'
})
export class AdminNavbarComponent implements OnInit {
  welcomeMessage: string = 'Welcome! ADMIN';
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
    this.store.userChanges.subscribe((authUser: AuthUser | null) => {
      if (authUser) {
        this.welcomeMessage = `Welcome ${authUser.name}(ADMIN)`;
      }
    });
  }

  logout(): void {
    this.store.logout();
    this.router.navigate(['/login']);
  }

  isActive(url: string): boolean {
    return this.currentUrl === url;
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}

