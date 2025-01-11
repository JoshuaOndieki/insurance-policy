import { Component, input, output } from '@angular/core';
import {ToastMessage} from '../../../../types';

@Component({
  selector: 'app-toast-base',
  imports: [],
  templateUrl: './toast-base.component.html',
  styleUrl: './toast-base.component.scss'
})
export class ToastBaseComponent {
  toastMessage = input.required<ToastMessage>();
  remove = output()
}
