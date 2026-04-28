import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllBookingsComponent } from './all-bookings.component';

describe('AllBookings', () => {
  let component: AllBookingsComponent;
  let fixture: ComponentFixture<AllBookingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllBookingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AllBookingsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
