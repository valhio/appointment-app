import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingHoursComponent } from './booking-hours.component';

describe('BookingHoursComponent', () => {
  let component: BookingHoursComponent;
  let fixture: ComponentFixture<BookingHoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingHoursComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
