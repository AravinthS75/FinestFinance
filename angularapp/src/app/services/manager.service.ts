import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Loan } from '../models/loan.model';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  public loanUrl = "https://psychic-spork-7ww59r94q67cr6jv-8080.app.github.dev/api/loans";

  constructor(private http: HttpClient) { }

  getAllAssignedLoans(token: string, approverName: string): Observable<Loan[]> {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
      });
    
      return this.http.get<Loan[]>(`${this.loanUrl}/manager/${approverName}`, { headers });
  }


  updateLoanStatus(token: string, loanId: number, status: string): Observable<Loan> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const JSONstatus = {
      "status" : status
    }

    return this.http.patch<Loan>(`${this.loanUrl}/manager/${loanId}/status`, JSONstatus, { headers });
}
  
}
