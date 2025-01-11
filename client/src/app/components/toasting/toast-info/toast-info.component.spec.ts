import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastInfoComponent } from './toast-info.component';

describe('ToastInfoComponent', () => {
  let component: ToastInfoComponent;
  let fixture: ComponentFixture<ToastInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToastInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
