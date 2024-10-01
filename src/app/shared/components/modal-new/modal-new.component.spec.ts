import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNewComponent } from './modal-new.component';

describe('ModalNewComponent', () => {
  let component: ModalNewComponent;
  let fixture: ComponentFixture<ModalNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
