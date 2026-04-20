import { Page } from '@playwright/test';

export class MainPage {
  constructor(private readonly page: Page) {}

  async open() {
    await this.page.goto('/');
  }

  async navigateToElements() {
    const card = this.page.locator('.card-body', { hasText: 'Elements' });
    await card.scrollIntoViewIfNeeded();
    await card.click();
  }
}
