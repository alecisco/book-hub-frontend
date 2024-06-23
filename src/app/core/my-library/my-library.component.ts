import { Component, OnInit, Input, OnChanges, SimpleChanges, ElementRef   } from '@angular/core';
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

@Component({
  selector: 'app-my-library',
  templateUrl: './my-library.component.html',
  styleUrls: ['./my-library.component.css']
})
export class MyLibraryComponent implements OnInit, OnChanges {
  @Input() userData: User | null = null;
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
    status: ''  // Add this line
  };
  filteredBooks: BookDto[] = [];
  paginatedBooks: BookDto[] = [];
  pageSize = 20;

  constructor(
    private homepageService: HomepageService,
    public dialog: MatDialog,
    private loanService: LoanService
  ) {}

  ngOnInit(): void {
    if (this.userData) {
      this.applyFilters();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userData'] && this.userData) {
      this.applyFilters();
    }
  }

  applyFilters(event?: Event | MatSelectChange): void {
    if (event) {
      if (event instanceof MatSelectChange) {
        const target = event.source._elementRef.nativeElement; 
        const name = target.getAttribute('name'); 
        this.filters[name] = event.value;
      } else {
        const target = event.target as HTMLInputElement;
        const name = target.name;
        this.filters[name] = target.value;
      }
    }

    if (this.userData) {
      this.filteredBooks = this.userData.books.filter(book => {
        return (!this.filters.genre || book.genreId === this.filters.genre) &&
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
      }
    });
  }

  retractLoan(book: BookDto): void {
    console.log('Retract loan:', book);
  }
}