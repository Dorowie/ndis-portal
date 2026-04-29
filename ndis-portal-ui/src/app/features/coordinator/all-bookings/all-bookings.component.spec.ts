import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllBookings } from './all-bookings.component';

describe('AllBookings', () => {
  let component: AllBookings;
  let fixture: ComponentFixture<AllBookings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllBookings],
    }).compileComponents();

    fixture = TestBed.createComponent(AllBookings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
