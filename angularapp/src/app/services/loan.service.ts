import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Loan } from '../models/loan.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  public loanUrl = "https://psychic-spork-7ww59r94q67cr6jv-8080.app.github.dev/api/loans";

  constructor(private http: HttpClient) { }

  userApplyPersonalLoan(token: string, userId: number | null, loan: Loan): Observable<Loan>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    
    return this.http.post<Loan>(
      `${this.loanUrl}/user/${userId}`, 
      loan, 
      { headers }
    );
  }
}
