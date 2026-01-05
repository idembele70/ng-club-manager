export interface Player {
  id: string;
  nationality: string;
  role: PlayerRole;
  rating: number;
  avatarUrl: string;
  fullName: string;
  age: number;
  clubAbbreviation: string;
  stats: Stats;
  price: number;
}

type PlayerRole = 
  | 'GK'
  | 'DEF'
  | 'MID'
  | 'ATT'

interface Stats {
  pace: number;
  shooting: number;
  passing: number;
  defending: number;
  physical: number
}