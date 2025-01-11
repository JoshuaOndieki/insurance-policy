import {Component, OnDestroy, signal} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {NgClass} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {APIErrorResponse, ToastMessage} from '../../../types';
import {AuthService} from '../../services/auth.service';
import {ToastService} from '../../services/toast.service';
import {finalize} from 'rxjs';

@Component({
  selector: 'app-signin',
  imports: [
    RouterLink,
    NgClass,
    ReactiveFormsModule
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent implements OnDestroy {
  form: FormGroup;
  submitting = signal(false);
  toastsToDestroy: ToastMessage[] = []

  constructor(private authService: AuthService, private fb: FormBuilder, private toastService: ToastService,
              private router: Router,) {
    this.form = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    })
  }

  submit() {
    this.form.markAllAsTouched()
    for (const toast of this.toastsToDestroy) {
      this.toastService.remove(toast);
    }

    if (this.form.valid) {
      this.submitting.set(true)
      this.authService.signin(this.form.value).pipe(finalize(()=> this.submitting.set(false)))
        .subscribe({
          next: (res)=> {
            this.router.navigate(['/'])
          },
          error: err => {
            if (err.status === 401) {
              this.toastsToDestroy.push(
                this.toastService.add({type: 'error', title: 'Invalid Credentials'})
              )
            } else {
              for(const [key, value] of Object.entries((err.error as APIErrorResponse).errors)) {
                for (const error of value) {
                  this.toastsToDestroy.push(
                    this.toastService.add({type: 'error', title: key, details: error})
                  )
                }
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
