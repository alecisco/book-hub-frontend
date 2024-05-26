import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7160/Account';

  constructor(private http: HttpClient) { }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => this.setSession(response))
    );
  }

  private setSession(authResult: any) {
    localStorage.setItem('token', authResult.token);
    //TODO Qui puoi anche impostare il tempo di scadenza del token se presente
  }

  logout() {
    localStorage.removeItem('token');
    //TODO Gestisci qui il logout, come il reindirizzamento o la pulizia di altri dati memorizzati
  }

  public isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  public getToken(): string {
    return localStorage.getItem('token') || '';
  }
}
