import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-book-form-dialog',
  templateUrl: './book-form-dialog.component.html',
  styleUrls: ['./book-form-dialog.component.css']
})
export class BookFormDialogComponent implements OnInit {
  bookForm: FormGroup;
  genres = [
    { genreId: 1, name: 'Fantasia' },
    { genreId: 2, name: 'Fantascienza' },
    { genreId: 3, name: 'Giallo' },
    { genreId: 4, name: 'Thriller' },
    { genreId: 5, name: 'Storico' }
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<BookFormDialogComponent>
  ) {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      publicationYear: ['', Validators.required],
      isbn: ['', Validators.required],
      description: ['', Validators.required],
      condition: ['', Validators.required],
      available: [true, Validators.required],
      photoUrl: ['', Validators.required],
      genreId: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.bookForm.valid) {
      this.dialogRef.close(this.bookForm.value);
    }
  }
}
