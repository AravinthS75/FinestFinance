import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { UserStoreService } from './user-store.service';
import { AuthUser } from '../models/auth-user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private backendURL: string = 'https://psychic-spork-7ww59r94q67cr6jv-8080.app.github.dev/api';

  constructor(private httpClient: HttpClient, private userStoreService: UserStoreService) {}

  // User SignIn method
  signIn(user: User): Observable<AuthUser> {
    return this.httpClient.post<AuthUser>(`${this.backendURL}/login`, user, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json' // Content type header
      })
    });
  }

  // User SignUp method
  signUp(user: User): Observable<any> {
    return this.httpClient.post(`${this.backendURL}/register`, user, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json' // Content type header
      })
    });
  }

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    return this.userStoreService.isLoggedIn();
  }
}
