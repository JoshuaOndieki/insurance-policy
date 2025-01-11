import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastBaseComponent } from './toast-base.component';

describe('ToastBaseComponent', () => {
  let component: ToastBaseComponent;
  let fixture: ComponentFixture<ToastBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastBaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToastBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
