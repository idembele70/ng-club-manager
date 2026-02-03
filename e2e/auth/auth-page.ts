import { ENV_CONFIG, ENV } from "@config/env.config";
import { LoginPayload } from "@libs/domain/models/login-payload.model";
import { RegisterPayload } from "@libs/domain/models/register-payload.model";
import { Locator, Page, expect } from "@playwright/test";
import { SidebarComponent } from "@shared/components/sidebar-component";
import { buildAppFrontUrl, FRONT_URLS_REGEX } from "@shared/utilities/url-front.utility";

export class AuthPage {

  private readonly sidebar: SidebarComponent;

  // Register
  private readonly registerPageURL = FRONT_URLS_REGEX.REGISTER;
  readonly registerContainer: Locator;
  readonly clubNameInput: Locator;
  readonly managerNameInput: Locator;
  readonly registerPasswordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly registerSubmitButton: Locator;
  readonly loginPageLink: Locator;

  // Login
  private readonly loginPageURL = FRONT_URLS_REGEX.LOGIN;
  readonly loginContainer: Locator;
  readonly managerOrClubNameInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginSubmitButton: Locator;
  readonly registerPageLink: Locator;

  constructor(private readonly page: Page) {
    this.sidebar = new SidebarComponent(this.page);

    // Register
    this.registerContainer = this.page.locator('app-register');
    this.clubNameInput = this.registerContainer.getByLabel('Nom du club', { exact: true });
    this.managerNameInput = this.registerContainer.getByLabel('Nom du manager', { exact: true });
    this.registerPasswordInput = this.registerContainer.getByLabel('Mot de passe', { exact: true });
    this.confirmPasswordInput = this.registerContainer.getByLabel('Confirmer le mot de passe', { exact: true });
    this.registerSubmitButton = this.registerContainer.getByRole('button', { name: 'Crée le club', exact: true });
    this.loginPageLink = this.registerContainer.getByRole('button', { name: 'Se connecter', exact: true });
    
    // Login
    this.loginContainer = this.page.locator('app-login');
    this.managerOrClubNameInput = this.page.getByLabel('Nom du club ou du manager', { exact: true });
    this.loginPasswordInput = this.page.getByLabel('Entrez le mot de passe', { exact: true });
    this.loginSubmitButton = this.loginContainer.getByRole('button', { name: 'Se connecter', exact: true });
    this.registerPageLink = this.loginContainer.getByRole('button', { name: 'Créer un club', exact: true });
  }

  async gotoRegisterPage(): Promise<void> {
    await this.page.goto(buildAppFrontUrl('register'));
  }

  async gotoLoginPage(): Promise<void> {
    await this.page.goto(buildAppFrontUrl('login'));
  }

  async fillRegisterForm(payload: RegisterPayload): Promise<void> {
    await this.clubNameInput.fill(payload.clubName);
    await this.managerNameInput.fill(payload.managerName);
    await this.registerPasswordInput.fill(payload.password);
    await this.confirmPasswordInput.fill(payload.password);
  }

  async register(payload: RegisterPayload): Promise<void> {
    await this.fillRegisterForm(payload);
    await this.registerSubmitButton.click();
  }

  async fillLoginForm(payload: LoginPayload): Promise<void> {
    await this.managerOrClubNameInput.fill(payload.managerOrClubName);
    await this.loginPasswordInput.fill(payload.password);
  }

  async login(payload: LoginPayload): Promise<void> {
    await this.fillLoginForm(payload);
    await this.loginSubmitButton.click();
  }

  async expectRegisterSuccess(): Promise<void> {
    await expect(this.page).toHaveURL(this.loginPageURL);
  }
  async expectLoginSuccess(): Promise<void> {
    await expect(this.page).toHaveURL(FRONT_URLS_REGEX.DASHBOARD);
    await this.sidebar.expectVisible();
  }
}