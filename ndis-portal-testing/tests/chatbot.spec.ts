import { test, expect } from '@playwright/test';
import { loginAs } from './helpers/auth.helper';

test.describe('Chatbot', () => {

  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'participant');
      });

    // 1. Chat button is visible after login
    test('Chat button is visible after login', async ({ page }) => {
    await expect(page.getByRole('img', { name: 'Chatbot Support' })).toBeVisible();
    });

    // 2. Chat panel opens when button is clicked
    test('Chat panel opens when button is clicked', async ({ page }) => {
    await page.getByRole('img', { name: 'Chatbot Support' }).click();

    await expect(page.getByRole('textbox', { name: 'Type a message...' })).toBeVisible();
    });

    // 3. Sending a message shows a response within 8 seconds
    test('Sending a message shows a response within 8 seconds', async ({ page }) => {
    const input = page.getByRole('textbox', { name: 'Type a message...' });
    const sendBtn = page.locator('#btn-chatbot-send');
    const messages = page.getByTestId('chat-message');
  });


  // 4. Input clears after message is sent
  test('Input clears after message is sent', async ({ page }) => {
    await page.getByRole('img', { name: 'Chatbot Support' }).click();

    const input = page.getByRole('textbox', { name: 'Type a message...' });
    await input.fill('Test message');

    await page.locator('#btn-chatbot-send').click();

    await expect(input).toHaveValue('');
    });

    // 5. Sending with empty input does not trigger an API call
    test('Sending with empty input does not trigger an API call', async ({ page }) => {
    await page.getByRole('img', { name: 'Chatbot Support' }).click();

    const input = page.getByRole('textbox', { name: 'Type a message...' });
    await input.fill('');

    const [request] = await Promise.all([
      page.waitForRequest(req => req.url().includes('/chat'), { timeout: 1000 }).catch(() => null),
      await page.locator('#btn-chatbot-send').click()
    ]);

    expect(request).toBeNull();
  });

});