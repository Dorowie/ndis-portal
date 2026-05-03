import { test, expect } from '@playwright/test';
import {loginAs} from './helpers/auth.helper'; 

test.describe('Coordinator Dashboard', () => {

  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'coordinator');
  });

  // Dashboard stat cards are visible
  test('Dashboard stat cards are visible', async ({ page }) => {
  await expect(page.getByText('Total Bookings')).toBeVisible();
  await expect(page.getByText('Pending Approval')).toBeVisible();
  await expect(page.getByText('APPROVED', { exact: true })).toBeVisible();
  await expect(page.getByText('Cancellations')).toBeVisible();
});

  // Coordinator can approve a Pending booking
  test('Coordinator can approve a Pending booking', async ({ page }) => {
  const row = page.locator('tr').filter({ hasText: 'Pending' }).first();
  await expect(row).toBeVisible();
  const approveBtn = row.getByRole('button', { name: 'Approve' });
  await expect(approveBtn).toBeVisible();
  await approveBtn.click();
});

  // Approved booking shows green status badge
  test('Approved booking shows green status badge', async ({ page }) => {

  const row = page.locator('tr').filter({ hasText: 'Approved' }).first();

  await expect(row).toBeVisible();

  const statusCell = row.locator('td').filter({ hasText: 'Approved' });

  await expect(statusCell).toBeVisible();
});

  // Coordinator can add a new service via modal
test('Coordinator can add a new service via modal', async ({ page }) => {

  await page.getByRole('link', { name: 'Manage Services' }).click();

  await page.getByTestId('add-service-btn').click();

  await page.getByRole('textbox', { name: 'e.g. Community Access' }).fill('Social Support');

  await page.getByTestId('service-modal')
    .getByRole('combobox')
    .selectOption('Community Access');

  await page.getByRole('textbox', { name: 'Provide a detailed overview' })
    .fill('Focuses on improving confidence, reducing isolation and overall well being');

  await page.getByTestId('save-btn').click();

  await expect(page.getByText('Social Support')).toBeVisible();
});

  // New service appears in the services table
  test('New service appears in the services table', async ({ page }) => {
    await page.click('text=Manage Services');

    await expect(page.getByText('Social Support')).toBeVisible();
  });

});

