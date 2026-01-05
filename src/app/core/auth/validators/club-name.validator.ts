import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const clubNameValidator: ValidatorFn = (control: AbstractControl<string>): ValidationErrors | null => {
  const { value } = control;
  if (!value) return { REQUIRED: true };
  if (!/^.{3,30}$/.test(value)) return { LENGTH: true };
  if (!/^[A-Za-z0-9 '-]+$/.test(value)) return { CHARS: true };
  if (!/^[A-Za-z0-9].*[A-Za-z0-9]$/.test(value)) return { EDGES: true };
  return null;
}