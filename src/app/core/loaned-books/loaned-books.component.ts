import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoanService } from '../../services/loan/loan.service';
import { LoanedBookDto } from '../../models/loanedbook';
import { Filters } from 'src/app/models/filter.interface';
import { PageEvent } from '@angular/material/paginator';
import { RequestLoanDialogComponent } from '../request-loan-dialog/request-loan-dialog.component'; // Import the dialog component
import { HomepageService } from 'src/app/services/homepage/home.service'; // Import the service to get user's books
import { BookDto } from 'src/app/models/book.model';

@Component({
  selector: 'app-loaned-books',
  templateUrl: './loaned-books.component.html',
  styleUrls: ['./loaned-books.component.css']
})
export class LoanedBooksComponent implements OnInit {
  genres = [
    { genreId: 1, name: 'Fantasia' },
    { genreId: 2, name: 'Fantascienza' },
    { genreId: 3, name: 'Giallo' },
    { genreId: 4, name: 'Thriller' },
    { genreId: 5, name: 'Storico' }
  ];
  filters: Filters = {
    genre: '',
    author: '',
    title: '',
    year: ''
  };
  filteredBooks: LoanedBookDto[] = [];
  paginatedBooks: LoanedBookDto[] = [];
  pageSize = 20;
  userBooks: BookDto[] = []; 
  genreColors: { [key: string]: string } = {};

  constructor(private loanService: LoanService, public dialog: MatDialog, private homepageService: HomepageService) {}

  ngOnInit(): void {
    this.loadLoanedBooks();
    this.loadUserBooks();
  }

  loadLoanedBooks(): void {
    this.loanService.getLoanedBooks().subscribe({
      next: (books: LoanedBookDto[]) => {
        this.filteredBooks = books;
        this.paginate({ pageIndex: 0, pageSize: this.pageSize, length: this.filteredBooks.length });
        this.assignGenreColors();
      },
    });
  }

  loadUserBooks(): void {
    this.homepageService.getHomeData().subscribe({
      next: (data) => {
        this.userBooks = data.user.books;
        this.assignGenreColors();
      },
      error: (error) => {
        console.error('Error fetching user books', error);
      }
    });
  }

  applyFilters(event?: Event): void {
    if (event && event.target) {
      const target = event.target as HTMLInputElement;
      const name = target.name;
      this.filters[name] = target.value;
    }

    this.filteredBooks = this.filteredBooks.filter(book => {
      return (!this.filters.genre || book.genreName === this.filters.genre) &&
             (!this.filters.author || book.author.toLowerCase().includes(this.filters.author.toLowerCase())) &&
             (!this.filters.title || book.title.toLowerCase().includes(this.filters.title.toLowerCase())) &&
             (!this.filters.year || book.publicationYear.toString().includes(this.filters.year));
    });
    this.paginate({ pageIndex: 0, pageSize: this.pageSize, length: this.filteredBooks.length });
  }

  paginate(event: PageEvent): void {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.paginatedBooks = this.filteredBooks.slice(startIndex, endIndex);
  }

  openRequestLoanDialog(book: LoanedBookDto): void {
    const dialogRef = this.dialog.open(RequestLoanDialogComponent, {
      width: '400px',
      data: { book, userBooks: this.userBooks }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadLoanedBooks();
        this.loadUserBooks();
      }
    });
  }

  truncateText(text: string, length: number): string {
    if (text.length <= length) {
      return text;
    }
    return text.substring(0, length) + '...';
  }

  private assignGenreColors(): void {
    this.filteredBooks.forEach(book => {
      if (!this.genreColors[book.genreName]) {
        this.genreColors[book.genreName] = this.getRandomColor();
      }
    });
  }

  private getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  getGenreColor(genre: string): string {
    return this.genreColors[genre] || '#ccc';
  }
}
