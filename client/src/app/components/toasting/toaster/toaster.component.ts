import {Component, computed} from '@angular/core';
import {ToastService} from '../../../services/toast.service';
import {ToastMessage} from '../../../../types';
import {ToastSuccessComponent} from '../toast-success/toast-success.component';
import {ToastErrorComponent} from '../toast-error/toast-error.component';
import {ToastWarningComponent} from '../toast-warning/toast-warning.component';
import {ToastInfoComponent} from '../toast-info/toast-info.component';

@Component({
  selector: 'app-toaster',
  imports: [
    ToastSuccessComponent,
    ToastErrorComponent,
    ToastWarningComponent,
    ToastInfoComponent
  ],
  templateUrl: './toaster.component.html',
  styleUrl: './toaster.component.scss'
})
export class ToasterComponent {
  // visibleToasts = computed(()=> {
  //   return this.toastService.messages().map((toast:ToastMessage) => {
  //     if(toast.type === 'success') {
  //       return ToastSu;
  //     }
  //   })
  // })

  constructor(public toastService: ToastService) {}
}
