import { LoadingState } from '@/shared/models/loading-state.model';
import { ResponsiveService } from '@/shared/services/responsive.service';
import { Component, computed, DestroyRef, DOCUMENT, inject, NgZone, OnInit, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { PlayerCardListComponent } from "../../components/player-card-list/player-card-list.component";
import { ScrollToTopButtonComponent } from "../../components/scroll-to-top-button/scroll-to-top-button.component";
import { MarketService } from '../../services/market.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { MarketFilter } from '../../models/market-filter.model';
import { Player } from '../../models/player.model';
import { InfiniteScrollDirective } from '../../directives/infinite-scroll.directive';

@Component({
  selector: 'app-market',
  imports: [
    TranslatePipe,
    ScrollToTopButtonComponent,
    PlayerCardListComponent,
    InfiniteScrollDirective,
  ],
  template: `
  @if (loading() !== LoadingState.LOADING_INITIAL) {
    <app-player-card-list
      [playersForSale]="playersForSale()"
      appInfiniteScroll
      [canLoadMore]="canLoadMore()"
      (loadMore)="loadMorePlayer()"
      (bought)="playerBought()"
      />
    <app-scroll-to-top-button />
  }
  @if (isLoading()) {
    <h3 class="mt-3">{{ 'LOADING_STATE.LOADING' | translate}}</h3>
  }
  `,
  styles: ``,
})
export class MarketComponent implements OnInit {
  private readonly marketService = inject(MarketService);
  private readonly document = inject(DOCUMENT);
  private readonly limit = 50;
  protected readonly canLoadMore = signal<boolean>(false);
  private readonly responsiveService = inject(ResponsiveService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly playersForSale = signal<Player[]>([]);

  protected readonly LoadingState = LoadingState;
  protected readonly loading = signal<LoadingState>(LoadingState.LOADING_INITIAL);
  protected readonly isLoading = computed(() =>
    [LoadingState.LOADING_INITIAL, LoadingState.LOADING_MORE].includes(this.loading())
  );
  protected readonly showScrollTopBtn = signal<boolean>(false);
  protected readonly sidebarCurrentWidth = this.responsiveService.sidebarCurrentWidth;

  ngOnInit(): void {
    this.loadMarketPlayers({ offset: 0, limit: this.limit });
  }

  loadMorePlayer(): void {
    const { scrollHeight, scrollTop, clientHeight } = this.document.documentElement
    const scrollMaxHeight = scrollHeight - clientHeight;
    const scrollPosition = Math.ceil(scrollTop);
    const scrollThreshold = 150;
    if (
      scrollPosition + scrollThreshold >= scrollMaxHeight &&
      this.canLoadMore() &&
      ![LoadingState.LOADING_INITIAL, LoadingState.LOADING_MORE].includes(this.loading())
    ) {
      this.loading.set(LoadingState.LOADING_MORE);
      this.loadMarketPlayers({
        limit: this.limit,
        offset: this.playersForSale().length,
      });
    }
  }

  loadMarketPlayers(filter: MarketFilter): void {
    
    this.marketService.getPlayersForSale(filter).pipe(
      tap({
        next: ({ players, playersCount }) => {
          this.playersForSale.update(p => [...p, ...players]);
          this.canLoadMore.set(this.playersForSale().length < playersCount);
          this.loading.set(LoadingState.LOADED);
        },
        error: () => this.loading.set(LoadingState.ERROR),
      }),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe();
  }

  playerBought(): void {
    this.loading.set(LoadingState.LOADING_INITIAL);
    this.playersForSale.set([]);
    this.loadMarketPlayers({ offset: 0, limit: this.limit })
  }
}
