import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const passwordValidator: ValidatorFn = (
  { value } : AbstractControl
): ValidationErrors | null => {
  if (!value) return { REQUIRED: true };
  if (value?.length < 6) return { MIN_LENGTH: true };
  return null;
}