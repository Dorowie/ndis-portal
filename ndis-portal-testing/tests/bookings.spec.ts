import { test, expect } from '@playwright/test';
import {loginAs} from './helpers/auth.helper'; 

test.describe('Bookings - Participant', () => {

  test.beforeEach(async ({ page }) => {
  await loginAs(page, 'participant');

  // remove chatbot completely for tests
  await page.addInitScript(() => {
    const removeChatbot = () => {
      document.querySelector('#chatbot-tooltip')?.remove();
      document.querySelector('#app-chatbot-component')?.remove();
    };

    removeChatbot();

    // keep removing if it reappears
    new MutationObserver(removeChatbot)
      .observe(document.body, { childList: true, subtree: true });
  });
});

  // Participant submits a booking and sees Pending status
  test('Participant submits a booking and sees Pending status', async ({ page }) => {
  await page.getByRole('button', { name: 'Book Support' }).click();

  await page.getByLabel('Service').selectOption('1');
  await page.getByRole('textbox', { name: 'Preferred Date' }).fill('2026-05-08');
  await page.getByRole('textbox', { name: 'Notes' }).fill('testing');

  await page.getByRole('button', { name: 'Submit Booking' }).click();

  // wait for table update
  const row = page.locator('tr').filter({ hasText: 'testing' }).first();

  await expect(row).toBeVisible();

  // check status inside that row
  await expect(row).toContainText('Pending');
});



  // Booking form shows error when date is in the past
  test('Booking form shows error when date is in the past', async ({ page }) => {
    await page.getByRole('button', { name: 'Book Support' }).click();

    await page.getByLabel('Service').selectOption('2');
    await page.getByRole('textbox', { name: 'Preferred Date' }).fill('2025-02-02');

    await expect(page.getByText(/Preferred date must not be in/i)).toBeVisible();
  });



  // Booking form shows error when service is not selected
test('Booking button is disabled when no service is selected', async ({ page }) => {
  await page.getByRole('button', { name: 'Book Support' }).click();

  const submitButton = page.getByRole('button', { name: 'Submit Booking' });

  await expect(submitButton).toBeDisabled();
});


  // Participant can cancel a Pending booking
  test('Participant can cancel a Pending booking', async ({ page }) => {

  await page.getByRole('link', { name: 'My Booking' }).click();
  const row = page.locator('tr').filter({ hasText: 'Pending' }).first();
  await expect(row).toBeVisible();

  const cancelBtn = row.getByRole('button', { name: 'Cancel' });
  await expect(cancelBtn).toBeVisible();
  await cancelBtn.click();

  await expect(page.getByText(/are you sure/i)).toBeVisible();
  await page.getByRole('button', { name: /confirm cancel/i }).click();

  await page.waitForLoadState('networkidle');

  await expect(page.locator('.status-badge.status-cancelled').first()).toBeVisible();
});


  
  // Cancel confirmation dialog appears before cancelling
  test('Cancel confirmation dialog appears before cancelling', async ({ page }) => {
    await page.getByRole('link', { name: 'My Booking' }).click();

    // find a valid row
    const row = page.locator('tr').filter({ hasText: 'Pending' }).first();
    await expect(row).toBeVisible();

    // click cancel inside THAT row
    await row.getByRole('button', { name: 'Cancel' }).click();

    // now modal should appear
    await expect(
    page.getByRole('button', { name: 'Confirm Cancel' })
    ).toBeVisible();
        });

});

test.describe('Bookings - Participant New', () => {
  test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:4200/login');

  // stable selectors (NOT role-based guessing)
  await page.locator('input[type="email"]').fill('participant_new@example.com');
  await page.locator('input[type="password"]').fill('pass1234');

  await page.getByRole('button', { name: /login/i }).click();
  await page.waitForLoadState('networkidle');

    // confirm login success by UI, not URL
    await expect(page.getByRole('link', { name: 'My Booking' })).toBeVisible();
});

   // Participant sees empty state when no bookings exist
    test('Participant sees empty state when no bookings exist', async ({ page }) => {
        await page.getByRole('link', { name: 'My Booking' }).click();
        await expect(page.getByText('No bookings foundThere are no')).toBeVisible();    
});

});