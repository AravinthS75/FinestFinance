import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { Loan } from '../models/loan.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  public apiUrl = "https://psychic-spork-7ww59r94q67cr6jv-8080.app.github.dev/api/admin";

  public loanUrl = "https://psychic-spork-7ww59r94q67cr6jv-8080.app.github.dev/api/loans"

  constructor(private http: HttpClient) { }

    getAllUsers(token: string): Observable<User[]> {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    });
  
    return this.http.get<User[]>(`${this.apiUrl}/all-users`, { headers });
    }
  
    getAllManagers(token: string): Observable<User[]> {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    });
  
    return this.http.get<User[]>(`${this.apiUrl}/all-managers`, { headers });
    }

    getAllLoans(token: string): Observable<Loan[]> {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    });
  
    return this.http.get<Loan[]>(`${this.loanUrl}`, { headers });
    }

}
