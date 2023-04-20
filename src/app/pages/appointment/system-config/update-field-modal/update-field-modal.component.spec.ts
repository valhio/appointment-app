import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFieldModalComponent } from './update-field-modal.component';

describe('UpdateFieldModalComponent', () => {
  let component: UpdateFieldModalComponent;
  let fixture: ComponentFixture<UpdateFieldModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateFieldModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateFieldModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
