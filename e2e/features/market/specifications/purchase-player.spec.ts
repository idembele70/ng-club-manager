import { authTest } from '@shared/auth-fixture';
import { MarketPage } from '../market-page';

authTest.describe('Market Players - Purchase', () => {
  authTest.beforeEach( async({ page }) => {
    const marketPage = new MarketPage(page);
    await marketPage.goto();
  });

  authTest('should show success modal when purchase succeed', async ({ page }) => {
    const marketPage = new MarketPage(page);
    await marketPage.openPurchaseConfirmAt(0);
    const playerInfo = await marketPage.getPlayerInfoAt(0);
    await marketPage.confirmPurchase();
    await marketPage.expectPurchaseSuccess(playerInfo.fullName, playerInfo.priceInMillions);
  });
});