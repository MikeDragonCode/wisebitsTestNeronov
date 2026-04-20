import { test, expect } from '../fixtures';
import { TableRecord } from '../../src/types';

const record: TableRecord = {
  firstName: 'Alden',
  lastName: 'Cantrell',
  age: '30',
  email: `alden.${Date.now()}@test.com`,
  salary: '12345',
  department: 'QA',
};

test.describe('Web Tables', () => {
  test.beforeEach(async ({ mainPage, elementsPage }) => {
    await mainPage.open();
    await mainPage.navigateToElements();
    await elementsPage.openWebTables();
  });

  test('should add a new record to the table', async ({ webTablesPage }) => {
    await test.step('Open registration form', async () => {
      await webTablesPage.clickAdd();
    });

    await test.step('Fill and submit form', async () => {
      await webTablesPage.fillRegistrationForm(record);
      await webTablesPage.submitForm();
    });

    await test.step('Verify record in table', async () => {
      const row = webTablesPage.getRowByEmail(record.email);
      await expect(row).toBeVisible();

      expect(await webTablesPage.getCellValue(row, 'firstName')).toBe(record.firstName);
      expect(await webTablesPage.getCellValue(row, 'lastName')).toBe(record.lastName);
      expect(await webTablesPage.getCellValue(row, 'age')).toBe(record.age);
      expect(await webTablesPage.getCellValue(row, 'email')).toBe(record.email);
      expect(await webTablesPage.getCellValue(row, 'salary')).toBe(record.salary);
      expect(await webTablesPage.getCellValue(row, 'department')).toBe(record.department);
    });
  });
});
