import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { HttpErrorResponse } from '@angular/common/http';
import { trigger, transition, style, animate } from '@angular/animations';
import Swal from 'sweetalert2';
import { ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: false,
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('popupAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {
  registrationForm: FormGroup;
  passwordMismatch: boolean = false;
  isNoData: boolean = false;
  error: string | null = null;
  formSubmitted = false;
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

  constructor(private builder: FormBuilder, private service: AuthService, private route: Router) {
    this.registrationForm = this.builder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@gmail\\.com$')]], // Slightly improved email pattern
      password: ['', [Validators.required, Validators.pattern(this.combinedPasswordPattern)]],
      confirmPassword: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // Added ^$ for exact match
      // role: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.passwordControl = this.registrationForm.get('password') as FormControl;

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
      const component = (this as any); 
      if(component && 'passwordMismatch' in component){
          component.passwordMismatch = password !== confirmPassword && form.get('confirmPassword')?.touched;
      }
      return password && confirmPassword && password !== confirmPassword ? { mismatch: true } : null;
  }

  get areAllConditionsMet(): boolean {
    return this.hasUppercase && this.hasLowercase && this.hasDigit && this.hasSpecialChar;
  }
  
  register(): void {
    this.registrationForm.markAllAsTouched();

    if (this.registrationForm.valid) {
      const user: User = {
        name: this.registrationForm.get('username')?.value,
        email: this.registrationForm.get('email')?.value,
        password: this.registrationForm.get('password')?.value,
        phone: this.registrationForm.get('mobileNumber')?.value,
        // role: this.registrationForm.get('role')?.value
      };
      this.service.signUp(user).subscribe({
        next: response => {
          console.log('Registration successful', response);
          this.formSubmitted = true;
          this.isNoData = false;
          this.error = null;
          this.registrationForm.reset();
          // Reset validation flags manually after successful reset
          this.validatePasswordConditions('');
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.isNoData = true;
          this.error = errorResponse.error?.message || errorResponse.error || 'An unknown registration error occurred.'; // Get more specific error
          Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
            text: this.error || 'An unknown error occurred.'
          });
        }
      });
    } else {
       console.log("Form is invalid", this.registrationForm.errors);
       // Optional: Focus the first invalid field
       this.focusFirstInvalidField();
    }
  }

  focusFirstInvalidField() {
    const controls = this.registrationForm.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            const element = document.querySelector(`[formControlName="${name}"]`);
            if (element instanceof HTMLElement) {
                element.focus();
                break;
            }
        }
    }
  }

  closePopup() {
    this.formSubmitted = false;
    this.route.navigate(['/login']);
  }
}