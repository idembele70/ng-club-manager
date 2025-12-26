import { AbstractControl, AsyncValidatorFn } from "@angular/forms";
import { map, Observable, of, switchMap, tap, timer } from "rxjs";
import { ClubService } from "../services/club.service";

export const clubNameExistsValidator = (
  clubService: ClubService
): AsyncValidatorFn => {
  let previousName: string | null = null;
  return (control: AbstractControl): Observable<{ CLUB_EXISTS: boolean } | null> => {
    if (control.invalid) return of(null);
    const name = control.value;
    return timer(100).pipe(
      switchMap(() => {
        if (previousName === name) return of(null);
        return clubService.exists(name);
      }),
      tap(() => previousName = name),
      map((CLUB_EXISTS) => CLUB_EXISTS ? { CLUB_EXISTS: true } : null),
    );
  }
}