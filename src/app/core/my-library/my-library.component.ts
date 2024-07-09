import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HomepageService } from '../../services/homepage/home.service';
import { BookFormDialogComponent } from '../home/book-form-dialog/book-form-dialog.component';
import { PageEvent } from '@angular/material/paginator';
import { BookCreateDto, BookDto } from 'src/app/models/book.model';
import { Filters } from 'src/app/models/filter.interface';
import { User } from 'src/app/models/user.model';
import { LoanDialogComponent } from '../loan-dialog/loan-dialog.component';
import { LoanService } from 'src/app/services/loan/loan.service';
import { MatSelectChange } from '@angular/material/select';
import { ReviewDialogComponent } from '../review-dialog/review-dialog.component';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-my-library',
  templateUrl: './my-library.component.html',
  styleUrls: ['./my-library.component.css']
})
export class MyLibraryComponent implements OnInit, OnChanges {
  userData: User | null = null;
  genres = [
    { genreId: 1, name: 'Fantasia' },
    { genreId: 2, name: 'Fantascienza' },
    { genreId: 3, name: 'Giallo' },
    { genreId: 4, name: 'Thriller' },
    { genreId: 5, name: 'Storico' }
  ];
  filters: Filters = {
    genre: null,
    author: '',
    title: '',
    year: '',
    status: ''
  };
  filteredBooks: BookDto[] = [];
  paginatedBooks: BookDto[] = [];
  pageSize = 20;
  genreColors: { [key: string]: string } = {};

  constructor(
    private homepageService: HomepageService,
    public dialog: MatDialog,
    private loanService: LoanService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadHomeData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userData'] && this.userData) {
      this.applyFilters();
    }
  }

  private loadHomeData(): void {
    this.homepageService.getHomeData().subscribe({
      next: (data) => {
        this.userData = data.user;
        this.userService.setUser(data.user);
        this.filteredBooks = data.books;
        this.applyFilters();
        this.assignGenreColors();
        console.log(data);
      },
      error: (error) => {
        console.error('Error fetching user data', error);
      }
    });
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

  applyFilters(event?: Event | MatSelectChange): void {
    if (event) {
      if (event instanceof MatSelectChange) {
        const target = event.source._elementRef.nativeElement;
        const name = target.getAttribute('name');
        this.filters[name] = event.value === 'all' ? null : event.value;
        console.log(`Filter updated: ${name} = ${event.value}`);
      } else {
        const target = event.target as HTMLInputElement;
        const name = target.name;
        this.filters[name] = target.value;
        console.log(`Filter updated: ${name} = ${target.value}`);
      }
    }

    if (this.userData) {
      this.filteredBooks = this.userData.books.filter(book => {
        return (!this.filters.genre || book.genreName === this.filters.genre) &&
               (!this.filters.author || book.author.toLowerCase().includes(this.filters.author.toLowerCase())) &&
               (!this.filters.title || book.title.toLowerCase().includes(this.filters.title.toLowerCase())) &&
               (!this.filters.year || book.publicationYear.toString().includes(this.filters.year)) &&
               (!this.filters['status'] || book.status === this.filters['status']);
      });
      this.paginate({ pageIndex: 0, pageSize: this.pageSize, length: this.filteredBooks.length });
    }
  }

  paginate(event: PageEvent): void {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.paginatedBooks = this.filteredBooks.slice(startIndex, endIndex);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(BookFormDialogComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newBook: BookCreateDto = {
          ...result,
          userId: this.userData?.userId,
        };
        this.homepageService.addBook(newBook).subscribe({
          next: (book: BookDto) => {
            this.userData?.books.push(book);
            this.applyFilters();
          },
          error: (error) => {
            console.error('Failed to add book', error);
          }
        });
      }
    });
  }

  openLoanDialog(book: BookDto): void {
    const dialogRef = this.dialog.open(LoanDialogComponent, {
      width: '400px',
      data: { book }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Loan action:', result);
        this.loadHomeData(); 
      }
    });
  }

  retractLoan(book: BookDto): void {
    this.loanService.retractLoan(book.bookId).subscribe({
      next: () => {
        console.log('Loan retracted successfully');
        this.loadHomeData(); 
      },
      error: (error) => {
        console.error('Failed to retract loan', error);
      }
    });
  }

  openReviewDialog(book: BookDto, actionType: string): void {
    const dialogRef = this.dialog.open(ReviewDialogComponent, {
      width: '400px',
      data: { loanRequestId: book.loanRequestId, userId: this.userData?.userId, actionType }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Review submitted:', result);
        this.applyFilters();
        this.loadHomeData();
      }
    });
  }

  getTooltip(book: BookDto): string {
    if (book.status === 'in libreria') {
      return 'Concedi in prestito';
    } else if (book.status === 'disponibile per il prestito') {
      return 'Ritira dal prestito';
    } 
    return '';
  }

  handleButtonClick(book: BookDto): void {
    if (book.status === 'in libreria') {
      this.openLoanDialog(book);
    } else if (book.status === 'disponibile per il prestito') {
      this.retractLoan(book);
    }
  }

  truncateText(text: string, length: number): string {
    if (text.length <= length) {
      return text;
    }
    return text.substring(0, length) + '...';
  }

  openEditDialog(book: BookDto): void {
    const dialogRef = this.dialog.open(BookFormDialogComponent, {
      width: '600px',
      data: book
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.delete) {
          this.homepageService.deleteBook(book.bookId).subscribe(() => {
            this.userData!.books = this.userData!.books.filter(b => b.bookId !== book.bookId);
            this.applyFilters();
            this.loadHomeData();
          });
        } else {
          const updatedBook: BookDto = {
            ...book,
            ...result
          };
          this.homepageService.updateBook(book.bookId, updatedBook).subscribe(() => {
            const bookIndex = this.userData!.books.findIndex(b => b.bookId === book.bookId);
            if (bookIndex !== -1) {
              this.userData!.books[bookIndex] = updatedBook;
            }
            this.applyFilters();
            this.loadHomeData();
          });
        }
      }
    });
  }
  
}
