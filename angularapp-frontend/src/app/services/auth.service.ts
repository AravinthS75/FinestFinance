import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/user.model';
import { UserStoreService } from './user-store.service';
import { AuthUser } from '../models/auth-user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private backendURL: string = 'https://finestfinance-backendend.onrender.com/api';

  constructor(private httpClient: HttpClient, private userStoreService: UserStoreService) {}

  signIn(user: User): Observable<AuthUser> {
    return this.httpClient.post<AuthUser>(`${this.backendURL}/login`, user, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  signUp(user: User): Observable<any> {
    return this.httpClient.post(`${this.backendURL}/register`, user, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  isAuthenticated(): boolean {
    return this.userStoreService.isLoggedIn();
  }

  sendPasswordResetEmail(email: string): Observable<any> {
    return this.httpClient.post(`${this.backendURL}/auth/forgot-password`, { email })
      .pipe(
        catchError(error => {
          let errorMsg = 'Failed to send reset email';
          if (error.error?.message) {
            errorMsg = error.error.message;
          }
          return throwError(() => new Error(errorMsg));
        })
      );
  }

  
  resetPassword(token: string, password: string): Observable<any> {
      return this.httpClient.put(`${this.backendURL}/auth/reset-password`, { token, password });
  }
  
}
