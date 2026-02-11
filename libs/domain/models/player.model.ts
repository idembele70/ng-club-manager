export interface Player {
  id: string;
  nationality: string;
  role: PlayerRole;
  rating: number;
  avatarUrl: string;
  fullName: string;
  age: number;
  clubId: string;
  stats: Stats;
  price: number;
  clubAbbreviation?: string;
}

export type PlayerRole = 
  | 'GK'
  | 'DEF'
  | 'MID'
  | 'ATT'

export interface Stats {
  pace: number;
  shooting: number;
  passing: number;
  defending: number;
  physical: number;
}

export interface PlayerFilter {
  role?: PlayerRole;
  minRating?: number;
  maxRating?: number;
}