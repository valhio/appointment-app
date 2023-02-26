import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingFormSettingsComponent } from './booking-form-settings.component';

describe('BookingFormSettingsComponent', () => {
  let component: BookingFormSettingsComponent;
  let fixture: ComponentFixture<BookingFormSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingFormSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingFormSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
