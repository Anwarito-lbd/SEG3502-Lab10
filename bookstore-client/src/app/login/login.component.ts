import { Component } from '@angular/core';
import {AuthenticationService} from '../authentication.service';
import {Router} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    standalone: true,
    imports: [NgIf, FormsModule]
})
export class LoginComponent {
  username = '';
  password = '';
  message!: string;

  constructor(private router: Router,
              private loginService: AuthenticationService) { }

  get isLoggedIn(): boolean {
    return this.loginService.isLoggedIn();
  }

  get loggedUser(): string {
    return this.loginService.getUser();
  }

  checkLogin(): boolean {
    this.message = '';
    if (!this.loginService.login(this.username, this.password)) {
      this.message = 'Invalid Login';
      setTimeout(() => {
        this.message = '';
      }, 2500);
      return false;
    }
    return true;
  }

  logout(): boolean {
    this.loginService.logout();
    return true;
  }
}
