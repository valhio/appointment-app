import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingFormConfigComponent } from './booking-form-config.component';

describe('BookingFormConfigComponent', () => {
  let component: BookingFormConfigComponent;
  let fixture: ComponentFixture<BookingFormConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingFormConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingFormConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
