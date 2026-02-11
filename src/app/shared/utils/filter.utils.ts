import { Player, PlayerFilter } from '@libs/domain/models/player.model';
export function matchesFilter<T extends Record<string, any>>(
  entity: T,
  filter: Partial<T>
): boolean {
  return Object.entries(filter).every(
    ([key, value]) => entity[key as keyof T] === value
  );
}

export function matchesMarketPlayerFilter(
  player: Player,
  filter: PlayerFilter
) {
  const { minRating, maxRating, ...playerFilter } = filter;

  if (!matchesFilter(player, playerFilter)) {
    return false;
  }

  if (minRating !== undefined && player.rating < +minRating) {
    return false;
  }

  if (maxRating !== undefined && player.rating > +maxRating) {
    return false;
  }

  return true
}