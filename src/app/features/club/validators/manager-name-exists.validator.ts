import { AbstractControl, AsyncValidatorFn } from "@angular/forms";
import { map, Observable, of, switchMap, tap, timer } from "rxjs";
import { ManagerService } from "../services/manager.service";

export const managerNameExistsValidator = (
  managerService: ManagerService
): AsyncValidatorFn => {
  let previousName: string | null = null;
  return (control: AbstractControl): Observable<{ MANAGER_EXISTS:boolean } | null> => {
    if(control.invalid) return of(null);
    const name = control.value;
    return timer(100).pipe(
      switchMap(() => {
        if (previousName === name) return of(null);
        return managerService.exists(name);
      }),
      tap(() => previousName = name),
      map((MANAGER_EXISTS) => MANAGER_EXISTS ? { MANAGER_EXISTS: true } : null),
    );
  }
}