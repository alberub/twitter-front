import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoverModalComponent } from './hover-modal.component';

describe('HoverModalComponent', () => {
  let component: HoverModalComponent;
  let fixture: ComponentFixture<HoverModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HoverModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HoverModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
