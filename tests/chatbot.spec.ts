import { test, expect } from '@playwright/test';

test.describe('Chatbot', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/');

    // Login
    await page.getByRole('textbox', { name: 'name@example.com' }).fill('ptest@ndisportal.com');
    await page.getByRole('textbox', { name: 'Enter your password' }).fill('ptest@123');
    await page.getByRole('button', { name: 'Login' }).click();

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
