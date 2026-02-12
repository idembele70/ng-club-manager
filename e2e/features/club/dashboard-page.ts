import { PlayerRole } from "@libs/domain/models/player.model";
import { Locator, Page } from "@playwright/test";
import { buildAppFrontUrl, FRONT_URLS_REGEX } from "@shared/utilities/url-front-utility";

export class DashboardPage {
  private readonly urlRegex = FRONT_URLS_REGEX.DASHBOARD;
  private readonly container: Locator;

  constructor(private readonly page: Page) {
    this.container = this.page.locator('app-dashboard');

  }

  async goto(): Promise<void> {
    await this.page.goto(buildAppFrontUrl('dashboard'));
  }

  getPurchaseLink(role: PlayerRole): Locator {
    return this.page.getByTestId(`purchase-${role}`);
  }
}