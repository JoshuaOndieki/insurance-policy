import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastWarningComponent } from './toast-warning.component';

describe('ToastWarningComponent', () => {
  let component: ToastWarningComponent;
  let fixture: ComponentFixture<ToastWarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastWarningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToastWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
