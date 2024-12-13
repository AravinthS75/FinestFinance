import { Component } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserStoreService } from '../../services/user-store.service';

@Component({
  selector: 'app-authguard',
  standalone: false,
  templateUrl: './authguard.component.html',
  styleUrl: './authguard.component.css'
})
export class AuthguardComponent implements CanActivate{
  constructor(
    private authService: AuthService,
    private userStoreService: UserStoreService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

    const expectedRole = route.data['expectedRole'];
    const token = this.userStoreService.getJwtToken();
    
    if (!this.authService.isAuthenticated() || !token) {
      this.router.navigate(['error']);
      return false;
    }

    const userRole = this.userStoreService.getUserRole();
    
    if (userRole !== expectedRole) {
      this.router.navigate(['error']);
      return false;
    }

    return true;
  }

}
