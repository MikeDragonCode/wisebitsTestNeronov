import { APIRequestContext } from '@playwright/test';
import { UserCredentials, UserResponse, TokenResponse, ApiErrorResponse } from '../types';

export class AccountClient {
  constructor(private readonly request: APIRequestContext) {}

  async createUser(credentials: UserCredentials) {
    const response = await this.request.post('/Account/v1/User', {
      data: credentials,
    });
    return { status: response.status(), body: await response.json() as UserResponse | ApiErrorResponse };
  }

  async generateToken(credentials: UserCredentials) {
    const response = await this.request.post('/Account/v1/GenerateToken', {
      data: credentials,
    });
    return { status: response.status(), body: await response.json() as TokenResponse };
  }

  async deleteUser(userId: string, token: string) {
    const response = await this.request.delete(`/Account/v1/User/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { status: response.status() };
  }
}
