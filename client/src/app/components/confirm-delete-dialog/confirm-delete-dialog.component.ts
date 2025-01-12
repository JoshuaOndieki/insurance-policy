import {Component, input, output} from '@angular/core';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-confirm-delete-dialog',
  imports: [
    NgIf
  ],
  templateUrl: './confirm-delete-dialog.component.html',
  styleUrl: './confirm-delete-dialog.component.css'
})
export class ConfirmDeleteDialogComponent {
  info = input('')
  onCancel = output()
  onConfirm = output()

}
