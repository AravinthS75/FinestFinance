import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserStoreService } from '../../services/user-store.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthUser } from '../../models/auth-user.model';

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
  userRole: string | null = null;
  showForgotPassword = false;
  forgotPasswordForm: FormGroup;
  resetPasswordProcessing = false;
  resetPasswordSuccess = false;
  resetPasswordError: string | null = null;
  forgotPasswordSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private userStore: UserStoreService,
    private cdr: ChangeDetectorRef
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
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
          this.cdr.detectChanges(); // Ensure UI updates
          this.userStore.userChanges.subscribe((user: AuthUser | null) => {
            this.userRole = user ? user.role : null;
          });
      
          const user: AuthUser | null = this.userStore.getUser();
          if (user) {
            this.userRole = user.role;
          }
          setTimeout(() => {
            if(this.userRole == 'ADMIN')
            this.router.navigate(['/admin/view-loans']);
            else if(this.userRole == 'MANAGER')
            this.router.navigate(['/manager/view-loans']);
            else if(this.userRole == 'USER')
            this.router.navigate(['/']);
          }, 1500);
        },
        error: (error: HttpErrorResponse) => {
          this.formProcessing = false;
          this.loginFail = true;
          this.cdr.detectChanges(); // Force UI update for animation

          // Hide error message after 3 seconds
          setTimeout(() => {
            this.loginFail = false;
            this.cdr.detectChanges(); // Update UI again
          }, 3000);

          console.error('Login error:', error);
        }
      });
    }
  }
  
  showForgotPasswordModal(): void {
    this.showForgotPassword = true;
  }

  closeForgotPasswordModal(): void {
    this.showForgotPassword = false;
    this.resetPasswordSuccess = false;
    this.resetPasswordError = null;
    this.forgotPasswordSubmitted = false;
    this.forgotPasswordForm.reset();
  }

  onForgotPasswordSubmit(): void {
    this.forgotPasswordSubmitted = true;
    
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.resetPasswordProcessing = true;
    const email = this.forgotPasswordForm.get('email')?.value;

    if (!email) {
      this.resetPasswordProcessing = false;
      this.resetPasswordError = 'Email is required';
      return;
    }

    this.authService.sendPasswordResetEmail(email).subscribe({
      next: () => {
        this.resetPasswordProcessing = false;
        this.resetPasswordSuccess = true;
        setTimeout(() => this.closeForgotPasswordModal(), 2000);
      },
      error: (error: any) => {
        this.resetPasswordProcessing = false;
        this.resetPasswordError = error.error?.message || 'Failed to send reset email';
        setTimeout(() => {
          this.resetPasswordError = null;
        }, 6000);
      }
    });
  }  

}