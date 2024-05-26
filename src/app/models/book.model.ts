export interface BookCreateDto {
  title: string;
  author: string;
  publicationYear: number;
  isbn: string;
  description: string;
  condition: string;
  available: boolean;
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
  available: boolean;
  photoUrl: string;
  genreId: number;
  genreName: string;
  userId: number;
}