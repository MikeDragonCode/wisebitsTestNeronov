import { Page, Locator } from '@playwright/test';
import { TableRecord } from '../types';

const COLUMNS = {
  firstName: 0,
  lastName: 1,
  age: 2,
  email: 3,
  salary: 4,
  department: 5,
} as const;

type Column = keyof typeof COLUMNS;

export class WebTablesPage {
  private readonly addButton: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly ageInput: Locator;
  private readonly emailInput: Locator;
  private readonly salaryInput: Locator;
  private readonly departmentInput: Locator;
  private readonly submitButton: Locator;
  private readonly formModal: Locator;

  constructor(private readonly page: Page) {
    this.addButton = page.locator('#addNewRecordButton');
    this.firstNameInput = page.locator('#firstName');
    this.lastNameInput = page.locator('#lastName');
    this.ageInput = page.locator('#age');
    this.emailInput = page.locator('#userEmail');
    this.salaryInput = page.locator('#salary');
    this.departmentInput = page.locator('#department');
    this.submitButton = page.locator('#submit');
    this.formModal = page.locator('.modal-content');
  }

  async clickAdd() {
    await this.addButton.click();
    await this.formModal.waitFor({ state: 'visible' });
  }

  async fillRegistrationForm(record: TableRecord) {
    await this.firstNameInput.fill(record.firstName);
    await this.lastNameInput.fill(record.lastName);
    await this.ageInput.fill(record.age);
    await this.emailInput.fill(record.email);
    await this.salaryInput.fill(record.salary);
    await this.departmentInput.fill(record.department);
  }

  async submitForm() {
    await this.submitButton.click();
    await this.formModal.waitFor({ state: 'hidden' });
  }

  getRowByEmail(email: string): Locator {
    return this.page.locator('tbody tr').filter({
      has: this.page.locator('td', { hasText: new RegExp(`^${email}$`) }),
    });
  }

  getCellValue(row: Locator, column: Column): Promise<string | null> {
    return row.locator('td').nth(COLUMNS[column]).textContent();
  }
}
