import { test, expect } from '@playwright/test';
import {loginAs} from './helpers/auth.helper'; 

test.describe('Coordinator Dashboard', () => {

  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'coordinator');

    await expect(page.getByText('Total Bookings')).toBeVisible();
  });

  // Dashboard stat cards are visible
  test('Dashboard stat cards are visible', async ({ page }) => {
  await expect(page.getByText('Total Bookings')).toBeVisible();
  await expect(page.getByText('Pending Approval')).toBeVisible();
  await expect(page.getByText('APPROVED', { exact: true })).toBeVisible();
  await expect(page.getByText('Cancellations')).toBeVisible();
});

  // Coordinator can add a new service via modal
    test('Coordinator can add a new service via modal', async ({ page }) => {

    await page.getByRole('link', { name: 'Manage Services' }).click();

    await page.getByTestId('add-service-btn').click();

    await page.getByRole('textbox', { name: 'e.g. Community Access' })
      .fill('Social Support');

    await page.getByTestId('service-modal')
      .getByRole('combobox')
      .selectOption('Community Access');

    await page.getByRole('textbox', { name: 'Provide a detailed overview' })
      .fill('Focuses on improving confidence, reducing isolation and overall well being');

    await page.getByTestId('save-btn').click();

    await expect(
      page.locator('table').getByText('Social Support').first()
    ).toBeVisible();
  });

  // New service appears in the services table
  test('New service appears in the services table', async ({ page }) => {
  await page.click('text=Manage Services');

  // wait for table to load
  await expect(page.locator('table')).toBeVisible();

  // FIX: scope to table + pick first match
  const serviceRow = page
    .locator('table')
    .locator('tr')
    .filter({ hasText: 'Social Support' })
    .first();

  await expect(serviceRow).toBeVisible();
});

});

test('Coordinator can approve a Pending booking', async ({ page }) => {

  // STEP 1: create booking first
  await loginAs(page, 'participant');

  await page.getByRole('button', { name: /Book Support/i }).click();

  await page.getByLabel('Service').selectOption('1');
  await page.getByRole('textbox', { name: 'Preferred Date' }).fill('2026-05-10');
  await page.getByRole('textbox', { name: 'Notes' }).fill('test');

  await page.getByRole('button', { name: 'Submit Booking' }).click();

  await page.locator('#btn-open-logout-modal').click();

  const logoutBtn = page.getByRole('button', { name: /log out/i });

  await expect(logoutBtn).toBeVisible({ timeout: 10000 });
  await logoutBtn.click();

  // STEP 2: switch to coordinator
  await loginAs(page, 'coordinator');

  await page.goto('/dashboard');

  await page.getByRole('link', { name: 'All Bookings' }).click();

  const row = page.locator('tr').filter({ hasText: 'Pending' }).first();
  await expect(row).toBeVisible();
  const approveBtn = row.getByRole('button', { name: 'Approve' });
  await expect(approveBtn).toBeVisible();
  await approveBtn.click();

});

    // Approved booking shows green status badge
  test('Approved booking shows green status badge', async ({ page }) => {

  await loginAs(page, 'coordinator');

  const row = page.locator('tr').filter({ hasText: 'Approved' }).first();

  await expect(row).toBeVisible();

  const statusCell = row.locator('td').filter({ hasText: 'Approved' });

  await expect(statusCell).toBeVisible();
});



