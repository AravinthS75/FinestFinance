import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserStoreService } from '../../services/user-store.service';
import { User } from '../../models/user.model';
import { AuthUser } from '../../models/auth-user.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: false,
  
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  isNoData: boolean=false;
  error: string | null =null;
login() {
throw new Error('Method not implemented.');
}
  loginForm: FormGroup;

  constructor(
    private builder: FormBuilder, 
    private service: AuthService, 
    private router: Router, 
    private store: UserStoreService
  ) {
    this.loginForm = this.builder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  signIn(): void {
    if (this.loginForm.valid) {
      const loginUser: User = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value
      };
      this.isNoData=false
      this.service.signIn(loginUser).subscribe((authUser: AuthUser) => {
        this.store.saveUser(authUser);

        if (authUser.role === 'ADMIN') {
          this.router.navigate(['']);
        } else if (authUser.role === 'USER') {
          this.router.navigate(['']);
        }
        else if (authUser.role === 'MANAGER'){
          this.router.navigate(['']);
        }
      },(errorResponse: HttpErrorResponse)=>{
        this.isNoData = true;
        this.error = localStorage.getItem('error');
      });
    }
  }
  
  
}
