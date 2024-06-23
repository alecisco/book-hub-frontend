export interface LoanedBookDto {
    loanId: number;
    bookId: number;
    title: string;
    author: string;
    publicationYear: number;
    isbn: string;
    description: string;
    condition: string;
    photoUrl: string;
    genreId: number;
    genreName: string;
    loanType: string;
    specificBookTitle?: string; 
  }
  