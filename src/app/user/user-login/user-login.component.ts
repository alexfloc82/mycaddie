import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import "firebase/storage";
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {
  documents: any[];
  url: string;
  email: string;
  password: string;

  constructor(
    private auth: AuthService,
    private router: Router) {
  }

  ngOnInit() {
  }

  gotoMenu(menu: string): void {
    this.router.navigate([menu]);
  }

  signIn() {
    this.router.navigate(['/user', 'signin']);
  }

  login() {
    this.auth.login(this.email, this.password)
    .then(a => {
      this.email = this.password = '';
      this.router.navigate(['game']);
    })
    
  }

  loginWithGoogle(){
    this.auth.loginWithGoogle().then(a => {
      this.router.navigate(['game']);
    });

  }

  resetPassword() {
    this.router.navigate(['user/forgot']);
  }

}