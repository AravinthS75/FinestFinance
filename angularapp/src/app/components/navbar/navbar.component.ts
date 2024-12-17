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
}
