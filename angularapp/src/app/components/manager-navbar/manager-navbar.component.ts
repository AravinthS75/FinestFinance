import { Component, OnInit } from '@angular/core';
import { AuthUser } from '../../models/auth-user.model';
import { NavigationEnd, Router } from '@angular/router';
import { UserStoreService } from '../../services/user-store.service';

@Component({
  selector: 'app-manager-navbar',
  standalone: false,
  templateUrl: './manager-navbar.component.html',
  styleUrls: ['./manager-navbar.component.css']
})
export class ManagerNavbarComponent implements OnInit {
  welcomeMessage: string = 'Welcome! MANAGER';
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
        this.welcomeMessage = `Welcome ${authUser.name}(MANAGER)`;
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

  openDropdown(): void {
    this.isDropdownOpen = true;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }
}