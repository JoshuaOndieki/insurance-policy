import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastSuccessComponent } from './toast-success.component';

describe('ToastSuccessComponent', () => {
  let component: ToastSuccessComponent;
  let fixture: ComponentFixture<ToastSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastSuccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToastSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
