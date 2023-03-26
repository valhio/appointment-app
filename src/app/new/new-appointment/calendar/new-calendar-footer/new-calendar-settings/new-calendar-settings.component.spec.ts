import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCalendarSettingsComponent } from './new-calendar-settings.component';

describe('NewCalendarSettingsComponent', () => {
  let component: NewCalendarSettingsComponent;
  let fixture: ComponentFixture<NewCalendarSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewCalendarSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewCalendarSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
