import { AuthService } from '@/core/auth/services/auth.service';
import { ZardButtonComponent } from '@/shared/components/zard/button/button.component';
import { ZardDialogService } from '@/shared/components/zard/dialog';
import { MillionsPipe } from '@/shared/pipes/millions.pipe';
import { Component, computed, inject, input, output } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { switchMap, tap } from 'rxjs';
import { PlayerCardComponent } from '@/shared/components/internal/player-card.component';
import { Player } from '@libs/domain/models/player.model';
import { MarketService } from '@/features/market/services/market.service';

@Component({
  selector: 'app-market-player-card-list',
  imports: [
    PlayerCardComponent,
    ZardButtonComponent,
    TranslatePipe,
    MillionsPipe,
  ],
  providers: [
    MillionsPipe,
  ],
  template: `
     <h1 class="mb-2">Solde du club: {{ club().balance | millions}}</h1>
     <div class="flex flex-wrap gap-1 justify-center">
       @for (player of playersForSale(); track player) {
          <app-player-card [player]="player">
            <button (click)="buyPlayer(player)" z-button zType="outline" type="button">Acheter</button>
          </app-player-card>
        } @empty {
         @if (!marketService.isLoading() && !marketService.isSearching()) {
          <h3>{{ 'MARKET.EMPTY' | translate}}</h3>
         }
        }
      </div>
  `,
  styles: ``,
})
export class MarketPlayerCardListComponent {
  playersForSale = input.required<Player[]>();
  protected readonly marketService = inject(MarketService);
  private readonly dialogService = inject(ZardDialogService);
  private readonly millionsPipe = inject(MillionsPipe);
  private readonly authService = inject(AuthService);
  private readonly translateService = inject(TranslateService);
  protected readonly club = computed(() => this.authService.currentClubSession()!.club);

  bought = output();

  buyPlayer(player: Player): void {
    const confirmTranslateKeyPrefix = 'MARKET.PURCHASE.CONFIRM.';
    this.dialogService.create({
      zTitle: this.translateService.instant(confirmTranslateKeyPrefix + 'TITLE'),
      zContent: this.translateService.instant(confirmTranslateKeyPrefix + 'CONTENT', {
        fullName: player.fullName,
        price: this.millionsPipe.transform(player.price),
      }),
      zCancelText: this.translateService.instant(confirmTranslateKeyPrefix + 'BUTTON.CANCEL'),
      zOkText: this.translateService.instant(confirmTranslateKeyPrefix + 'BUTTON.OK'),
      zOnOk: () => this.confirmTransaction(player),
    });
  }
  confirmTransaction(player: Player): void {
    this.marketService.buyPlayer(player.id).pipe(
      tap({
        next: ({ playerFullName, clubName, price }) => {
          const successTranslateKeyPrefix = 'MARKET.PURCHASE.SUCCESS.';
          this.dialogService.create({
            zTitle: this.translateService.instant(successTranslateKeyPrefix + 'TITLE'),
            zContent: this.translateService.instant(successTranslateKeyPrefix + 'CONTENT', {
              playerFullName, clubName, price: this.millionsPipe.transform(price)
            }),
            zHideFooter: true,
          });
          this.bought.emit();
        },
        error: (err) => {
          this.dialogService.create({
            zTitle: this.translateService.instant('MARKET.PURCHASE.FAILURE.TITLE'),
            zContent: this.translateService.instant(err.message),
            zHideFooter: true,
          });
        },
      }),
      switchMap(() => this.authService.restoreSession()),
    ).subscribe();
  }
}
