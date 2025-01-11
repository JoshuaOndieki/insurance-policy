import { Component } from '@angular/core';
import {HeaderComponent} from '../../components/header/header.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    HeaderComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
