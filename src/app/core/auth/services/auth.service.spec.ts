import { authRepositoryInterceptor } from './../auth.interceptor';
import { JwtService } from '@/core/services/jwt.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { Mock } from 'vitest';
import { ClubRepositoryService } from '../../../features/dashboard/repositories/club.repository';
import { tokenInterceptor } from '../../interceptors/token.interceptor';
import { clubRepositoryInterceptor } from '../../../features/dashboard/interceptors/club-repository.interceptor';
import { AuthSession, RegisterPayload, LoginPayload } from '../auth.model';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let clubRepositoryService: ClubRepositoryService;
  let saveTokenSpy: Mock<JwtService['saveToken']>;
  const CREATE_CLUB_MOCK_PAYLOAD: RegisterPayload = {
    clubName: 'FC Nantes',
    managerName: 'Claude Puel',
    password: 'Str0ngP@ss123!?!',
  };
  const MOCK_AUTH_SESSION: AuthSession = {
    club: {
      id: '001',
      balance: 100_000,
      createdAt: 1704587,
      managerId: '002',
      name: 'FC Porto',
      passwordEncrypted: 'Encrypted-P@ssw0rd?!'
    },
    token: 'my-token'
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideTranslateService(),
        provideHttpClient(withInterceptors([
          tokenInterceptor,
          authRepositoryInterceptor,
          clubRepositoryInterceptor
        ]))
      ],
    });
    service = TestBed.inject(AuthService);
    jwtService = TestBed.inject(JwtService);
    clubRepositoryService = TestBed.inject(ClubRepositoryService);
    saveTokenSpy = vi.spyOn(jwtService, 'saveToken');
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('create', () => {
    it('should create a club', async () => {
      const payload = CREATE_CLUB_MOCK_PAYLOAD;
      const club = await firstValueFrom(service.create(payload));
      expect(club.name).toBe(payload.clubName);
      expect(club.passwordEncrypted).not.toBe(payload.password);
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      await firstValueFrom(service.create(CREATE_CLUB_MOCK_PAYLOAD));
    });

    it('should login using club name', async () => {
      const payload: LoginPayload = {
        managerOrClubName: CREATE_CLUB_MOCK_PAYLOAD['clubName'],
        password: CREATE_CLUB_MOCK_PAYLOAD['password'],
      };
      const authSession = await firstValueFrom(service.login(payload));

      expect(service.currentClubSession()).toEqual(authSession);
      expect(authSession.club.name).toBe(payload.managerOrClubName);
      expect(saveTokenSpy).toHaveBeenCalledExactlyOnceWith(authSession.token);
    });

    it('should login using manager name', async () => {
      const payload: LoginPayload = {
        managerOrClubName: CREATE_CLUB_MOCK_PAYLOAD['managerName'],
        password: CREATE_CLUB_MOCK_PAYLOAD['password'],
      };
      const authSession = await firstValueFrom(service.login(payload));

      expect(service.currentClubSession()).not.toBeUndefined();
      expect(saveTokenSpy).toHaveBeenCalledExactlyOnceWith(authSession.token);
    });
  });

  describe('restoreSession', () => {
    it('should restore session', async () => {
      vi.spyOn(clubRepositoryService, 'findByToken').mockReturnValue(MOCK_AUTH_SESSION);
      vi.spyOn(jwtService, 'getToken').mockReturnValue('my-token');
      const setAuthSpy = vi.spyOn(service, 'setAuth');
      const authSession = await firstValueFrom(service.restoreSession());
      expect(setAuthSpy).toHaveBeenCalledExactlyOnceWith(authSession);
    });
  });


  describe('setAuth', () => {
    it('should call setAuth', () => {
      const authSession = MOCK_AUTH_SESSION;
      service.setAuth(authSession);
      expect(service.currentClubSession()).toEqual(authSession);
      expect(saveTokenSpy).toHaveBeenCalledExactlyOnceWith(authSession.token);
    });
  });

  describe('logout', () => {
    it('should logout', () => {
      const destroyTokenSpy = vi.spyOn(jwtService, 'destroyToken');
      service.logout();
      expect(destroyTokenSpy).toHaveBeenCalledOnce();
      expect(service.currentClubSession()).toBeUndefined();
    });
  });
});
