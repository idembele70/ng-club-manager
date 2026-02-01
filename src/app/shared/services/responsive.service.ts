import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { SIDEBAR } from '../constants/layout.constant';

@Injectable({
  providedIn: 'root',
})
export class ResponsiveService {
  readonly isSmallScreen = toSignal(inject(BreakpointObserver).observe([
    Breakpoints.XSmall,
    Breakpoints.Small,
  ]).pipe(
    map(result => result.matches)
  ), { initialValue: false });

  readonly sidebarCurrentWidth = computed<number>(() =>
    this.isSmallScreen() ? SIDEBAR.COLLAPSED_WIDTH : SIDEBAR.WIDTH
  );
}
