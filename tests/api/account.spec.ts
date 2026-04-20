import { test, expect } from '../fixtures';
import { isApiError } from '../../src/types';

test.describe('Account API - Create User', () => {
  test(
    'happy path: should create a new user and return userID',
    { tag: '@live' },
    async ({ createdUser }) => {
      expect(createdUser.userId).toBeTruthy();
      expect(createdUser.credentials.userName).toContain('testuser_');
    },
  );

  test('unhappy path: should return 400 when password does not meet requirements', async ({ accountClient }) => {
    const { status, body } = await accountClient.createUser({
      userName: `user_weak_${Date.now()}`,
      password: 'weak',
    });

    expect(status).toBe(400);
    expect(isApiError(body)).toBe(true);
    if (isApiError(body)) {
      expect(body.message).toContain('Passwords must have at least one');
    }
  });

  test(
    'unhappy path: should return 406 when username already exists',
    { tag: '@live' },
    async ({ createdUser, accountClient }) => {
      const { status, body } = await accountClient.createUser({
        userName: createdUser.credentials.userName,
        password: createdUser.credentials.password,
      });

      expect(status).toBe(406);
      expect(isApiError(body)).toBe(true);
      if (isApiError(body)) {
        expect(body.message).toBe('User exists!');
      }
    },
  );
});
