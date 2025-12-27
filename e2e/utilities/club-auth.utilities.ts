import { Page } from "@playwright/test";

export class ClubAuthUtilities {
  static async register(page: Page, clubName: string, managerName: string, password: string): Promise<void> {
    await page.goto('club/create');
    await page.locator('input#clubName').fill(clubName);
    await page.locator('input#managerName').fill(managerName);
    await page.locator('input#password').fill(password);
    await page.locator('input#confirmPassword').fill(password);
    await page.locator('button[type="submit"]').click();
  }

  static async login(page: Page, managerOrClubName: string, password: string): Promise<void> {
    await page.locator('input#managerOrClubName').fill(managerOrClubName);
    await page.locator('input#password').fill(password);
    await page.locator('button[type="submit"]').click();
  }
}