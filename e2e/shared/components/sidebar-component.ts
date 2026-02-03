import { expect, Locator, Page } from "@playwright/test";

export class SidebarComponent {
  private readonly container: Locator;
  readonly logo: Locator;
  readonly dashboardLink: Locator;
  readonly marketLink: Locator;

  constructor(private readonly page: Page) {
    this.container = this.page.locator('z-sidebar');
    this.logo = this.container.getByText('NG CLUB MANAGER', { exact: true });
    this.dashboardLink = this.container.getByRole('button', { name: 'Dashboard', exact: true })
    this.marketLink = this.container.getByRole('button', { name: 'Marché des Transferts', exact: true })
  }

  async expectVisible(): Promise<void> {
    await expect(this.logo).toBeVisible();
    await expect(this.dashboardLink).toBeVisible();
    await expect(this.marketLink).toBeVisible();
  };
}