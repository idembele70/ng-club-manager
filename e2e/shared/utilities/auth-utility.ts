import { ENV, ENV_CONFIG } from "@config/env.config";
import { LoginPayload } from '@libs/domain/models/login-payload.model';
import { RegisterPayload } from '@libs/domain/models/register-payload.model';
import { Page } from "@playwright/test";

export class AuthUtilities {
  static async uiRegister(page: Page, payload: RegisterPayload): Promise<void> {
    await page.goto(ENV_CONFIG[ENV].baseURL.front + 'register');
    await page.locator('input#clubName').fill(payload.clubName);
    await page.locator('input#managerName').fill(payload.managerName);
    await page.locator('input#password').fill(payload.password);
    await page.locator('input#confirmPassword').fill(payload.password);
    await page.locator('button[type="submit"]').click();
  }

  static async uiLogin(page: Page, payload: LoginPayload): Promise<void> {
    await page.goto(ENV_CONFIG[ENV].baseURL.front + 'login');
    await page.locator('input#managerOrClubName').fill(payload.managerOrClubName);
    await page.locator('input#password').fill(payload.password);
    await page.locator('button[type="submit"]').click();
  }
}