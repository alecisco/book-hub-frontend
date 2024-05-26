import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HomepageService } from '../../../services/homepage/home.service';
import { User } from 'src/app/models/user.model';
import { BookFormDialogComponent } from '../book-form-dialog/book-form-dialog.component';
import { PageEvent } from '@angular/material/paginator';
import { BookCreateDto, BookDto } from 'src/app/models/book.model';
import { Filters } from 'src/app/models/filter.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
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
    year: ''
  };
  filteredBooks: BookDto[] = [];
  paginatedBooks: BookDto[] = [];
  pageSize = 20;

  constructor(private homepageService: HomepageService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadHomeData();
  }

  private loadHomeData(): void {
    this.homepageService.getHomeData().subscribe({
      next: (data) => {
        this.userData = data.user;
        this.applyFilters();
        console.log(data);
      },
      error: (error) => {
        console.error('Error fetching user data', error);
      }
    });
  }

  applyFilters(event?: Event): void {
    if (event && event.target) {
      const target = event.target as HTMLInputElement;
      const name = target.name;
      this.filters[name] = target.value;
    }

    if(this.userData != null ){
      this.filteredBooks = this.userData.books.filter(book => {
        return (!this.filters.genre || book.genreId === this.filters.genre) &&
               (!this.filters.author || book.author.toLowerCase().includes(this.filters.author.toLowerCase())) &&
               (!this.filters.title || book.title.toLowerCase().includes(this.filters.title.toLowerCase())) &&
               (!this.filters.year || book.publicationYear.toString().includes(this.filters.year));
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
          },
          error: (error) => {
            console.error('Failed to add book', error);
          }
        });
      }
    });
  }
}
