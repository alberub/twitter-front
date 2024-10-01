import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageTweetComponent } from './image-tweet.component';

describe('ImageTweetComponent', () => {
  let component: ImageTweetComponent;
  let fixture: ComponentFixture<ImageTweetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageTweetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageTweetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
