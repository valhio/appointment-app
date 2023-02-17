import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementBookingHoursComponent } from './management-booking-hours.component';

describe('ManagementBookingHoursComponent', () => {
  let component: ManagementBookingHoursComponent;
  let fixture: ComponentFixture<ManagementBookingHoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagementBookingHoursComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagementBookingHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
