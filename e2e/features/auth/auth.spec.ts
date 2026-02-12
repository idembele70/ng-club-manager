import { test, expect } from '@playwright/test';
import { AuthPage } from './auth-page';

test.describe('Authentication', () => {
  const PASSWORD = 'P@ssw0rd123!';
  test('should create a new club', async ({ page }) => {
    const clubName = 'FC Barcelone';
    const managerName = 'Pep Guardiola';
    const authPage = new AuthPage(page);
    await authPage.gotoRegisterPage();
    await authPage.register({ clubName, managerName, password: PASSWORD });
    await authPage.expectRegisterSuccess();
  });
  test('should login to a club using club name', async ({ page }) => {
    const clubName = 'FC Porto';
    const managerName = 'Mourinho';
    const authPage = new AuthPage(page);
    await authPage.gotoRegisterPage();
    await authPage.register({ clubName, managerName, password: PASSWORD });
    await authPage.expectRegisterSuccess();
    await authPage.gotoLoginPage();
    await authPage.login({ managerOrClubName: clubName, password: PASSWORD });
    await authPage.expectLoginSuccess();
  });
  test('should login to a club using manager name', async ({ page }) => {
    const clubName = 'Aston Villa';
    const managerName = 'Unai Emery';
    const authPage = new AuthPage(page);
    await authPage.gotoRegisterPage();
    await authPage.register({ clubName, managerName, password: PASSWORD });
    await authPage.expectRegisterSuccess();
    await authPage.gotoLoginPage();
    await authPage.login({ managerOrClubName: managerName, password: PASSWORD });
    await authPage.expectLoginSuccess();
  });
});
