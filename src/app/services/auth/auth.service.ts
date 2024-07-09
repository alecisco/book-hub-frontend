import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { UserService } from '../user/user.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7160/Account';
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  private authChange = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private userService: UserService) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  get isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  get authChanged(): Observable<boolean> {
    return this.authChange.asObservable();
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.setSession(response);
        this.loggedIn.next(true);
        this.authChange.next(true);
        this.loadUserProfile().subscribe(); 
      })
    );
  }

  private setSession(authResult: any) {
    localStorage.setItem('token', authResult.token);
  }

  logout() {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
    this.authChange.next(false); 
    this.userService.setUser(null);
  }

  public getToken(): string {
    return localStorage.getItem('token') || '';
  }

  getUserProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile`).pipe(
      tap(user => this.userService.setUser(user))
    );
  }

  updateProfile(profileData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/profile`, profileData).pipe(
      tap(() => this.loadUserProfile().subscribe()) 
    );
  }

  changePassword(passwordData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/change-password`, passwordData);
  }

  private loadUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`).pipe(
      tap(user => this.userService.setUser(user))
    );
  }

  public getUser(): User | null {
    return this.userService.getUser();
  }
}
