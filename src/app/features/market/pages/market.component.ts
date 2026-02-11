import { LoadingState } from '@/shared/models/loading-state.model';
import { ResponsiveService } from '@/shared/services/responsive.service';
import { Component, DOCUMENT, inject, OnInit, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MarketFiltersComponent } from '../components/market-filters.component';
import { MarketPlayerCardListComponent } from "../components/market-player-card-list/market-player-card-list.component";
import { ScrollToTopButtonComponent } from "../components/scroll-to-top-button/scroll-to-top-button.component";
import { InfiniteScrollDirective } from '../directives/infinite-scroll.directive';
import { MarketService } from '../services/market.service';

@Component({
  selector: 'app-market',
  imports: [
    TranslatePipe,
    ScrollToTopButtonComponent,
    MarketPlayerCardListComponent,
    InfiniteScrollDirective,
    MarketFiltersComponent,
  ],
  template: `
  @if (
    marketService.loading() !== LoadingState.LOADING_INITIAL ||
    !marketService.isSearching()
  ) {
    <app-market-filters />
    <app-market-player-card-list
      [playersForSale]="marketService.playersForSale()"
      appInfiniteScroll
      [canLoadMore]="marketService.canLoadMore()"
      (loadMore)="loadMorePlayer()"
      (bought)="playerBought()"
      />
    <app-scroll-to-top-button />
  }
  @if (marketService.isSearching()) {
    <h3 class="mt-3">{{ 'MARKET.SEARCHING' | translate }}</h3>
  }
  @if (marketService.isLoading()) {
    <h3 class="mt-3">{{ 'LOADING_STATE.LOADING' | translate }}</h3>
  }
  `,
  styles: ``,
})
export class MarketComponent implements OnInit {
  private readonly document = inject(DOCUMENT);
  private readonly limit = 50;
  private readonly responsiveService = inject(ResponsiveService);
  
  protected readonly marketService = inject(MarketService);

  protected readonly LoadingState = LoadingState;
  
  protected readonly showScrollTopBtn = signal<boolean>(false);
  protected readonly sidebarCurrentWidth = this.responsiveService.sidebarCurrentWidth;

  ngOnInit(): void {
    this.updateFilterAndReload();
  }

  loadMorePlayer(): void {
    const { scrollHeight, scrollTop, clientHeight } = this.document.documentElement
    const scrollMaxHeight = scrollHeight - clientHeight;
    const scrollPosition = Math.ceil(scrollTop);
    const scrollThreshold = 150;
    if (
      scrollPosition + scrollThreshold >= scrollMaxHeight &&
      this.marketService.canLoadMore() &&
      !this.marketService.isLoading()
    ) {
      this.marketService.setLoading(LoadingState.LOADING_MORE);
      this.updateFilterAndReload();
    }
  }

  playerBought(): void {
    this.marketService.setLoading(LoadingState.LOADING_INITIAL);
    this.marketService.resetPlayerList();
    this.updateFilterAndReload();
  }

  private updateFilterAndReload(): void {
    this.marketService.updateFilters({ offset: this.marketService.playersForSale().length, limit: this.limit });
    this.marketService.getPlayersForSale().subscribe();
  }
}
