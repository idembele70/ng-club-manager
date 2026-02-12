import { PlayerRole } from "@libs/domain/models/player.model";
import { authTest } from "@shared/auth-fixture";
import { MarketPage } from "../market-page";
import { MarketFilter } from "../market-filter.model";
import { DashboardPage } from "features/club/dashboard-page";

authTest.describe('Market Players - Filters', () => {
  let marketPage: MarketPage;
  authTest.beforeEach(async ({ page }) => {
    marketPage = new MarketPage(page);
  });

  authTest.describe('UI-based filtering', () => {
    authTest.beforeEach(async () => {
      await marketPage.goto();
    });

    authTest("should filter using 'GK' role", async () => {
      const role: PlayerRole = 'GK'
      await marketPage.applyFilters({ role });
      await marketPage.expectFiltersResultToMatch({ role });
    });

    authTest('should filter with rate set to 52', async () => {
      const rate = 52;
      await marketPage.applyFilters({ rate });
      await marketPage.expectFiltersResultToMatch({ rate });
    });

    authTest("should filter with nationality set to 'France'", async () => {
      const nationality = 'France';
      await marketPage.applyFilters({ nationality });
      await marketPage.expectFiltersResultToMatch({ nationality });
    });

    authTest('should set all filters', async () => {
      const filters: MarketFilter = {
        role: 'ATT',
        nationality: 'Spain',
        rate: 52,
      };
      await marketPage.applyFilters(filters);
      await marketPage.expectFiltersResultToMatch(filters);
    });
  })

  authTest.describe('URL-based filtering (redirection)', () => {
    let dashboardPage: DashboardPage;

    authTest.beforeEach(async ({ page }) => {
      dashboardPage = new DashboardPage(page);
      await dashboardPage.goto();
    })

    authTest("should redirect to market with role set to 'GK'", async ({ page }) => {
      const role: PlayerRole = 'GK';
      await dashboardPage.getPurchaseLink(role).click();
      await marketPage.expectToBeOnPage();
      marketPage.expectQueryParams({ role });
      await marketPage.expectFiltersResultToMatch({ role })
    });
    authTest("should redirect to market with role set to 'ATT'", async () => {
      const role: PlayerRole = 'ATT';
      await dashboardPage.getPurchaseLink(role).click();
      await marketPage.expectToBeOnPage();
      marketPage.expectQueryParams({ role });
      await marketPage.expectFiltersResultToMatch({ role })
    });
    authTest("should redirect to market with role set to 'DEF'", async () => {
      const role: PlayerRole = 'DEF';
      await dashboardPage.getPurchaseLink(role).click();
      await marketPage.expectToBeOnPage();
      marketPage.expectQueryParams({ role });
      await marketPage.expectFiltersResultToMatch({ role })
    });
    authTest("should redirect to market with role set to 'MID'", async () => {
      const role: PlayerRole = 'MID';
      await dashboardPage.getPurchaseLink(role).click();
      await marketPage.expectToBeOnPage();
      marketPage.expectQueryParams({ role });
      await marketPage.expectFiltersResultToMatch({ role })
    });
  })
})