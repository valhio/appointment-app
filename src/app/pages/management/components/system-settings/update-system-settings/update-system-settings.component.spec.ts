import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSystemSettingsComponent } from './update-system-settings.component';

describe('UpdateSystemSettingsComponent', () => {
  let component: UpdateSystemSettingsComponent;
  let fixture: ComponentFixture<UpdateSystemSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateSystemSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateSystemSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
