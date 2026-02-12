import { expect, Locator, Page } from "@playwright/test";
import { buildAppFrontUrl, FRONT_URLS_REGEX } from "@shared/utilities/url-front-utility";
import { Player, PlayerRole } from '@libs/domain/models/player.model';
import { ZardDialogComponent } from "@shared/components/zard-dialog-component";
import { customExpect } from "@shared/fixtures/custom-expect-fixture";
import { StringUtility } from "@shared/utilities/string-utility";
import { MarketFilter } from "./market-filter.model";
import { ENV_CONFIG, ENV } from "@config/env.config";

export class MarketPage {
  private readonly urlRegex = FRONT_URLS_REGEX.MARKET;
  private readonly container: Locator;

  readonly roleDropdown: Locator;
  readonly rateSlider: Locator;
  readonly nationalityDropdown: Locator;
  readonly dropDownOption: Locator;
  readonly searchButton: Locator;

  private readonly players: Locator;

  readonly confirmPurchaseDialogComponent: ZardDialogComponent;
  readonly purchaseSuccessDialogComponent: ZardDialogComponent;

  constructor(private readonly page: Page) {
    this.container = this.page.locator('app-market-player-card-list')

    this.roleDropdown = this.page.getByRole('button').filter({ hasText: 'Poste' });
    this.rateSlider = this.page.getByRole('slider');
    this.nationalityDropdown = this.page.getByRole('button').filter({ hasText: 'Nationalité' });
    this.dropDownOption = this.page.locator('z-command-option');
    this.searchButton = this.page.getByRole('button', { name: 'Rechercher' });

    this.players = this.container.locator('app-player-card');

    this.confirmPurchaseDialogComponent = new ZardDialogComponent(this.page, 'Veuillez Confirmer votre achat');
    this.purchaseSuccessDialogComponent = new ZardDialogComponent(this.page, 'Achat Réussi');
  }

  async goto(): Promise<void> {
    await this.page.goto(buildAppFrontUrl('market'));
  }

  async expectToBeOnPage(options?: { exact: boolean }): Promise<void> {
    if (options?.exact)
      await expect(this.page).toHaveURL(this.urlRegex);
    else
      await expect(this.page).toHaveURL(/market/);
  }

  async expectQueryParams(params: MarketFilter): Promise<void> {
    await expect(this.page).toHaveURL(url => {
      const queryString = url.toString().split('?')[1];
      const searchParams = new URLSearchParams(queryString);
      const result = Object.entries(params).every(([key, value]) => {
        return searchParams.get(key) === String(value)
      });
      return result
    })
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
      rating: StringUtility.extractNumberFromText(rating),
      role,
      fullName,
      age: StringUtility.extractNumberFromText(age),
      priceInMillions: price.split(' ').at(-1) as string,
      stats: {
        pace: StringUtility.extractNumberFromText(pace),
        passing: StringUtility.extractNumberFromText(passing),
        physical: StringUtility.extractNumberFromText(physical),
        shooting: StringUtility.extractNumberFromText(shooting),
        defending: StringUtility.extractNumberFromText(defending),
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
    await this.purchaseSuccessDialogComponent.expectContentText(new RegExp(`${fullName} a rejoint le (.*) pour la somme de ${priceInMillions}`));
  }

  async getFiltersRateValue(): Promise<number> {
    const currentRateLabel = await this.page.getByTestId('rate-filter-label').innerText();
    return StringUtility.extractNumberFromText(currentRateLabel);
  }

  async applyFilters(filter: MarketFilter): Promise<void> {
    if (filter.role) {
      await this.roleDropdown.click()
      await this.dropDownOption.filter({ hasText: filter.role }).click();
    }
    if (filter.rate) {
      while (true) {
        if (await this.getFiltersRateValue() === filter.rate)
          break;
        await this.rateSlider.press('ArrowRight');
      }
    }
    if (filter.nationality) {
      this.nationalityDropdown.click();
      await this.dropDownOption.filter({ hasText: filter.nationality }).click();
    }
    await this.searchButton.click();
  }

  async expectFiltersResultToMatch(filter: MarketFilter): Promise<void> {
    const playerCount = await this.players.count();
    if (filter.role) {
      await expect(
        this.players
          .getByTestId('role')
          .filter({ hasText: new RegExp(`^${filter.role}$`) })
      ).toHaveCount(playerCount);
    }
    if (filter.rate) {
      for (let i = 0; i < playerCount; i++) {
        await customExpect(this.players.nth(i)).toHaveMinimumRate(filter.rate)
      }
      if (filter.nationality) {
        await expect(
          this.players
            .getByTestId('nationality')
            .filter({ hasText: new RegExp(`^${filter.nationality}$`) })
        ).toHaveCount(playerCount);
      }
    }
  }
}