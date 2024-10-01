import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TweetsRepliesComponent } from './tweets-replies.component';

describe('TweetsRepliesComponent', () => {
  let component: TweetsRepliesComponent;
  let fixture: ComponentFixture<TweetsRepliesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TweetsRepliesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TweetsRepliesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
