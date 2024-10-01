import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalReplyComponent } from './modal-reply.component';

describe('ModalReplyComponent', () => {
  let component: ModalReplyComponent;
  let fixture: ComponentFixture<ModalReplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalReplyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalReplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
