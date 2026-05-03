import { test, expect } from '@playwright/test';
import {loginAs} from './helpers/auth.helper'; 

const BASE_URL = 'http://localhost:4200';


  // 1. Register new participant successfully
  test('Register new participant successfully', async ({ page }) => {
    await page.goto(`${BASE_URL}/login?returnUrl=%2Fdashboard`);

    await expect(page.getByRole('link', { name: 'Register Here!' })).toBeVisible();
    await page.getByRole('link', { name: 'Register Here!' }).click();

    await expect(page.getByRole('textbox', { name: 'First Name' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Last Name' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Email Address' })).toBeVisible();
    await expect(page.getByLabel('Role')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'By checking this, you agree' })).toBeVisible();

    await page.getByRole('textbox', { name: 'First Name' }).fill('Alison');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Smith');
    await page.getByRole('textbox', { name: 'Email Address' }).fill('participant_new@example.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('pass1234');

    await page.getByRole('checkbox', { name: 'By checking this, you agree' }).check();

    await page.getByRole('button', { name: 'Register →' }).click();

    page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
  
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Register →' }).click();
  });



  // 2. Register new coordinator successfully
  test('Register new coordinator successfully', async ({ page }) => {
    await page.goto(`${BASE_URL}/login?returnUrl=%2Fdashboard`);
await expect(page.getByRole('link', { name: 'Register Here!' })).toBeVisible();
await page.getByRole('link', { name: 'Register Here!' }).click();


await expect(page.getByRole('textbox', { name: 'First Name' })).toBeVisible();
await expect(page.getByRole('textbox', { name: 'Last Name' })).toBeVisible();
await expect(page.getByRole('textbox', { name: 'Email Address' })).toBeVisible();
await expect(page.getByLabel('Role')).toBeVisible();
await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
await expect(page.getByRole('checkbox', { name: 'By checking this, you agree' })).toBeVisible();


await page.getByRole('textbox', { name: 'First Name' }).fill('John');
await page.getByRole('textbox', { name: 'Last Name' }).fill('Doe');
await page.getByRole('textbox', { name: 'Email Address' }).fill('coordinator_new@example.com');
await page.getByLabel('Role').selectOption('Coordinator');
await page.getByRole('textbox', { name: 'Password' }).fill('pass1234');


await page.getByRole('checkbox', { name: 'By checking this, you agree' }).check();

await page.getByRole('button', { name: 'Register →' }).click();
page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
  
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Register →' }).click();
  });



  // 3. Duplicate email validation
test('Show validation error on duplicate email', async ({ page }) => {
  await page.goto(`${BASE_URL}/login?returnUrl=%2Fdashboard`);

  await page.getByRole('link', { name: 'Register Here!' }).click();

  
  await page.getByRole('textbox', { name: 'First Name' }).fill('John');
  await page.getByRole('textbox', { name: 'Last Name' }).fill('Doe');

 
  await page.getByRole('textbox', { name: 'Email Address' }).fill('coordinator_new@example.com');

  await page.getByLabel('Role').selectOption('Coordinator');

  await page.getByRole('textbox', { name: 'Password' }).fill('pass1234');

  await page.getByRole('checkbox', {
    name: 'By checking this, you agree'
  }).check();

  
  page.once('dialog', async dialog => {
    expect(dialog.message()).toContain('already');
    await dialog.dismiss();
  });

  await page.getByRole('button', { name: 'Register →' }).click();
});

  // 4. Login with valid participant account
test('Login successfully with valid participant account', async ({ page }) => {
  await loginAs(page, 'participant');
});



  // 5. Login with valid coordinator account
test('Login successfully with valid coordinator account', async ({ page }) => {
  await loginAs(page, 'coordinator');
});

  // 6. Unauthorized access
test('Redirect to /login when accessing /services without token', async ({ page }) => {
  await page.goto('http://localhost:4200/services');

 
  await expect(page).toHaveURL(/login/);

  await expect(page.getByRole('button', { name: 'Login →' })).toBeVisible();
});

// 7. Wrong email for participant
test('Login fails with wrong email for participant', async ({ page }) => {
  await page.goto(`${BASE_URL}/login?returnUrl=%2Fservices`);

  await page.getByRole('textbox', { name: 'name@example.com' })
    .fill('invalid_participant@example.com');

  await page.getByRole('textbox', { name: 'Enter your password' })
    .fill('pass1234');

  await page.getByRole('button', { name: 'Login →' }).click();

  const error = page.locator('text=/invalid|incorrect|failed/i');

  await expect(error).toBeVisible({ timeout: 10000 });
});

// 8. Wrong email for coordinator
test('Login fails with wrong email for coordinator', async ({ page }) => {
  await page.goto(`${BASE_URL}/login?returnUrl=%2Fservices`);

  await page.getByRole('textbox', {
    name: 'name@example.com'
  }).fill('invalid_coordinator@example.com');

  await page.getByRole('textbox', {
    name: 'Enter your password'
  }).fill('pass1234');

  await page.getByRole('button', { name: 'Login →' }).click();

  await expect(page.getByText(/invalid|incorrect|failed/i)).toBeVisible();
});



// 9. Wrong password for participant/coordinator
test('Login fails with wrong password for participant/coordinator', async ({ page }) => {
  await page.goto(`${BASE_URL}/login?returnUrl=%2Fservices`);

  await page.getByRole('textbox', {
    name: 'name@example.com'
  }).fill('coordinator_new@example.com');

  await page.getByRole('textbox', {
    name: 'Enter your password'
  }).fill('wrongpassword123');

  await page.getByRole('button', { name: 'Login →' }).click();

  await expect(page.getByText(/invalid|incorrect|failed|unauthorized/i)).toBeVisible();
});


// 10. SQL Injection attempt
test('Login should reject SQL injection attempt', async ({ page }) => {
  await page.goto(`${BASE_URL}/login?returnUrl=%2Fservices`);

  const sqlPayload = `' OR '1'='1`;

  await page.getByRole('textbox', { name: 'name@example.com' }).fill(sqlPayload);
  await page.getByRole('textbox', { name: 'Enter your password' }).fill(sqlPayload);

  const loginBtn = page.getByRole('button', { name: 'Login →' });


  await expect(loginBtn).toBeDisabled();
});