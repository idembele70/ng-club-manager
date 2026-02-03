import { expect, Locator, Page } from "@playwright/test";
import { buildAppFrontUrl, FRONT_URLS_REGEX } from "@shared/utilities/url-front.utility";
import { Player, PlayerRole } from '@libs/domain/models/player.model';
import { ZardDialogComponent } from "@shared/components/zard-dialog-component";

export class MarketPage {
  private readonly urlRegex = FRONT_URLS_REGEX.MARKET;
  private readonly container: Locator;
  private readonly players: Locator;

  readonly confirmPurchaseDialogComponent: ZardDialogComponent;
  readonly purchaseSuccessDialogComponent: ZardDialogComponent;

  constructor(private readonly page: Page) {
    this.container = this.page.locator('app-market-player-card-list')
    this.players = this.container.locator('app-player-card');
    this.confirmPurchaseDialogComponent = new ZardDialogComponent(this.page, 'Veuillez Confirmer votre achat');
    this.purchaseSuccessDialogComponent = new ZardDialogComponent(this.page, 'Achat Réussi');
  }

  async goto(): Promise<void> {
    await this.page.goto(buildAppFrontUrl('market'));
  }

  getPlayerAt(index: number): Locator {
    return this.players.nth(index);
  }

  async getPlayerInfoAt(index: number): Promise<Omit<Player, 'id' | 'abbreviation' | 'avatarUrl' | 'clubId' | 'price'> & { priceInMillions: string }> {
    const player = this.getPlayerAt(index);

    const nationality = await player.getByTestId('nationality').innerText();
    const role = await player.getByTestId('role').innerText() as PlayerRole;
    const rating = await player.getByTestId('rating').innerText();
    const fullName = await player.getByTestId('full-name').innerText();
    const age = await player.getByTestId('age').innerText();
    const price = await player.getByTestId('price').innerText();
    const pace = await player.getByTestId('pace').innerText();
    const passing = await player.getByTestId('passing').innerText();
    const physical = await player.getByTestId('physical').innerText();
    const shooting = await player.getByTestId('shooting').innerText();
    const defending = await player.getByTestId('defending').innerText();

    return {
      nationality: nationality,
      rating: this.extractNumberFromText(rating),
      role,
      fullName,
      age: this.extractNumberFromText(age),
      priceInMillions: price.split(' ').at(-1) as string,
      stats: {
        pace: this.extractNumberFromText(pace),
        passing: this.extractNumberFromText(passing),
        physical: this.extractNumberFromText(physical),
        shooting: this.extractNumberFromText(shooting),
        defending: this.extractNumberFromText(defending),
      },
    };
  }

  async openPurchaseConfirmAt(index: number): Promise<void> {
    await this.getPlayerAt(index)
      .getByRole('button', { name: 'Acheter' })
      .click();
  }

  async expectConfirmPurchaseDialogVisible(fullName: string, priceInMillions: string): Promise<void> {
    await this.confirmPurchaseDialogComponent.expectVisible();
    await this.confirmPurchaseDialogComponent.expectContentText(`Souhaitez-vous acheter ${fullName} pour ${priceInMillions}`);
    await expect(this.confirmPurchaseDialogComponent.cancelButton).toBeVisible();
    await expect(this.confirmPurchaseDialogComponent.submitButton).toBeVisible();
  }

  async confirmPurchase(): Promise<void> {
    await this.confirmPurchaseDialogComponent.submitButton.click();
  }

  async expectPurchaseSuccess(fullName: string, priceInMillions: string): Promise<void> {
    await this.purchaseSuccessDialogComponent.expectVisible();
    await this.purchaseSuccessDialogComponent.expectContentText(new RegExp(`${fullName} à rejoins le (.*) pour la somme de ${priceInMillions}`));
  }

  private extractNumberFromText(text: string): number {
    const match = text.match(/\d+/);
    return match?.length ? Number(match[0]) : 0;
  };
}