import { test, expect } from '../fixtures';
import { isApiError } from '../../src/types';

test.describe('BookStore API - Add Books', () => {
  test(
    'happy path: should add a book to user collection',
    { tag: '@live' },
    async ({ authenticatedUser, bookStoreClient }) => {
      const { body: booksData } = await bookStoreClient.getBooks();
      const isbn = booksData.books[0].isbn;

      const { status, body } = await bookStoreClient.addBooks(
        { userId: authenticatedUser.userId, collectionOfIsbns: [{ isbn }] },
        authenticatedUser.token,
      );

      expect(status).toBe(201);
      expect(isApiError(body)).toBe(false);
      if (!isApiError(body)) {
        expect(body.books).toContainEqual({ isbn });
      }
    },
  );

  test(
    'unhappy path: should return 401 when adding books without valid token',
    { tag: '@live' },
    async ({ authenticatedUser, bookStoreClient }) => {
      const { body: booksData } = await bookStoreClient.getBooks();
      const isbn = booksData.books[0].isbn;

      const { status } = await bookStoreClient.addBooks(
        { userId: authenticatedUser.userId, collectionOfIsbns: [{ isbn }] },
        'invalid_token',
      );

      expect(status).toBe(401);
    },
  );

  test(
    'unhappy path: should return 400 when isbn does not exist',
    { tag: '@live' },
    async ({ authenticatedUser, bookStoreClient }) => {
      const { status, body } = await bookStoreClient.addBooks(
        { userId: authenticatedUser.userId, collectionOfIsbns: [{ isbn: 'nonexistent-isbn' }] },
        authenticatedUser.token,
      );

      expect(status).toBe(400);
      expect(isApiError(body)).toBe(true);
      if (isApiError(body)) {
        expect(body.message).toBe('ISBN supplied is not available in Books Collection!');
      }
    },
  );
});

test.describe('BookStore API - Delete Book', () => {
  test(
    'happy path: should delete a book from user collection',
    { tag: '@live' },
    async ({ authenticatedUser, bookStoreClient }) => {
      const { body: booksData } = await bookStoreClient.getBooks();
      const isbn = booksData.books[0].isbn;

      await bookStoreClient.addBooks(
        { userId: authenticatedUser.userId, collectionOfIsbns: [{ isbn }] },
        authenticatedUser.token,
      );

      const { status } = await bookStoreClient.deleteBook(
        { isbn, userId: authenticatedUser.userId },
        authenticatedUser.token,
      );

      expect(status).toBe(204);
    },
  );

  test(
    'unhappy path: should return 401 when deleting without valid token',
    { tag: '@live' },
    async ({ authenticatedUser, bookStoreClient }) => {
      const { body: booksData } = await bookStoreClient.getBooks();
      const isbn = booksData.books[0].isbn;

      const { status } = await bookStoreClient.deleteBook(
        { isbn, userId: authenticatedUser.userId },
        'invalid_token',
      );

      expect(status).toBe(401);
    },
  );

  test(
    'unhappy path: should return 400 when book is not in user collection',
    { tag: '@live' },
    async ({ authenticatedUser, bookStoreClient }) => {
      const { body: booksData } = await bookStoreClient.getBooks();
      const isbn = booksData.books[0].isbn;

      const { status, body } = await bookStoreClient.deleteBook(
        { isbn, userId: authenticatedUser.userId },
        authenticatedUser.token,
      );

      expect(status).toBe(400);
      expect(isApiError(body)).toBe(true);
      if (isApiError(body)) {
        expect(body.message).toBe("ISBN supplied is not available in User's Collection!");
      }
    },
  );
});
