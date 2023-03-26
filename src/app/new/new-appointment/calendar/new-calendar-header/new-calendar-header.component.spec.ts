import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCalendarHeaderComponent } from './new-calendar-header.component';

describe('NewCalendarHeaderComponent', () => {
  let component: NewCalendarHeaderComponent;
  let fixture: ComponentFixture<NewCalendarHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewCalendarHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewCalendarHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
