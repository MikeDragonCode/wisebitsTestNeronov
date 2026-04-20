import { test as base } from '@playwright/test';
import { MainPage } from '../../src/pages/MainPage';
import { ElementsPage } from '../../src/pages/ElementsPage';
import { WebTablesPage } from '../../src/pages/WebTablesPage';
import { AccountClient } from '../../src/api/account.client';
import { BookStoreClient } from '../../src/api/bookstore.client';
import { UserCredentials } from '../../src/types';
import { config } from '../../src/config';

type UiFixtures = {
  mainPage: MainPage;
  elementsPage: ElementsPage;
  webTablesPage: WebTablesPage;
};

type ApiFixtures = {
  accountClient: AccountClient;
  bookStoreClient: BookStoreClient;
  // Новый юзер на каждый тест, после - он удаляется. Токена нет тк demoqa его не выдаёт для API юзеров
  createdUser: { userId: string; credentials: UserCredentials };
  // Юзер с токеном для тестов книжного магазина. Использует заранее созданный через UI аккаунт.
  authenticatedUser: { userId: string; token: string };
};

export const test = base.extend<UiFixtures & ApiFixtures>({
  mainPage: async ({ page }, use) => {
    await use(new MainPage(page));
  },

  elementsPage: async ({ page }, use) => {
    await use(new ElementsPage(page));
  },

  webTablesPage: async ({ page }, use) => {
    await use(new WebTablesPage(page));
  },

  accountClient: async ({ request }, use) => {
    await use(new AccountClient(request));
  },

  bookStoreClient: async ({ request }, use) => {
    await use(new BookStoreClient(request));
  },

  createdUser: async ({ accountClient }, use) => {
    const credentials: UserCredentials = {
      userName: `testuser_${Date.now()}`,
      password: 'Test@1234!',
    };

    const { status, body: user } = await accountClient.createUser(credentials);
    if (status !== 201 || !('userID' in user)) throw new Error(`Не удалось создать юзера: ${JSON.stringify(user)}`);
    const userId = user.userID;

    try {
      await use({ userId, credentials });
    } finally {
      try {
        const { body: tokenData } = await accountClient.generateToken(config.existingUser);
        await accountClient.deleteUser(userId, tokenData.token);
      } catch {
        console.warn(`Не удалось удалить тестового юзера ${userId} после теста`);
      }
    }
  },

  authenticatedUser: async ({ accountClient, bookStoreClient }, use) => {
    const { userName, password, userId } = config.existingUser;
    const { body: tokenData } = await accountClient.generateToken({ userName, password });
    if (!tokenData.token) throw new Error('demoqa не вернул токен - проверь TEST_USER / TEST_PASSWORD');
    const token = tokenData.token;

    try {
      await use({ userId, token });
    } finally {
      // Чистим коллекцию после каждого теста, чтобы следующий запуск не ловил 400 "книга уже есть".
      // demoqa иногда отвечает медленно это особенность площадки, не архитектуры теста. Можно выпитить, но я бы оставил так
      await bookStoreClient.deleteAllBooks(userId, token);
    }
  },
});

export { expect } from '@playwright/test';
