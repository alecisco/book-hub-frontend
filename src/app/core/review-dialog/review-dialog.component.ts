import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoanService } from 'src/app/services/loan/loan.service';

@Component({
  selector: 'app-review-dialog',
  templateUrl: './review-dialog.component.html',
  styleUrls: ['./review-dialog.component.css']
})
export class ReviewDialogComponent {
  reviewForm: FormGroup;
  ratings = [1, 2, 3, 4, 5]; // Ratings array for dropdown

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService,
    public dialogRef: MatDialogRef<ReviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.reviewForm = this.fb.group({
      rating: [null, Validators.required], 
      comment: ['']
    });
  }

  onSubmit(): void {
    if (this.reviewForm.valid) {
      const reviewData = {
        ...this.reviewForm.value,
        loanRequestId: this.data.loanRequestId,
        reviewerId: this.data.userId 
      };
      this.loanService.concludeLoan(reviewData).subscribe(() => {
        this.dialogRef.close();
      });
    }
  }
}
