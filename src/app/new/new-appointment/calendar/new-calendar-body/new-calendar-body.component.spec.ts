import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCalendarBodyComponent } from './new-calendar-body.component';

describe('NewCalendarBodyComponent', () => {
  let component: NewCalendarBodyComponent;
  let fixture: ComponentFixture<NewCalendarBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewCalendarBodyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewCalendarBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
