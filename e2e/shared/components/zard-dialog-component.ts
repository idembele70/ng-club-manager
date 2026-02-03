import { Locator, Page, expect } from "@playwright/test";


export class ZardDialogComponent {

  readonly container: Locator;
  readonly title: Locator;
  readonly content: Locator;
  readonly cancelButton: Locator;
  readonly submitButton: Locator;

  constructor(
    private readonly page: Page,
    private readonly headingText: string,
  ) {
    this.container = this.page.locator('z-dialog').filter({
      has: this.page.getByRole('heading', { name: this.headingText }),
    });
    this.title = this.container.getByRole('heading');
    this.content = this.container.getByTestId('z-content');
    this.cancelButton = this.container.getByRole('button', { name: 'Annulez', exact: true });
    this.submitButton = this.container.getByRole('button', { name: 'Achetez', exact: false });
  }

  async expectVisible(): Promise<void> {
    await expect(this.container).toBeVisible();
  }

  async expectContentText(expectedText: string | RegExp): Promise<void> {
    await expect(this.content).toHaveText(expectedText);
  }
}
