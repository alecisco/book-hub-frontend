export interface LoanHistoryDto {
  loanRequestId: number;
  bookId: number;
  bookTitle: string;
  author: string;
  borrowerName: string;
  lenderName: string;
  startDate: Date;
  endDate: Date;
  borrowerReview: ReviewDto | null;
  lenderReview: ReviewDto | null;
}

export interface ReviewDto {
  rating: number;
  comment: string;
}
