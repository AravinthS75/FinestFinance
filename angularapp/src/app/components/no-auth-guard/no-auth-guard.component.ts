import { Component, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-no-auth-guard',
  standalone: false,
  
  templateUrl: './no-auth-guard.component.html',
  styleUrl: './no-auth-guard.component.css'
})
@Injectable({
  providedIn: 'root'
})
export class NoAuthGuardComponent implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
