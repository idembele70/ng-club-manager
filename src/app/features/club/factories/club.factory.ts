import { Club } from "@/features/club/models/club.model";
import * as uuid from 'uuid';


export const createClub = (overrides: Partial<Club> = {}): Club => ({
  id: uuid.v1(),
  name: 'Manchester City',
  managerId: uuid.v1(),
  passwordEncrypted: 'hashed-password',
  balance: 10_000_000,
  createdAt: 17856984,
  abbreviation: 'MCI',
  ...overrides,
});