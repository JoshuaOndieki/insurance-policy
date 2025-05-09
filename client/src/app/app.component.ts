import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ToasterComponent} from './components/toasting/toaster/toaster.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToasterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'insurancePolicy';
}
