import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home/home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { BookFormDialogComponent } from './home/book-form-dialog/book-form-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MyLibraryComponent } from './my-library/my-library.component';
import { MatChipsModule } from '@angular/material/chips';
import { LoanDialogComponent } from './loan-dialog/loan-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoanedBooksComponent } from './loaned-books/loaned-books.component';

@NgModule({
  declarations: [
    HomeComponent,
    BookFormDialogComponent,
    MyLibraryComponent,
    LoanDialogComponent,
    LoanedBooksComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatPaginatorModule,
    MatChipsModule,
    MatTooltipModule
  ]
})
export class CoreModule { }
