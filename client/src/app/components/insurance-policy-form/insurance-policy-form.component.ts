import {Component, input, OnInit, output, signal} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass} from '@angular/common';
import {APIBadRequestError, InsurancePolicy} from '../../../types';
import {InsurancePolicyService} from '../../services/insurance-policy.service';
import {finalize} from 'rxjs';
import {ToastService} from '../../services/toast.service';


@Component({
  selector: 'app-insurance-policy-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './insurance-policy-form.component.html',
  styleUrl: './insurance-policy-form.component.css'
})
export class InsurancePolicyFormComponent implements OnInit {
  form: FormGroup;
  submitting = signal(false)
  deleting = signal(false)

  /**
   * Insurance policy input. Can either be an InsurancePolicy object or null.
   */
  insurancePolicy = input<InsurancePolicy | null>(null);

  /**
   * Event emitted when the modal is closed by clicking `Cancel` or top right `X`.
   */
  onClose = output();

  /**
   * Event emitted after a new insurance policy is created.
   * Provides the newly created InsurancePolicy object.
   */
  afterCreatingEvent = output<InsurancePolicy>();

  /**
   * Event emitted after an existing insurance policy is updated.
   * Provides the updated InsurancePolicy object.
   */
  afterUpdatingEvent = output<InsurancePolicy>();

  /**
   * Event emitted after an insurance policy is deleted.
   * Provides the ID or string identifier of the deleted policy.
   */
  afterDeletingEvent = output<string>();

  /**
   * Event emitted after any of the following operations:
   * 1. Create - `InsurancePolicy` is returned
   * 2. Update - `InsurancePolicy` is returned
   * 3. Delete - `InsurancePolicy.id` is returned
   *
   * Note: The other events (`afterCreatingEvent`, `afterUpdatingEvent`, and `afterDeletingEvent`)
   * will still be emitted alongside this event. Keep note to not execute duplicate actions.
   * @see afterCreatingEvent
   * @see afterUpdatingEvent
   * @see afterDeletingEvent
   */
  afterAnyEvent = output<InsurancePolicy | string>();

  constructor(private formBuilder: FormBuilder, private insurancePolicyService: InsurancePolicyService,
              private toastService: ToastService) {
    this.form = this.formBuilder.group({
      policyNumber: ["", [Validators.required]],
      holderName: ["", [Validators.required]],
      holderEmail: [""],
      holderPhone: [""],
      startDate: ["", [Validators.required]],
      endDate: ["", [Validators.required]],
      premiumAmount: [1, [Validators.required]],
      coverageDetails: [""]
    })
  }

  ngOnInit() {
    let startDate, endDate;
    if (this.insurancePolicy()?.startDate) {
      startDate = new Date(this.insurancePolicy()!.startDate);
      startDate.setMinutes(startDate.getMinutes() - startDate.getTimezoneOffset());
    }
    if (this.insurancePolicy()?.endDate) {
      endDate = new Date(this.insurancePolicy()!.endDate);
      endDate.setMinutes(endDate.getMinutes() - endDate.getTimezoneOffset());
    }

    this.form = this.formBuilder.group({
      policyNumber: [this.insurancePolicy()?.policyNumber ?? "", [Validators.required]],
      holderName: [this.insurancePolicy()?.holderName ?? "", [Validators.required]],
      holderEmail: [this.insurancePolicy()?.holderEmail ?? ""],
      holderPhone: [this.insurancePolicy()?.holderPhone ?? ""],
      startDate: [startDate?.toISOString().slice(0,16) ?? "", [Validators.required]],
      endDate: [endDate?.toISOString().slice(0,16) ?? "", [Validators.required]],
      premiumAmount: [this.insurancePolicy()?.premiumAmount ?? 1, [Validators.required]],
      coverageDetails: [this.insurancePolicy()?.coverageDetails ?? ""]
    })
  }

  submit(): void {
    if (this.form.valid) {
      this.submitting.set(true)
      this.insurancePolicyService.save({...this.formValue, id: this.insurancePolicy()?.id})
        .pipe(finalize(() => {
          this.submitting.set(false)
        }))
        .subscribe({
          next: res=> {
            this.toastService.add({
              title:'Successfully ' + (this.insurancePolicy() ? 'updated' : 'added') + ' insurance policy '
                + this.formValue.policyNumber + '!',
              type:'success'}, 5);

            if(this.insurancePolicy()?.id) {
              this.afterUpdatingEvent.emit(res)
            } else {
              this.afterCreatingEvent.emit(res)
            }
            this.afterAnyEvent.emit(res)
          },
          error: err => {
            const errorMessages = []
            if(err.status === 409) {
              errorMessages.push(`<div>${err.error}</div>`)
            } else if(err.status === 400) {
              for (const error of err.error as APIBadRequestError[]) {
                errorMessages.push(`<div>${error.errorMessage}</div>`)
              }
            } else {
                errorMessages.push(`<div>An unexpected error occurred. Check if you have an active internet connection.</div>`)
            }

            this.toastService.add({
              title: 'Error ' + (this.insurancePolicy() ? 'updating' : 'adding') + ' insurance policy '
                + this.formValue.policyNumber + '!',
              details: errorMessages.join('\n'),
              type:'error'}, 5);
          }
        })
    }
  }

  delete(): void {
    this.deleting.set(true)
    this.insurancePolicyService.remove(this.insurancePolicy()?.id ?? '')
      .pipe(finalize(() => {
        this.deleting.set(false)
      }))
      .subscribe({
        next: ()=> {
          this.toastService.add({
            title: "Successfully deleted insurance policy.",
            type:'success'}, 5);

          this.afterDeletingEvent.emit(this.insurancePolicy()!.id)
          this.afterAnyEvent.emit(this.insurancePolicy()!.id)
        },
        error: () => {
          this.toastService.add({
            title: 'Unable to delete insurance policy.',
            type:'error'}, 5);
        }
      })
  }

  get formValue() {
    const rawFormValue = {...this.form.value};
    this.convertEmptyStringsToNull(rawFormValue);
    return {
      ...rawFormValue,
      startDate: rawFormValue.startDate ? new Date(rawFormValue.startDate).toISOString() : null,
      endDate: rawFormValue.startDate ? new Date(rawFormValue.endDate).toISOString() : null
    };
  }

  private convertEmptyStringsToNull(obj: Record<string, any>): Record<string, any> {
    for (const key in obj) {
      if (obj[key] === '') {
        obj[key] = null;
      }
    }
    return obj;
  }
}
