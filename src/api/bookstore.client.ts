import { APIRequestContext } from '@playwright/test';
import { AddBooksPayload, AddBooksResponse, DeleteBookPayload, BooksResponse, ApiErrorResponse } from '../types';

export class BookStoreClient {
  constructor(private readonly request: APIRequestContext) {}

  async getBooks() {
    const response = await this.request.get('/BookStore/v1/Books');
    return { status: response.status(), body: await response.json() as BooksResponse };
  }

  async addBooks(payload: AddBooksPayload, token: string) {
    const response = await this.request.post('/BookStore/v1/Books', {
      data: payload,
      headers: { Authorization: `Bearer ${token}` },
    });
    return { status: response.status(), body: await response.json() as AddBooksResponse | ApiErrorResponse };
  }

  async deleteAllBooks(userId: string, token: string) {
    const response = await this.request.delete(`/BookStore/v1/Books?UserId=${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { status: response.status() };
  }

  async deleteBook(payload: DeleteBookPayload, token: string) {
    const response = await this.request.delete('/BookStore/v1/Book', {
      data: payload,
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = response.status() !== 204 ? await response.json() as ApiErrorResponse : null;
    return { status: response.status(), body };
  }
}
