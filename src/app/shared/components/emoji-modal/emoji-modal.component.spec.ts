import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmojiModalComponent } from './emoji-modal.component';

describe('EmojiModalComponent', () => {
  let component: EmojiModalComponent;
  let fixture: ComponentFixture<EmojiModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmojiModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmojiModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
