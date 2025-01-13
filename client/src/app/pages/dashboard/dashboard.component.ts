import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component, computed, effect,
  ElementRef, model,
  ResourceStatus,
  signal,
  ViewChild
} from '@angular/core';
import {HeaderComponent} from '../../components/header/header.component';
import {rxResource} from '@angular/core/rxjs-interop';
import {InsurancePolicyService} from '../../services/insurance-policy.service';
import {CurrencyPipe, DatePipe, NgClass, NgIf, NgOptimizedImage, NgStyle} from '@angular/common';
import {ErrorComponent} from '../../components/error/error.component';
import {dateFormatter} from '../../../utils';
import {InsurancePolicy} from '../../../types';
import {InsurancePolicyFormComponent} from '../../components/insurance-policy-form/insurance-policy-form.component';
import {finalize, of} from 'rxjs';
import {ToastService} from '../../services/toast.service';
import {ConfirmDeleteDialogComponent} from '../../components/confirm-delete-dialog/confirm-delete-dialog.component';
import {FormsModule} from '@angular/forms';
import {HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  imports: [
    HeaderComponent,
    NgStyle,
    ErrorComponent,
    NgIf,
    CurrencyPipe,
    DatePipe,
    InsurancePolicyFormComponent,
    ConfirmDeleteDialogComponent,
    NgOptimizedImage,
    FormsModule,
    NgClass
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements AfterViewChecked {
  @ViewChild('policyNumberTH') policyNumberTH!: ElementRef;
  leftOffset = 0;
  showInsurancePolicyForm = signal(false);
  insurancePolicyOnForm = signal<InsurancePolicy | null>(null);
  showConfirmDeleteDialog = signal(false)
  insurancePolicyToDelete = signal<InsurancePolicy | null>(null)

  page = model(1)
  pageSize = model(10)
  sortField = model<"AddedDate" | "StartDate" | "PremiumAmount">('AddedDate')
  sortOrder = model<"asc" | "desc">("desc")
  search = model("")
  metadata = signal<HttpParams | null>(null)

  firstLoad = signal<number | undefined>(undefined)
  insurancePoliciesResource = rxResource({
    request: ()=> this.metadata(),
    loader: ({request}) => {
      return request ? this.insurancePolicyService.getAll(request) : of(null)
    }
  })

  insurancePolicies = computed(()=> this.insurancePoliciesResource.value()?.data)
  insurancePoliciesMetadata = computed(()=> this.insurancePoliciesResource.value()?.metadata)

  constructor(private insurancePolicyService: InsurancePolicyService, private cdr: ChangeDetectorRef,
              private toastService: ToastService) {
    effect(() => {
      const params = new HttpParams()
        .set('page', this.page())
        .set('pageSize', this.pageSize())
        .set('sortField', this.sortField())
        .set('sortOrder', this.sortOrder())
        .set('search', this.search())
      this.metadata.set(params)
    });

    effect(() => {
      if (this.firstLoad() === undefined)
        this.firstLoad.set(this.insurancePoliciesMetadata()?.totalCount)
    })
  }

  insurancePolicyStatus(policy: InsurancePolicy) {
    if(new Date(policy.startDate) > new Date()) {
      return 'pending'
    }
    if(new Date(policy.endDate) > new Date()) {
      return 'active'
    } else {
      return 'closed'
    }
  }

  ngAfterViewChecked() {
    if (this.policyNumberTH && this.policyNumberTH.nativeElement.offsetWidth !== this.leftOffset) {
      this.leftOffset = this.policyNumberTH.nativeElement.offsetWidth;
      this.cdr.detectChanges();
    }
  }

  afterAnyFormEvent(insurancePolicy: InsurancePolicy | string) {

    // TODO: Figure out why local update is not working
    // if(typeof insurancePolicy === 'string') {
    //   this.insurancePoliciesResource.update(current => {
    //     return current?.filter(ip => ip.id !== insurancePolicy)
    //   })
    // } else {
    //   this.insurancePoliciesResource.update(current =>
    //       current?.map(ip => ip.id === insurancePolicy.id ? insurancePolicy : ip))
    // }
    this.insurancePoliciesResource.reload() // TODO: replace with above solution
  }

  deleteInsurancePolicy(insurancePolicyId: string) {
    this.insurancePolicyService.remove(insurancePolicyId)
      .subscribe({
        next: ()=> {
          this.toastService.add({
            title: "Successfully deleted insurance policy.",
            type:'success'}, 5);

          // TODO: Figure out why local update is not working
          // this.insurancePoliciesResource.value.update(current => {
          //   return current?.filter(ip => ip.id !== insurancePolicyId)
          // })
          this.insurancePoliciesResource.reload() // TODO: replace with above solution
          },
        error: () => {
          this.toastService.add({
            title: 'Unable to delete insurance policy.',
            type:'error'}, 5);
        }
      })
  }

  protected readonly ResourceStatus = ResourceStatus;
  protected readonly dateFormatter = dateFormatter;
  protected readonly Math = Math;
}
