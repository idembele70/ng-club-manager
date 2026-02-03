import { AuthService } from '@/core/auth/services/auth.service';
import { ZardButtonComponent } from '@/shared/components/zard/button/button.component';
import { ZardDialogService } from '@/shared/components/zard/dialog';
import { MillionsPipe } from '@/shared/pipes/millions.pipe';
import { Component, computed, inject, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
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
          <h3>{{ 'MARKET.EMPTY' | translate}}</h3>
        }
      </div>
  `,
  styles: ``,
})
export class MarketPlayerCardListComponent {
  playersForSale = input.required<Player[]>();
  private readonly marketService = inject(MarketService);
  private readonly dialogService = inject(ZardDialogService);
  private readonly millionsPipe = inject(MillionsPipe);
  private readonly authService = inject(AuthService);
  protected readonly club = computed(() => this.authService.currentClubSession()!.club);

  bought = output();

  buyPlayer(player: Player): void {
    this.dialogService.create({
      zTitle: 'Veuillez Confirmer votre achat',
      zContent: `Souhaitez-vous acheter <b>${player.fullName}</b> pour <b>${this.millionsPipe.transform(player.price)}</b>`,
      zCancelText: 'Annulez',
      zOkText: 'Achetez',
      zOnOk: () => this.confirmTransaction(player),
    });
  }
  confirmTransaction(player: Player): void {
    this.marketService.buyPlayer(player.id).pipe(
      tap({
      next: (result) => {
        this.dialogService.create({
          zTitle: 'Achat Réussi',
          zContent: `<b>${result.playerFullName}</b> à rejoins le <b>${result.clubName}</b> pour la somme de <b>${this.millionsPipe.transform(result.price)}</b>`,
          zHideFooter: true,
        });
        this.bought.emit();
      },
      error: () => {
        this.dialogService.create({
          zTitle: 'Achat échouer',
          zContent: `Une erreur s'est produite lors de l'achat`,
          zHideFooter: true,
        });
      }
    }),
    switchMap(() => this.authService.restoreSession()),
    ).subscribe();
  }
}
