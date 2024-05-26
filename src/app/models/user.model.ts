import { BookDto } from "./book.model";

export interface User {
    userId: string;
    name: string;
    email: string;
    books: BookDto[];
}
  