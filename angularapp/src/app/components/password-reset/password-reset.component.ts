import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-password-reset',
  standalone: false,
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit, OnDestroy {
  resetForm: FormGroup;
  token: string | null = null;
  passwordMismatch: boolean = false;
  passwordControl: FormControl | null = null;
  passwordValueChangesSubscription: Subscription | null = null;
  hasUppercase: boolean = false;
  hasLowercase: boolean = false;
  hasDigit: boolean = false;
  hasSpecialChar: boolean = false;
  private uppercasePattern = /[A-Z]/;
  private lowercasePattern = /[a-z]/;
  private digitPattern = /\d/;
  private specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;
  private combinedPasswordPattern = '^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.pattern(this.combinedPasswordPattern)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('pass_reset');

    this.passwordControl = this.resetForm.get('password') as FormControl;

    if (this.passwordControl) {
      this.passwordValueChangesSubscription = this.passwordControl.valueChanges.subscribe(value => {
        this.validatePasswordConditions(value || '');
      });
      this.validatePasswordConditions(this.passwordControl.value || '');
    }
    
  }

  ngOnDestroy(): void {
    this.passwordValueChangesSubscription?.unsubscribe();
  }

  validatePasswordConditions(password: string): void {
    this.hasUppercase = this.uppercasePattern.test(password);
    this.hasLowercase = this.lowercasePattern.test(password);
    this.hasDigit = this.digitPattern.test(password);
    this.hasSpecialChar = this.specialCharPattern.test(password);
  }

  passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password && confirmPassword && password !== confirmPassword ? { mismatch: true } : null;
  }

  get areAllConditionsMet(): boolean {
    return this.hasUppercase && this.hasLowercase && this.hasDigit && this.hasSpecialChar;
  }

  onSubmit(): void {
    if (this.resetForm.valid) {
      const password = this.resetForm.get('password')?.value;
      if (this.token) {
        this.authService.resetPassword(this.token, password).subscribe({
          next: (response)=> {
            this.toastr.success('Password reset successfully.', 'Reset Success', {closeButton: true});
            this.router.navigate(['/login']);
          },
          error: (error) => {
            this.toastr.error('Password reset failed', 'Reset failed', {closeButton: true});
          }
        });
      } else {
        this.toastr.error('Token is invalid', 'Invalid Token', {closeButton: true});
      }
    }
  }
}
