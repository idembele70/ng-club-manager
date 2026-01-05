import { Component } from '@angular/core';
import { PlayerCardComponent } from "../../components/player-card/player-card.component";
import { Player } from '../../models/player.model';

@Component({
  selector: 'app-market',
  imports: [PlayerCardComponent],
  template: `
    <app-player-card [player]="player" />
  `,
  styles: ``,
})
export class MarketComponent {
  protected readonly player: Player = {
    id: 'plr-001',
    fullName: 'Ibrahim Dembélé',
    age: 24,
    nationality: '🇫🇷',
    clubAbbreviation: 'PSG',

    role: 'MID',
    rating: 82,

    avatarUrl: 'https://example.com/players/ibrahim-dembele.png',

    stats: {
      pace: 84,
      shooting: 76,
      passing: 83,
      defending: 68,
      physical: 74,
    },

    price: 12_500_000,
  }
}
