import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuMobilComponent } from './menu-mobil.component';

describe('MenuMobilComponent', () => {
  let component: MenuMobilComponent;
  let fixture: ComponentFixture<MenuMobilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuMobilComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuMobilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
