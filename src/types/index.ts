export interface UserCredentials {
  userName: string;
  password: string;
}

export interface UserResponse {
  userID: string;
  username: string;
  books: Book[];
}

export interface TokenResponse {
  token: string;
  expires: string;
  status: string;
  result: string;
}

export interface Book {
  isbn: string;
  title: string;
  subTitle: string;
  author: string;
  publish_date: string;
  publisher: string;
  pages: number;
  description: string;
  website: string;
}

export interface BooksResponse {
  books: Book[];
}

export interface AddBooksResponse {
  books: { isbn: string }[];
}

export interface AddBooksPayload {
  userId: string;
  collectionOfIsbns: { isbn: string }[];
}

export interface DeleteBookPayload {
  isbn: string;
  userId: string;
}

export interface ApiErrorResponse {
  code: string;
  message: string;
}

export function isApiError(body: unknown): body is ApiErrorResponse {
  return typeof body === 'object' && body !== null && 'message' in body;
}

export interface TableRecord {
  firstName: string;
  lastName: string;
  age: string;
  email: string;
  salary: string;
  department: string;
}
