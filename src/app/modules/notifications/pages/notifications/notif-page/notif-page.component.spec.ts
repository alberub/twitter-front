import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifPageComponent } from './notif-page.component';

describe('NotifPageComponent', () => {
  let component: NotifPageComponent;
  let fixture: ComponentFixture<NotifPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotifPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
