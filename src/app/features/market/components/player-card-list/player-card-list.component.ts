import { MarketService } from './../../services/market.service';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { Component, inject, input, OnInit, output, signal, WritableSignal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Player } from '../../models/player.model';
import { PlayerCardComponent } from '../player-card/player-card.component';
import { AsyncPipe } from '@angular/common';
import { ZardDialogService } from '@/shared/components/dialog';
import { MillionsPipe } from '@/shared/pipes/millions.pipe';
import { ClubService } from '@/features/dashboard/services/club.service';
import { AuthService } from '@/core/auth/services/auth.service';
import { Club } from '@/shared/models/club.model';
import { switchMap, tap, withLatestFrom } from 'rxjs';

@Component({
  selector: 'app-player-card-list',
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
export class PlayerCardListComponent {
  playersForSale = input.required<Player[]>();
  private readonly marketService = inject(MarketService);
  private readonly dialogService = inject(ZardDialogService);
  private readonly millionsPipe = inject(MillionsPipe);
  protected readonly club: WritableSignal<Club>;
  private readonly clubService = inject(ClubService);

  bought = output();

  constructor() {
    this.club = signal((inject(AuthService).currentClubSession()!.club))
  }

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
          zContent: `<b>${result.playerFullName}</b> à rejoins le <b>FC ${result.clubName}</b> pour la somme de <b>${this.millionsPipe.transform(result.price)}</b>`,
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
    switchMap(() => this.clubService.get()),
    tap(club => this.club.set(club)),
    ).subscribe();
  }
}
