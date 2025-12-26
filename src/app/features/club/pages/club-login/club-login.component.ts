import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardFormModule } from '@/shared/components/form/form.module';
import { ZardInputDirective } from '@/shared/components/input/input.directive';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { finalize, tap } from 'rxjs';
import { LoaderService } from '@/core/services/loader.service';
import { ClubLoginPayload } from '../../models/club.model';
import { ClubAuthService } from '../../services/club-auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-club-login',
  imports: [
    ZardFormModule,
    ZardInputDirective,
    TranslatePipe,
    ZardButtonComponent,
    ReactiveFormsModule,
    RouterLink,
  ],
  host: {
    'class': 'flex justify-center pt-4 px-2'
  },
  template: `
    <form class="w-sm space-y-6"
      [formGroup]="form"
      (ngSubmit)=login()>
      <z-form-field>
        <label z-form-label zRequired for="managerOrClubName">
          {{ 'LOGIN_CLUB_FORM.MANAGER_OR_CLUB_NAME.FORM_FIELD.LABEL' | translate }}
        </label>
        <z-form-control>
          <input z-input id="managerOrClubName"
            [placeholder]="'LOGIN_CLUB_FORM.MANAGER_OR_CLUB_NAME.FORM_FIELD.CONTROL.PLACEHOLDER' | translate"
            formControlName="managerOrClubName"/>
        </z-form-control>
      </z-form-field>
      <z-form-field>
        <label z-form-label zRequired for="password">
          {{ 'LOGIN_CLUB_FORM.PASSWORD.FORM_FIELD.LABEL' | translate }}
        </label>
        <z-form-control>
          <input z-input id="password"
            [placeholder]="'LOGIN_CLUB_FORM.PASSWORD.FORM_FIELD.CONTROL.PLACEHOLDER' | translate"
            formControlName="password"/>
          </z-form-control>
        </z-form-field>
        @if (errorMessageI18nKey()) {
          <z-form-message zType="error">{{ errorMessageI18nKey() | translate }}</z-form-message>
        }
        <div class="flex flex-col gap-2 mt-2">
          <button z-button
          z-type="default" type="submit"
          [zDisabled]="isSubmitBtnDisabled"
          [zLoading]="loaderService.isAuthenticating()"
          >
          {{ 'LOGIN_CLUB_FORM.BUTTON.LOGIN.LABEL' | translate }}
          </button>
          <button z-button z-type="default"
            type="button"
            [routerLink]="['../', 'create']"
            [zDisabled]="form.disabled">
            {{ 'LOGIN_CLUB_FORM.BUTTON.REGISTER.LABEL' | translate }}
          </button>
        </div>
    </form>
  `,
  styles: ``,
})
export class ClubLoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly clubAuthService = inject(ClubAuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private previousPayload: ClubLoginPayload | undefined = undefined;
  protected readonly loaderService = inject(LoaderService);
  protected readonly form = this.fb.nonNullable.group({
    managerOrClubName: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
  protected readonly errorMessageI18nKey = signal<Error['message'] | null>(null);

  get isSubmitBtnDisabled(): boolean {
    return this.form.invalid ||
      JSON.stringify(this.form.value) === JSON.stringify(this.previousPayload);
  }

  login() {
    if (this.form.invalid) {
      return;
    }
    this.errorMessageI18nKey.set(null);
    this.form.disable();
    this.loaderService.setIsAuthenticating(true);
    const payload = this.form.value as ClubLoginPayload;
    this.previousPayload = payload;
    this.clubAuthService.login(payload).pipe(
      tap({
        next: () => {
          void this.router.navigate(['../', 'dashboard'], {
            relativeTo: this.route,
          });
        },
        error: (err: Error) => {
          this.errorMessageI18nKey.set(err.message);
        },
      }),
      finalize(() => {
        this.loaderService.setIsAuthenticating(false);
        this.form.enable();
      }),
    ).subscribe();
  }
}
