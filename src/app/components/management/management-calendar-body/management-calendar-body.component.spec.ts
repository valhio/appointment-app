import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementCalendarBodyComponent } from './management-calendar-body.component';

describe('ManagementCalendarBodyComponent', () => {
  let component: ManagementCalendarBodyComponent;
  let fixture: ComponentFixture<ManagementCalendarBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagementCalendarBodyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagementCalendarBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
