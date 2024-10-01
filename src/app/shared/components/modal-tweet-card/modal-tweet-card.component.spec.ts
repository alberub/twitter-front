import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTweetCardComponent } from './modal-tweet-card.component';

describe('ModalTweetCardComponent', () => {
  let component: ModalTweetCardComponent;
  let fixture: ComponentFixture<ModalTweetCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalTweetCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalTweetCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
