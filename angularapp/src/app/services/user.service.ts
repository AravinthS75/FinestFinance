import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public apiUrl = "https://psychic-spork-7ww59r94q67cr6jv-8080.app.github.dev/api/user";

  constructor(private http: HttpClient) { }

  getUserDetails(userId: number, token: string): Observable<User> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
  });

  return this.http.get<User>(`${this.apiUrl}/user/${userId}`, { headers });
  }

  updateUserProfile(userId: number, user: User, token: string): Observable<User> {
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    });
    
    return this.http.put<User>(
        `${this.apiUrl}/admin/${userId}`,
        user,
        { headers: headers }
    );
  }

}
