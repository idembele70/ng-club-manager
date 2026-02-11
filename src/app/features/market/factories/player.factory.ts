import { NATIONALITY_LIST } from '@/shared/constants/nationality.constant';
import { Player, PlayerRole, Stats } from '@libs/domain/models/player.model';
import * as uuid from 'uuid';

const firstNames = [
  'Ibrahim', 'Lucas', 'Adam', 'Yanis', 'Noah', 'Enzo', 'Mathis', 'Rayan', 'Hugo', 'Nolan',
  'Karim', 'Amine', 'Mehdi', 'Samuel', 'Léo', 'Tom', 'Aaron', 'Kylian', 'Ousmane', 'Issa'
];

const lastNames = [
  'Dembélé', 'Martin', 'Bernard', 'Traoré', 'Diallo', 'Benali', 'Moreau', 'Petit', 'Rossi',
  'Lopez', 'Garcia', 'Mbaye', 'Diop', 'Durand', 'Dubois', 'Nguyen', 'Koulibaly', 'Bamba'
];

const roles: PlayerRole[] = ['GK', 'DEF', 'MID', 'ATT'];

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const pick = <T>(arr: T[]) => arr[rand(0, arr.length - 1)];

function statsByRole(role: PlayerRole): Stats {
  switch (role) {
    case 'GK':
      return {
        pace: rand(30, 55),
        shooting: rand(20, 45),
        passing: rand(45, 70),
        defending: rand(70, 92),
        physical: rand(65, 90),
      };

    case 'DEF':
      return {
        pace: rand(45, 70),
        shooting: rand(35, 60),
        passing: rand(50, 75),
        defending: rand(70, 92),
        physical: rand(65, 90),
      };

    case 'MID':
      return {
        pace: rand(55, 80),
        shooting: rand(50, 75),
        passing: rand(70, 92),
        defending: rand(45, 70),
        physical: rand(55, 80),
      };

    case 'ATT':
      return {
        pace: rand(65, 92),
        shooting: rand(70, 92),
        passing: rand(50, 75),
        defending: rand(30, 55),
        physical: rand(55, 85),
      };
  }
}

export function createRandomPlayer(): Player {
  const role = pick(roles);
  const age = rand(17, 34);

  const stats: Stats = statsByRole(role)

  const rating = Math.round(
    (stats.pace + stats.shooting + stats.passing + stats.defending + stats.physical) / 5
  );

  return {
    id: uuid.v1(),
    fullName: `${pick(firstNames)} ${pick(lastNames)}`,
    age,
    nationality: pick(NATIONALITY_LIST).name,
    role,
    rating,
    avatarUrl: '',
    stats,
    price: rating * rating * 10_000,
    clubId: '',
  };
}

export const createPlayer = (overrides?: Partial<Player>): Player => ({
  ...createRandomPlayer(),
  ...overrides,
});