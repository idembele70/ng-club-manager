import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubDashboardComponent } from './club-dashboard.component';

describe('ClubDashboardComponent', () => {
  let component: ClubDashboardComponent;
  let fixture: ComponentFixture<ClubDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClubDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClubDashboardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
