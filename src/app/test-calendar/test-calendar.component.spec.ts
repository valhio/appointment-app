import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCalendarComponent } from './test-calendar.component';

describe('TestCalendarComponent', () => {
  let component: TestCalendarComponent;
  let fixture: ComponentFixture<TestCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestCalendarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
