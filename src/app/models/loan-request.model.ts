export interface LoanRequestDto {
  id: number;
  bookId: number;
  bookTitle: string;
  requesterUserId: number;
  requesterUserName: string;
  message: string;
  requestDate: Date;
  status: string;
  specificBookTitle: string
}

export interface CreateLoanRequestDto {
  bookId: number;
  message: string;
}
