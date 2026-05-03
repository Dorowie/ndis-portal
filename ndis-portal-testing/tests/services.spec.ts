import { test, expect } from '@playwright/test';
import { loginAs } from './helpers/auth.helper';

test.describe('Services - Participant', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'participant');
  });

  // Services list loads with cards after login - Participant
  test('Services list loads with cards after login', async ({ page }) => {
    await expect(page.locator('#router-content-area')).toBeVisible();
  });


  //Category filter shows only matching services - Participant
  test('Category filter shows only matching services - Participant', async ({ page }) => {

    await page.getByRole('button', { name: 'Daily Personal Activities' }).click();
    await expect(page.getByRole('heading', { name: 'Personal Hygiene Assistance' }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Meal Preparation Support' }).first()).toBeVisible();
  
    await page.getByRole('button', { name: 'Community Access' }).click();
    await expect(page.getByRole('heading', { name: 'Community Participation' }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Social Skills Group' }).first()).toBeVisible();

    await page.getByRole('button', { name: 'Therapy Supports' }).click();
    await expect(page.getByRole('heading', { name: 'Occupational Therapy' }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Speech Therapy' }).first()).toBeVisible();

    await page.getByRole('button', { name: 'Respite Care' }).click();
    await expect(page.getByRole('heading', { name: 'Short Term Respite' }).first()).toBeVisible();

    await page.getByRole('button', { name: 'Support Coordination' }).click();
    await expect(page.getByRole('heading', { name: 'Plan Management & Coordination' })).toBeVisible();

  });


  // Clicking "All" resets the filter - Participant
  test('Clicking "All" resets the filter', async ({ page }) => {
    await page.getByRole('button', { name: 'All' }).click();
    await expect(page.getByTestId('service-card').first()).toBeVisible();
  });


  // Participant does not see Add Service button - Participant
  test('Participant does not see Add Service button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Add Service' })).not.toBeVisible();
  });


});


test.describe('Services - Coordinator', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'coordinator');
   });

    
     
    //  Coordinator sees Add Service button - Coordinator
    test('Coordinator sees Add Service button', async ({ page }) => {
    

    await page.getByRole('link', { name: 'Manage Services' }).click();
    await page.getByTestId('add-service-btn').click();
    await page.getByText('Add New ServiceConfigure a').click();
  });
  

  });