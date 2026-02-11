import { AuthService } from '@/core/auth/services/auth.service';
import { PlayerService } from '@/features/club/services/player.service';
import { PlayerCardComponent } from "@/shared/components/internal/player-card.component";
import { ZardButtonComponent } from '@/shared/components/zard/button/button.component';
import { ZardDividerComponent } from '@/shared/components/zard/divider';
import { ZardIcon } from '@/shared/components/zard/icon/icons';
import { PLAYER_ROLE_LIST } from '@/shared/constants/player-roles.constant';
import { LoadingState } from '@/shared/models/loading-state.model';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Player, PlayerRole } from '@libs/domain/models/player.model';
import { TranslatePipe } from '@ngx-translate/core';
import { map, tap } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [
    PlayerCardComponent,
    TranslatePipe,
    RouterLink,
    ZardButtonComponent,
    ZardDividerComponent,
  ],
  template: `
    @if (loading() === loadingState.LOADED) {
      <h1 class="mb-2">{{ playersCountLabel() | translate: { count: playerList().length} }} {{ club().name }}</h1>
      @for(role of playerRoleList; track role) {
        <h3> {{ ('CLUB.DASHBOARD.PLAYERS.ROLE.' + role) | translate }}</h3>
        <z-divider />
        <div class="flex flex-wrap gap-1 justify-center">
          @for (player of groupByRole(role); track player) {
            <app-player-card [player]="player" />
          } @empty {
          <button
            z-button zType="outline"
            routerLink="/market"
            [queryParams]="{ role }">{{ ('CLUB.DASHBOARD.EMPTY.CTA.OPEN_MARKET.FILTERS.' + role) | translate }}</button>
        }
        </div>
      }
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
  protected readonly playerRoleList = PLAYER_ROLE_LIST;

  groupByRole(role: PlayerRole): Player[] {
    return this.playerList().filter(p => p.role === role);
  }
}
