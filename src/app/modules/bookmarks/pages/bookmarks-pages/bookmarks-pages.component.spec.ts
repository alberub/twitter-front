import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarksPagesComponent } from './bookmarks-pages.component';

describe('BookmarksPagesComponent', () => {
  let component: BookmarksPagesComponent;
  let fixture: ComponentFixture<BookmarksPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookmarksPagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookmarksPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
