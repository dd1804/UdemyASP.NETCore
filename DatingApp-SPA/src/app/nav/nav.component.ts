import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertityService } from '../_services/alertity.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};

  constructor(public authService: AuthService, private alertifyService: AlertityService, private router: Router) {}

  ngOnInit() {
  }

  login() {
    this.authService.login(this.model).subscribe(
      next => {
        this.alertifyService.success('Logged in succesfully');
      },
      error => {
        this.alertifyService.error(error);
      },
      () => {
        this.router.navigate(['/members']);
      }
    );
  }

  loggedIn() {
    return this.authService.loggedIn();
  }

  logout() {
    localStorage.removeItem('token');
    this.alertifyService.message('Logged out');
    this.router.navigate(['/home']);
  }

}