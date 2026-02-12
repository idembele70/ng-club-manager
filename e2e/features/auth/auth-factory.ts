import { RegisterPayload } from '@libs/domain/models/register-payload.model';

export class AuthFactory {
   static buildId(...ids: (string | number)[]): string { return ids.join('-'); }

   static buildRegisterPayload(id: string, overrides?: Partial<RegisterPayload>): RegisterPayload {
      return {
         clubName: `test-club-name-${id}`,
         password: 'Str0ng-_P@ssw0rd?!',
         managerName: `test-manager-name-${id}`,
         ...overrides
      };
   }
}