import {Component, OnDestroy, signal} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {NgClass, NgIf} from '@angular/common';
import {finalize} from 'rxjs';
import {ToastService} from '../../services/toast.service';
import {APIErrorResponse, ToastMessage} from '../../../types';

@Component({
  selector: 'app-signup',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NgIf,
    NgClass
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnDestroy {
  form: FormGroup;
  submitting = signal(false);
  toastsToDestroy: ToastMessage[] = []

  constructor(private authService: AuthService, private fb: FormBuilder, private toastService: ToastService,
              private router: Router,) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required, Validators.minLength(6),
        Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$')]
      ],
    })
  }

  submit() {
    this.form.markAllAsTouched()
    for (const toast of this.toastsToDestroy) {
      this.toastService.remove(toast);
    }

    if (this.form.valid) {
      this.submitting.set(true)
      this.authService.signup(this.form.value).pipe(finalize(()=> this.submitting.set(false)))
        .subscribe({
          next: (res)=> {
            this.toastService.add({type: 'success', title: 'You have successfully created your account.'})
            this.router.navigate(['/signin'])
          },
          error: err => {
            for(const [key, value] of Object.entries((err.error as APIErrorResponse).errors)) {
              for (const error of value) {
                this.toastsToDestroy.push(
                  this.toastService.add({type: 'error', title: key, details: error})
                )
              }
            }
          }
        })
    }
  }

  ngOnDestroy(): void {
    for (const toast of this.toastsToDestroy) {
      this.toastService.remove(toast);
    }
  }
}
