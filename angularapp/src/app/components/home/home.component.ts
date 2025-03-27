import { ViewEncapsulation } from '@angular/core';
import { Component } from '@angular/core';
import { UserStoreService } from '../../services/user-store.service';
import { Router } from '@angular/router';
import { AuthUser } from '../../models/auth-user.model';

@Component({
  selector: 'app-home',
  standalone: false,
  
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent {
userRole: string | null = null;
hasReloaded = false;

  constructor(private userStore: UserStoreService, private router: Router) {
  }

  ngOnInit(): void {
    this.userStore.userChanges.subscribe((user: AuthUser | null) => {
      this.userRole = user ? user.role : null;
    });

    const user: AuthUser | null = this.userStore.getUser();
    if (user) {
      this.userRole = user.role;
    }
  }

  isUser(): void {
    if(this.userRole === 'USER')
      this.router.navigate(['/user/personal-loan']).then(()=>{
        window.location.reload();
      });
    else
      this.router.navigate(['/login']).then(()=>{
        window.location.reload();
      });
  }
}
