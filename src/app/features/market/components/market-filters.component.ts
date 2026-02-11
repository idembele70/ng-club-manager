import { ZardButtonComponent } from '@/shared/components/zard/button';
import { ZardComboboxComponent, ZardComboboxOption } from '@/shared/components/zard/combobox';
import { ZardSliderComponent } from '@/shared/components/zard/slider';
import { PLAYER_ROLE_LIST } from '@/shared/constants/player-roles.constant';
import { Component, computed, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { MarketFilter } from '../models/market-filter.model';
import { MarketService } from '../services/market.service';
import { filter, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PlayerRole } from '@libs/domain/models/player.model';

@Component({
  selector: 'app-market-filters',
  imports: [
    ZardComboboxComponent,
    ZardButtonComponent,
    ReactiveFormsModule,
    TranslatePipe,
    ZardSliderComponent
  ],
  template: `
    <form class="flex gap-1" [formGroup]="filterForm" (ngSubmit)="submitFilters()">
      <z-combobox
        class="max-w-[150px]"
        [options]="playerRoleList"
        [placeholder]="'MARKET.FILTERS.ROLE.PLACEHOLDER' | translate"
        [searchPlaceholder]="'MARKET.FILTERS.ROLE.SEARCH_PLACEHOLDER' | translate"
        [emptyText]="'MARKET.FILTERS.ROLE.EMPTY_TEXT' | translate"
        formControlName="role"
      />
      <div class="w-[150px] flex items-center justify-center px-5">
        <h6 class="mr-3">{{ currentMinRating() ?? 0 }}</h6>
        <z-slider
          zStep="4"
          [zMin]="marketService.filters()?.minRating ?? 50"
          [zMax]="marketService.filters()?.maxRating ?? 60"
          formControlName="minRating" />
      </div>
      <z-combobox
        class="max-w-[150px]"
        [options]="nationalityList()"
        [placeholder]="'MARKET.FILTERS.NATIONALITY.PLACEHOLDER' | translate"
        [searchPlaceholder]="'MARKET.FILTERS.NATIONALITY.SEARCH_PLACEHOLDER' | translate"
        [emptyText]="'MARKET.FILTERS.NATIONALITY.EMPTY_TEXT' | translate"
        formControlName="nationality"
      />
      <button
        [zLoading]="marketService.isSearching()"
        [zDisabled]="filterForm.pristine"
        z-button zType="outline">{{ 'MARKET.FILTERS.BUTTON.SEARCH' | translate }}</button>
    </form>
  `,
  styles: ``,
})
export class MarketFiltersComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly roleQueryParams = inject(ActivatedRoute).snapshot.queryParamMap.get('role') as PlayerRole

  protected readonly marketService = inject(MarketService);
  protected readonly playerRoleList: ZardComboboxOption[] = PLAYER_ROLE_LIST.map(p => ({ value: p, label: p }));;
  protected readonly nationalityList = toSignal(
    this.marketService.getNationalities(), { initialValue: [] },
  );

  protected readonly currentMinRating = signal<number | undefined>(
    this.marketService.filters()?.minRating
  );

  readonly filterForm = this.fb.nonNullable.group({
    role: this.roleQueryParams ?? '',
    minRating: this.currentMinRating(),
    nationality: [''],
  });
  

  ngOnInit(): void {
    if (this.roleQueryParams) {
      this.submitFilters();
    }
    this.listenToMinRatingChanges();
  }

  submitFilters(): void {
    if (this.marketService.isLoading() || this.marketService.isSearching()) return;
    this.marketService.setIsSearching(true)
    this.marketService.resetPlayerList();
    this.marketService.updateFilters({...this.filterForm.value, minRating: this.currentMinRating()});
    this.marketService.getPlayersForSale().subscribe(() => this.marketService.setIsSearching(false));
  }

  private listenToMinRatingChanges(): void {
    this.filterForm.controls.minRating.valueChanges.pipe(
      tap(v => this.currentMinRating.set(v)),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe();
  }
}
