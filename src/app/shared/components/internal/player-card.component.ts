import { ZardCardComponent } from '@/shared/components/zard/card/card.component';
import { MillionsPipe } from '@/shared/pipes/millions.pipe';
import { Player } from '@libs/domain/models/player.model';
import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-player-card',
  imports: [
    ZardCardComponent,
    TranslatePipe,
    MillionsPipe
  ],
  host: {
    class: 'min-w-[250px]'
  },
  template: `
     <ng-template #title>
    <div class="flex justify-between">
      <div>
        <span class="mr-2" data-testid="nationality">{{ player().nationality + ' '  }}</span>
        <span data-testid="role">{{ player().role }}</span>
      </div>
      <span data-testid="rating">{{ 'PLAYER_CARD.RATE' | translate }}: {{ player().rating }} </span>
    </div>
    </ng-template>
    <ng-template #description>
      <img
        class="w-[50px] mx-auto"
        [src]="player().avatarUrl"
        [alt]="player().fullName"
        (error)="handleError($event)" />
    </ng-template>
   <z-card
    class="w-full max-w-[250px]"
    [zTitle]="title"
    [zDescription]="description"
    >
    <div class="mb-2">
      <p data-testid="full-name">{{player().fullName}}</p>
      <p data-testid="age">{{player().age}} {{ 'PLAYER_CARD.AGE_LABEL' | translate }} • {{ player().clubAbbreviation ?? '' }}</p>
    </div>
    <div class="mb-2">
      <h5 class="text-center font-bold">{{'PLAYER_CARD.STATS.LABEL' | translate}}</h5>
      @let stats = player().stats;
      <div class="flex gap-2">
        <div>
          <p data-testid="pace">{{'PLAYER_CARD.STATS.PACE.ABBREVIATION' | translate}} {{stats.pace}}</p>
          <p data-testid="passing">{{'PLAYER_CARD.STATS.PASSING.ABBREVIATION' | translate}} {{stats.passing}}</p>
          <p data-testid="physical">{{'PLAYER_CARD.STATS.PHYSICAL.ABBREVIATION' | translate}} {{stats.physical}}</p>
        </div>
        <div>
          <p data-testid="shooting">{{'PLAYER_CARD.STATS.SHOOTING.ABBREVIATION' | translate}} {{stats.shooting}}</p>
          <p data-testid="defending">{{'PLAYER_CARD.STATS.DEFENDING.ABBREVIATION' | translate}} {{stats.defending}}</p>
        </div>
      </div>
    </div>
    <div>
      <h5 class="text-center font-bold">{{'PLAYER_CARD.PRICE.LABEL' | translate}}</h5>
      <span data-testid="price">💰 {{ player().price | millions }}</span>
    </div>
    <div card-footer><ng-content/></div>
   </z-card>

  `,
  styles: ``,
})
export class PlayerCardComponent {
  player = input.required<Player>();
  
  handleError(event: Event): void {
    const fallbackPlayerAvatar = 'assets/img/player/player-default.png';
    (event.target as HTMLImageElement).src = fallbackPlayerAvatar;
  }
}
