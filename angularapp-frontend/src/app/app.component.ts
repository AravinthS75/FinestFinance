import { Component } from '@angular/core';
import { UserStoreService } from './services/user-store.service';
import { Router } from '@angular/router';
import { AuthUser } from './models/auth-user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Finest Finance';
  userRole: string | null = null;

  constructor(private userStore: UserStoreService, private router: Router) {}

  ngOnInit(): void {
    this.userStore.userChanges.subscribe((user: AuthUser | null) => {
      this.userRole = user ? user.role : null;
    });

    const user: AuthUser | null = this.userStore.getUser();
    if (user) {
      this.userRole = user.role;
    }
  }

  isUser(): boolean {
    return this.userRole === 'USER';
  }

  isAdmin(): boolean {
    return this.userRole === 'ADMIN';
  }

  isManager(): boolean{
    return this.userRole === 'MANAGER';
  }

  isLoggedOut(): boolean {
    return this.userRole === null;
  }
  
}
