import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { BookDto, BookCreateDto } from 'src/app/models/book.model';

@Injectable({
  providedIn: 'root'
})
export class HomepageService {
  private apiUrl = 'https://localhost:7160'; 

  constructor(private http: HttpClient) { }

  getHomeData(): Observable<any> {
    return this.http.get<User>(`${this.apiUrl}/home/getHomeData`); 
  }

  addBook(book: BookCreateDto ): Observable<BookDto> {
    return this.http.post<BookDto >(`${this.apiUrl}/books/AddBook`, book);
  }
}
