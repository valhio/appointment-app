import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarFooterComponent } from './calendar-footer.component';

describe('CalendarFooterComponent', () => {
  let component: CalendarFooterComponent;
  let fixture: ComponentFixture<CalendarFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendarFooterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
