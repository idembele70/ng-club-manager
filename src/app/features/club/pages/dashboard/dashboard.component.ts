import { AuthService } from '@/core/auth/services/auth.service';
import { PlayerCardComponent } from "@/shared/components/internal/player-card.component";
import { ZardButtonComponent } from '@/shared/components/zard/button/button.component';
import { ZardIcon } from '@/shared/components/zard/icon/icons';
import { LoadingState } from '@/shared/models/loading-state.model';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { map, tap } from 'rxjs';
import { PlayerService } from '@/features/club/services/player.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    PlayerCardComponent,
    TranslatePipe,
    RouterLink,
    ZardButtonComponent
  ],
  template: `
    @if (loading() === loadingState.LOADED) {
      <h1 class="mb-2">{{ playersCountLabel() | translate: { count: playerList().length} }} {{ club().name }}</h1>
      <div class="flex flex-wrap gap-1 justify-center">
        @for (player of playerList(); track player) {
          <app-player-card [player]="player" />
        } @empty {
          <button z-button zType="outline" routerLink="/market">{{ 'CLUB.DASHBOARD.EMPTY.CTA.OPEN_MARKET' | translate }}</button>
        } 
      </div>
    }
    @if (loading() === loadingState.LOADING_INITIAL) {
         <h3 class="mt-3">{{ 'LOADING_STATE.LOADING' | translate }}</h3>
    }
  `,
  styles: [''],
})
export class DashboardComponent {
  private readonly playerService = inject(PlayerService);
  private readonly authService = inject(AuthService);
  protected readonly isSmallScreen = toSignal(inject(BreakpointObserver).observe([
    Breakpoints.XSmall,
    Breakpoints.Small
  ]).pipe(
    map(result => result.matches)
  ), { initialValue: false });
  protected readonly sidebarCollapsed = linkedSignal<boolean>(() => this.isSmallScreen());
  protected readonly menuItems: Array<{
    icon: ZardIcon,
    label: string,
    link: string
  }> = [
      {
        icon: 'house',
        label: 'DASHBOARD',
        link: 'dashboard'
      },
      {
        icon: 'credit-card',
        label: 'TRANSFER_MARKET',
        link: 'transfer/market'
      }
    ];
  protected readonly club = computed(() => this.authService.currentClubSession()!.club);
  protected readonly loading = signal<LoadingState>(LoadingState.LOADING_INITIAL);
  protected readonly playersCountLabel = signal<string>('');
  protected readonly playerList = toSignal(
    this.playerService.getAll({ clubId: this.club().id }).pipe(
      map(d => d.players),
      tap((players) => {
        const count = players.length;
        const label = ['CLUB', 'DASHBOARD', 'PLAYERS', 'COUNT'];

        if (count === 0) label.push('ZERO');
        else if (count === 1) label.push('ONE');
        else label.push('OTHER');
        this.playersCountLabel.set(label.join('.'));
        this.loading.set(LoadingState.LOADED);
      })
    ),
    { initialValue: [] },
  );
  protected readonly loadingState = LoadingState;
}
