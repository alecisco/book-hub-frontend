import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoanedBookDto } from 'src/app/models/loanedbook';


@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private apiUrl = 'https://localhost:7160'; 

  constructor(private http: HttpClient) { }

  createLoan(loanData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`+'/loans/createLoan', loanData);
  }

  getLoanedBooks(): Observable<LoanedBookDto[]> {
    return this.http.get<LoanedBookDto[]>(`${this.apiUrl}/loans/loanedBooks`);
  }
}
