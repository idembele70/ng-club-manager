import { ClubAuthService } from './club-auth.service';
import { TestBed } from '@angular/core/testing';


describe('AuthService', () => {
  let service: ClubAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClubAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
