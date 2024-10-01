import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareMenuMobileComponent } from './share-menu-mobile.component';

describe('ShareMenuMobileComponent', () => {
  let component: ShareMenuMobileComponent;
  let fixture: ComponentFixture<ShareMenuMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareMenuMobileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareMenuMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
