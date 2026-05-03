import { Page, expect } from '@playwright/test';

type Role = 'participant' | 'coordinator';

export async function loginAs(page: Page, role: Role) {
  const credentials: Record<Role, { email: string; password: string }> = {
    participant: {
      email: 'participant1@ndisportal.com',
      password: 'Test@1234'
    },
    coordinator: {
      email: 'coordinator@ndisportal.com',
      password: 'Test@1234'
    }
  };

  await page.goto('/login');

  const email = page.locator('input[type="email"], input[name="email"], input#email');
  const password = page.locator('input[type="password"], input[name="password"], input#password');
  const loginBtn = page.locator('button[type="submit"], button:has-text("Login")');

  await expect(email).toBeVisible();
  await expect(password).toBeVisible();
  await expect(loginBtn).toBeVisible();

  await email.fill(credentials[role].email);
  await password.fill(credentials[role].password);

  await loginBtn.click();


  await page.waitForLoadState('networkidle');


  await expect(page).toHaveURL(/dashboard|services/);
}