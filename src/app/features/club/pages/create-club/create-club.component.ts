import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { clubAndManagerNameValidator } from '../../validators/club-manager-name.validator';
import { passwordMatchValidators } from '../../validators/password-match-validator';
import { passwordValidator } from '../../validators/password.validator';
import { CrossFieldErrorMatcher } from './../../validators/password-match-validator';
import { ZardFormModule } from '@/shared/components/form/form.module';
import { ZardInputDirective } from '@/shared/components/input/input.directive';
import { ZardButtonComponent } from '@/shared/components/button/button.component';

@Component({
  selector: 'app-create-club',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    ZardFormModule,
    ZardInputDirective,
    ZardButtonComponent
  ],
  providers: [
  ],
  template: `
        <form
          class="max-w-sm space-y-6"
          [formGroup]="form">
          <z-form-field>
            <label z-form-label zRequired for="clubName">
              {{ 'CREATE_CLUB_FORM.CLUB_NAME_FORM.FORM_FIELD.LABEL' | translate }}
            </label>
            <z-form-control>
              <input
                z-input
                id="clubName"
                [placeholder]="'CREATE_CLUB_FORM.CLUB_NAME_FORM.FORM_FIELD.PLACEHOLDER' | translate"
                formControlName="clubName" />
            </z-form-control>
            @if (form.controls['clubName'].getError(clubNameCurrentErrorKey)) {
              <z-form-message type="error">{{ 'CREATE_CLUB_FORM.CLUB_NAME_FORM.FORM_FIELD.ERROR.' + clubNameCurrentErrorKey | translate}}</z-form-message>
            }
          </z-form-field>
          <z-form-field>
            <label
              z-form-label
              z-Required
              for="managerName">{{ 'CREATE_CLUB_FORM.MANAGER_NAME_FORM.FORM_FIELD.LABEL' | translate }}</label>
            <z-form-control>
              <input 
                z-input
                id="managerName"
                [placeholder]="'CREATE_CLUB_FORM.MANAGER_NAME_FORM.FORM_FIELD.PLACEHOLDER' | translate"
                formControlName="managerName" />
            </z-form-control>
            @if (form.controls['managerName'].getError(managerNameCurrentErrorKey)) {
              <z-form-message zType="error">{{ 'CREATE_CLUB_FORM.MANAGER_NAME_FORM.FORM_FIELD.ERROR.' + managerNameCurrentErrorKey | translate}}</z-form-message>
            }
            </z-form-field>
            <z-form-field>
            <label
              z-form-label
              for="password">{{ 'CREATE_CLUB_FORM.PASSWORD_FORM.PASSWORD_FORM_FIELD.LABEL' | translate }}</label>
            <z-form-control>
              <input
                z-input
                id="password"
                [placeholder]="'CREATE_CLUB_FORM.PASSWORD_FORM.PASSWORD_FORM_FIELD.PLACEHOLDER' | translate"
                formControlName="password" />
            </z-form-control>
              @if (passwordCurrentErrorKey) {
                <z-form-message ztype="error">{{ 'CREATE_CLUB_FORM.PASSWORD_FORM.PASSWORD_FORM_FIELD.ERROR.' + passwordCurrentErrorKey | translate  }}</z-form-message>
              }
            </z-form-field>
            <z-form-field>
              <label for="confirmPassword">{{ 'CREATE_CLUB_FORM.PASSWORD_FORM.CONFIRM_PASSWORD_FORM_FIELD.LABEL' | translate }}</label>
              <input
                z-input
                id="confirmPassword"
                [placeholder]="'CREATE_CLUB_FORM.PASSWORD_FORM.CONFIRM_PASSWORD_FORM_FIELD.PLACEHOLDER' | translate"
                formControlName="confirmPassword" />
              @if (form.hasError('misMatch')) {
                <z-form-message zType="error">{{ 'CREATE_CLUB_FORM.PASSWORD_FORM.PASSWORD_FORM_FIELD.ERROR.MIS_MATCH' | translate  }}</z-form-message>
              }
            </z-form-field>
          <div>
            <button z-button z-type="default" type="submit" [disabled]="form.invalid">{{ 'CREATE_CLUB_FORM.BUTTON_LABEL.CONFIRM' | translate }}</button>
          </div>
        </form>
  `,
  styles: `
    form {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    z-form-field {
      width: 90vw;
      max-width: 350px;
    }
  
  `
})
export class CreateClubComponent {
  private readonly _fb = inject(FormBuilder);
  protected readonly form = this._fb.nonNullable.group({
    clubName: ['', clubAndManagerNameValidator],
    managerName: ['', clubAndManagerNameValidator],
    password: ['', passwordValidator],
    confirmPassword: '',
  },
    {
      validators: passwordMatchValidators
    });
  get clubNameCurrentErrorKey(): string {
    return this.getErrorKey(this.form.controls['clubName'].errors)
  }

  get managerNameCurrentErrorKey(): string {
    return this.getErrorKey(this.form.controls['managerName'].errors);
  }

  get passwordCurrentErrorKey(): string {
    return this.getErrorKey(this.form.controls['password'].errors);
  }

  private getErrorKey(errors: ValidationErrors | null): string {
    if (!errors) return '';
    return Object.keys(errors)[0];
  }
}
