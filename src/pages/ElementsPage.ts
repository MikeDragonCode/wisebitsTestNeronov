import { Page } from '@playwright/test';

export class ElementsPage {
  constructor(private readonly page: Page) {}

  async openWebTables() {
    const item = this.page.locator('.menu-list li', { hasText: 'Web Tables' });
    await item.scrollIntoViewIfNeeded();
    await item.click();
  }
}
