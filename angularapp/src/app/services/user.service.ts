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

  getAdminDetails(userId: number, token: string): Observable<User> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<User>(`${this.apiUrl}/admin/${userId}`, { headers });
  }
  getManagerDetails(userEmail: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/manager?email=${userEmail}`);
  }

  getUserDetails(userEmail: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}?email=${userEmail}`);
  }
}
