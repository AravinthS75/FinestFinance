import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { HttpErrorResponse } from '@angular/common/http';
import { trigger, transition, style, animate } from '@angular/animations';
import Swal from 'sweetalert2';
import { ViewEncapsulation } from '@angular/core';

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
export class RegisterComponent implements OnInit {
  registrationForm: FormGroup;
  passwordMismatch: boolean = false;
  isNoData: boolean = false;
  error: string | null = null;
  formSubmitted = false;

  constructor(private builder: FormBuilder, private service: AuthService, private route: Router) {
    this.registrationForm = this.builder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+@gmail\\.com$')]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$')]],
      confirmPassword: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      // role: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  register(): void {
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
          // this.route.navigate(['/login']);
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.isNoData = true;
          this.error = errorResponse.error;
          Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
            text: this.error || 'An unknown error occurred.'
          });
        }
      });
    }
  }

  closePopup() {
    this.formSubmitted = false;
    this.route.navigate(['/login']);
  }
}