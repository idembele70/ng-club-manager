import { test, expect } from '@playwright/test';
import { ClubAuthUtilities } from './utilities/club-auth.utilities';

test.describe('Authentication', () => {
  const PASSWORD = 'P@ssw0rd123!';
  test('should create a new club', async ({ page }) => {
    const clubName = 'FC Barcelone';
    const managerName = 'Pep Guardiola';
    await ClubAuthUtilities.register(page, clubName, managerName, PASSWORD);
    await expect(page).toHaveURL('/club/login');
  });
  test('should login to a club using club name', async ({ page}) => {
    const clubName = 'FC Porto'
    const managerName = 'Mourinho';
    await ClubAuthUtilities.register(page, clubName, managerName, PASSWORD);
    await ClubAuthUtilities.login(page, clubName, PASSWORD);
    await expect(page).toHaveURL('club/dashboard');
  });
  test('should login to a club using manager name', async ({ page}) => {
    const clubName = 'Aston Villa'
    const managerName = 'Unai Emery';
    await ClubAuthUtilities.register(page, clubName, managerName, PASSWORD);
    await ClubAuthUtilities.login(page, managerName, PASSWORD);
    await expect(page).toHaveURL('club/dashboard');
  });
});

