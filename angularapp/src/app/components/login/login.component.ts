import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserStoreService } from '../../services/user-store.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false,
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  formProcessing = false;
  loginFail = false;
  loginSuccess = false;
  particles: { top: number; left: number; size: number; duration: number; delay: number }[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private userStore: UserStoreService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.generateParticles();
  }

  generateParticles(): void {
    this.particles = Array.from({ length: 50 }, () => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 10 + 5,
      duration: Math.random() * 10 + 5,
      delay: Math.random() * 5
    }));
  }

  signIn(): void {
    if (this.loginForm.valid) {
      this.formProcessing = true;
      this.loginFail = false;
      this.loginSuccess = false;

      const credentials = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      this.authService.signIn(credentials).subscribe({
        next: (response) => {
          this.userStore.saveUser(response);
          this.formProcessing = false;
          this.loginSuccess = true;
          
          setTimeout(() => {
            this.router.navigate(['/admin/view-loans']);
          }, 1500);
        },
        error: (error: HttpErrorResponse) => {
          this.formProcessing = false;
          this.loginFail = true;

          // Hide error message after 3 seconds
          setTimeout(() => {
            this.loginFail = false;
          }, 3000);

          console.error('Login error:', error);
        }
      });
    }
  }
}