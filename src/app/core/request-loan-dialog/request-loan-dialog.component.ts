import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoanService } from '../../services/loan/loan.service';
import { BookDto } from 'src/app/models/book.model';

@Component({
  selector: 'app-request-loan-dialog',
  templateUrl: './request-loan-dialog.component.html',
  styleUrls: ['./request-loan-dialog.component.css']
})
export class RequestLoanDialogComponent {
  requestForm: FormGroup;
  showSpecificBookInput = false;
  userBooks: BookDto[];

  constructor(
    public dialogRef: MatDialogRef<RequestLoanDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private loanService: LoanService
  ) {
    this.userBooks = data.userBooks;
    this.requestForm = this.fb.group({
      specificBookId: [''],
      message: ['']
    });

    this.showSpecificBookInput = data.book.loanType === 'specificBook';
  }

  onSubmit(): void {
    if (this.requestForm.valid) {
      const loanRequest = {
        bookId: this.data.book.bookId,
        message: this.requestForm.get('message')?.value,
        specificBookId: this.showSpecificBookInput ? this.requestForm.get('specificBookId')?.value : null
      };

      this.loanService.createLoanRequest(loanRequest).subscribe({
        next: (response) => {
          console.log('Loan request created successfully', response);
          this.dialogRef.close(this.requestForm.value);
        },
        error: (error) => {
          console.error('Error creating loan request', error);
        }
      });
    }
  }
}
