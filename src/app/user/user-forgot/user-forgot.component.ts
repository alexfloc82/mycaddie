import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-user-forgot',
  templateUrl: './user-forgot.component.html',
  styleUrls: ['./user-forgot.component.css']
})
export class UserForgotComponent implements OnInit {
  email: string;

  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  sendEmail(){
    this.authService.sendResetPassword(this.email);
  }

}

