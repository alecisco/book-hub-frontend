export interface BookCreateDto {
  title: string;
  author: string;
  publicationYear: number;
  isbn: string;
  description: string;
  condition: string;
  photoUrl: string;
  genreId: number;
  userId?: number;
}

export interface BookDto {
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
  status: string; 
  ownerName?: string; 
  borrowerName?: string; 
  loanRequestId?: number; 
}
