import { LoaderService } from '@/core/services/loader.service';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardFormModule } from '@/shared/components/form/form.module';
import { ZardInputDirective } from '@/shared/components/input/input.directive';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { finalize, tap } from 'rxjs';
import { CreateClubPayload } from '../../models/club.model';
import { ClubAuthService } from '../../services/club-auth.service';
import { ClubService } from '../../services/club.service';
import { ManagerService } from '../../services/manager.service';
import { clubNameExistsValidator } from '../../validators/club-name-exists.validator';
import { clubNameValidator } from '../../validators/club-name.validator';
import { managerNameExistsValidator } from '../../validators/manager-name-exists.validator';
import { managerNameValidator } from '../../validators/manager-name.validator';
import { passwordMatchValidators } from '../../validators/password-match-validator';
import { passwordValidator } from '../../validators/password.validator';

@Component({
  selector: 'app-create-club',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    ZardFormModule,
    ZardInputDirective,
    ZardButtonComponent,
    RouterLink,
  ],
  providers: [
  ],
  host: {
    'class': 'flex justify-center pt-4 px-2',
  },
  template: `
        <form
          (ngSubmit)="createClub()"
          class="w-sm space-y-6"
          [formGroup]="form">
          <z-form-field>
            <label z-form-label zRequired for="clubName">
              {{ 'CREATE_CLUB_FORM.CLUB_NAME.FORM_FIELD.LABEL' | translate }}
            </label>
            <z-form-control>
              <input
                z-input
                id="clubName"
                [placeholder]="'CREATE_CLUB_FORM.CLUB_NAME.FORM_CONTROL.PLACEHOLDER' | translate"
                formControlName="clubName" />
            </z-form-control>
            @let clubNameControl = form.controls['clubName']; 
            @if (
              (clubNameControl.dirty || clubNameControl.touched) &&
              clubNameControl.getError(clubNameCurrentErrorKey)
              ) {
              <z-form-message zType="error">{{ 'CREATE_CLUB_FORM.CLUB_NAME.FORM_FIELD.ERRORS.' + clubNameCurrentErrorKey | translate}}</z-form-message>
            }
          </z-form-field>
          <z-form-field>
            <label
              z-form-label
              zRequired
              for="managerName">{{ 'CREATE_CLUB_FORM.MANAGER_NAME.FORM_FIELD.LABEL' | translate }}</label>
            <z-form-control>
              <input 
                z-input
                id="managerName"
                [placeholder]="'CREATE_CLUB_FORM.MANAGER_NAME.FORM_CONTROL.PLACEHOLDER' | translate"
                formControlName="managerName" />
            </z-form-control>
            @let managerNameControl = form.controls['managerName'];
            @if (
              (managerNameControl.dirty || managerNameControl.touched) &&
              managerNameControl.getError(managerNameCurrentErrorKey)) {
              <z-form-message zType="error">{{ 'CREATE_CLUB_FORM.MANAGER_NAME.FORM_FIELD.ERRORS.' + managerNameCurrentErrorKey | translate}}</z-form-message>
            }
            </z-form-field>
            <z-form-field>
            <label
              z-form-label
              zRequired
              for="password">{{ 'CREATE_CLUB_FORM.PASSWORD.FORM_FIELD.LABEL' | translate }}</label>
            <z-form-control>
              <input
                z-input
                id="password"
                [placeholder]="'CREATE_CLUB_FORM.PASSWORD.FORM_CONTROL.PLACEHOLDER' | translate"
                formControlName="password" />
            </z-form-control>
              @let passwordControl = form.controls['password'];
              @if (
                (passwordControl.dirty || passwordControl.touched) &&
                passwordCurrentErrorKey
              ) {
                <z-form-message zType="error">{{ 'CREATE_CLUB_FORM.PASSWORD.FORM_FIELD.ERRORS.' + passwordCurrentErrorKey | translate  }}</z-form-message>
              }
            </z-form-field>
            <z-form-field>
              <label
                z-form-label
                zRequired
                for="confirmPassword">{{ 'CREATE_CLUB_FORM.CONFIRM_PASSWORD.FORM_FIELD.LABEL' | translate }}</label>
              <input
                z-input
                id="confirmPassword"
                [placeholder]="'CREATE_CLUB_FORM.CONFIRM_PASSWORD.FORM_CONTROL.PLACEHOLDER' | translate"
                formControlName="confirmPassword" />
              @let confirmPasswordControl = form.controls['confirmPassword'];
              @if (
                  !passwordCurrentErrorKey &&
                (confirmPasswordControl.dirty || confirmPasswordControl.touched) &&
                form.hasError('misMatch')
                ) {
                <z-form-message zType="error">{{ 'CREATE_CLUB_FORM.PASSWORD.FORM_FIELD.ERRORS.MIS_MATCH' | translate  }}</z-form-message>
              }
            </z-form-field>
            @if (errorMessageI18nKey()) {
              <z-form-message zType="error">{{ errorMessageI18nKey() | translate }}</z-form-message>
            }
            <div class="flex flex-col gap-2">
              <button
                z-button
                z-type="default"
                type="submit"
                [zLoading]="loaderService.isAuthenticating()"
                [zDisabled]="form.invalid">{{ 'CREATE_CLUB_FORM.BUTTON.CONFIRM.LABEL' | translate }}</button>
              <button z-button z-type="default"
                type="button"
                [zDisabled]="form.disabled"
                [routerLink]="['../', 'login']">
                {{  'CREATE_CLUB_FORM.BUTTON.LOGIN.LABEL' | translate  }}
              </button>
            </div>          
        </form>
  `,
  styles: ``
})
export class CreateClubComponent {
  private readonly _fb = inject(FormBuilder);
  private readonly clubAuthService = inject(ClubAuthService);
  private readonly clubService = inject(ClubService);
  private readonly managerService = inject(ManagerService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly loaderService = inject(LoaderService);
  protected readonly form = this._fb.nonNullable.group({
    clubName: ['', clubNameValidator, clubNameExistsValidator(this.clubService)],
    managerName: ['', managerNameValidator, managerNameExistsValidator(this.managerService)],
    password: ['', passwordValidator],
    confirmPassword: '',
  },
    {
      validators: passwordMatchValidators,
    });
  protected readonly errorMessageI18nKey = signal<Error['message'] | null>(null);

  get clubNameCurrentErrorKey(): string {
    return this.getErrorKey(this.form.controls['clubName'].errors);
  }
  get managerNameCurrentErrorKey(): string {
    return this.getErrorKey(this.form.controls['managerName'].errors);
  }
  get passwordCurrentErrorKey(): string {
    return this.getErrorKey(this.form.controls['password'].errors);
  }

  createClub() {
    if (this.form.invalid) {
      return;
    }
    this.form.disable();
    this.loaderService.setIsAuthenticating(true);
    const payload = this.form.value as CreateClubPayload;
    return this.clubAuthService.create(payload)
      .pipe(
        tap({
          next: () =>
            void this.router.navigate(['../', 'login'], {
              relativeTo: this.route,
            }),
          error: (err: Error) => this.errorMessageI18nKey.set(err.message),
        }),
        finalize(() => {
          this.loaderService.setIsAuthenticating(false);
          this.form.enable();
        })
      ).subscribe();
  }

  private getErrorKey(errors: ValidationErrors | null): string {
    if (!errors) return '';
    return Object.keys(errors)[0];
  }
}
