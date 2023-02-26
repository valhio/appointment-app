import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingFormManagementComponent } from './booking-form-management.component';

describe('BookingFormManagementComponent', () => {
  let component: BookingFormManagementComponent;
  let fixture: ComponentFixture<BookingFormManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingFormManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingFormManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
