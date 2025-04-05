import { Component, OnInit, OnDestroy } from '@angular/core'; // Import OnDestroy
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms'; // Import FormControl
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { HttpErrorResponse } from '@angular/common/http';
import { trigger, transition, style, animate } from '@angular/animations';
import Swal from 'sweetalert2';
import { ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs'; // Import Subscription

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
export class RegisterComponent implements OnInit, OnDestroy { // Implement OnDestroy
  registrationForm: FormGroup;
  passwordMismatch: boolean = false;
  isNoData: boolean = false;
  error: string | null = null;
  formSubmitted = false;

  // --- Password validation state ---
  passwordControl: FormControl | null = null;
  passwordValueChangesSubscription: Subscription | null = null;
  hasUppercase: boolean = false;
  hasLowercase: boolean = false;
  hasDigit: boolean = false;
  hasSpecialChar: boolean = false;
  // --- End password validation state ---

  // Regex patterns for individual checks
  private uppercasePattern = /[A-Z]/;
  private lowercasePattern = /[a-z]/;
  private digitPattern = /\d/;
  private specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;
  // Combined pattern for the validator (ensures all conditions are met eventually)
  private combinedPasswordPattern = '^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$';

  constructor(private builder: FormBuilder, private service: AuthService, private route: Router) {
    this.registrationForm = this.builder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@gmail\\.com$')]], // Slightly improved email pattern
      password: ['', [Validators.required, Validators.pattern(this.combinedPasswordPattern)]],
      confirmPassword: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // Added ^$ for exact match
      // role: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Get the password control
    this.passwordControl = this.registrationForm.get('password') as FormControl;

    // Subscribe to value changes for dynamic validation feedback
    if (this.passwordControl) {
      this.passwordValueChangesSubscription = this.passwordControl.valueChanges.subscribe(value => {
        this.validatePasswordConditions(value || ''); // Handle null/undefined value
      });
      // Initial check in case the form is pre-filled (less likely for register)
      this.validatePasswordConditions(this.passwordControl.value || '');
    }

    // Optional: Add a cross-field validator for password mismatch
    // this.registrationForm.validator = this.passwordMatchValidator;
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    this.passwordValueChangesSubscription?.unsubscribe();
  }

  // --- Password validation logic ---
  validatePasswordConditions(password: string): void {
    this.hasUppercase = this.uppercasePattern.test(password);
    this.hasLowercase = this.lowercasePattern.test(password);
    this.hasDigit = this.digitPattern.test(password);
    this.hasSpecialChar = this.specialCharPattern.test(password);
  }
  // --- End password validation logic ---

  // --- Custom Validator for Password Match ---
  passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
      const password = form.get('password')?.value;
      const confirmPassword = form.get('confirmPassword')?.value;
      // Set passwordMismatch flag for the specific error message div
      const component = (this as any); // Access component instance if needed (careful with 'this' context)
      if(component && 'passwordMismatch' in component){
          component.passwordMismatch = password !== confirmPassword && form.get('confirmPassword')?.touched; // Only show mismatch if confirmed is touched
      }

      // Return Angular validator format (though we primarily use the flag)
      return password && confirmPassword && password !== confirmPassword ? { mismatch: true } : null;
  }
  // --- End Custom Validator ---

  get areAllConditionsMet(): boolean {
    return this.hasUppercase && this.hasLowercase && this.hasDigit && this.hasSpecialChar;
  }
  
  register(): void {
    this.registrationForm.markAllAsTouched(); // Mark all fields touched on submit attempt

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
                break; // Stop after focusing the first one
            }
        }
    }
  }

  closePopup() {
    this.formSubmitted = false;
    this.route.navigate(['/login']);
  }
}