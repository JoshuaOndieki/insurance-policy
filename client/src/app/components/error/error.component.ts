import {Component, input} from '@angular/core';

@Component({
  selector: 'app-error',
  imports: [],
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss'
})
export class ErrorComponent {
  code = input<string | number>('')
  title = input.required()
  details = input('')
}
