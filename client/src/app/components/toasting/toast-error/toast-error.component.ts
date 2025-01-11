import { Component } from '@angular/core';
import {ToastBaseComponent} from '../toast-base/toast-base.component';
import {BypassSecurityTrustHtmlPipe} from '../../../pipes/bypass-security-trust-html.pipe';

@Component({
  selector: 'app-toast-error',
  imports: [
    BypassSecurityTrustHtmlPipe,
    BypassSecurityTrustHtmlPipe
  ],
  templateUrl: './toast-error.component.html',
  styleUrl: './toast-error.component.scss'
})
export class ToastErrorComponent extends ToastBaseComponent {

}
