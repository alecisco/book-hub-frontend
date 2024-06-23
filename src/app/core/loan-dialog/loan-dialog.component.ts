import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoanService } from '../../services/loan/loan.service';

@Component({
  selector: 'app-loan-dialog',
  templateUrl: './loan-dialog.component.html',
  styleUrls: ['./loan-dialog.component.css']
})
export class LoanDialogComponent {
  loanForm: FormGroup;
  showSpecificBookInput = false;

  constructor(
    public dialogRef: MatDialogRef<LoanDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private loanService: LoanService
  ) {
    this.loanForm = this.fb.group({
      loanType: [''],
      specificBook: ['']
    });
  }

  onLoanTypeChange(): void {
    const loanType = this.loanForm.get('loanType')?.value;
    this.showSpecificBookInput = (loanType === 'specificBook');
  }

  onSubmit(): void {
    if (this.loanForm.valid) {
      const loanData = {
        bookId: this.data.book.bookId, 
        loanType: this.loanForm.get('loanType')?.value,
        specificBookTitle: this.showSpecificBookInput ? this.loanForm.get('specificBook')?.value : null
      };

      this.loanService.createLoan(loanData).subscribe({
        next: (response) => {
          console.log('Loan created successfully', response);
          this.dialogRef.close(loanData);
        },
        error: (error) => {
          console.error('Error creating loan', error);
        }
      });
    }
  }
}