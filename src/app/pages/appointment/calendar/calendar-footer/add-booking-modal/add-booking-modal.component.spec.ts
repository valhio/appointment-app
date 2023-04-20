import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBookingModalComponent } from './add-booking-modal.component';

describe('AddBookingModalComponent', () => {
  let component: AddBookingModalComponent;
  let fixture: ComponentFixture<AddBookingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBookingModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBookingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
