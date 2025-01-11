import {Component, signal} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {User} from '../../../types';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  authUser

  constructor(private authService: AuthService) {
    this.authUser = authService.authUser
  }

  signout() {
    this.authService.signout()
  }
}
