import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCalendarFooterComponent } from './new-calendar-footer.component';

describe('NewCalendarFooterComponent', () => {
  let component: NewCalendarFooterComponent;
  let fixture: ComponentFixture<NewCalendarFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewCalendarFooterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewCalendarFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
